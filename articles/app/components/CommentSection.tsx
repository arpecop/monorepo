'use client';

import { useState, useEffect } from 'react';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://hasura.rudixops.dev/v1/graphql';

type Comment = {
  id: number;
  genid: number;
  replyto: number | null;
  text: string;
  username: string;
  replies?: Comment[];
};

type SortOption = 'new' | 'old' | 'top';

export default function CommentSection({ genid }: { genid: string }) {
  const [username, setUsername] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [insertLoading, setInsertLoading] = useState(false);
  const genidInt = parseInt(genid, 10);

  const getOrderBy = () => {
    switch (sortBy) {
      case 'new':
        return [{ id: 'desc' }];
      case 'old':
        return [{ id: 'asc' }];
      case 'top':
        return [{ id: 'desc' }];
      default:
        return [{ id: 'desc' }];
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetComments($_eq: Int!, $orderBy: [qa_comments_order_by!]) {
              qa_comments(where: {genid: {_eq: $_eq}}, order_by: $orderBy) {
                id
                genid
                replyto
                text
                username
              }
            }
          `,
          variables: { _eq: genidInt, orderBy: getOrderBy() },
        }),
      });
      const result = await response.json();
      setComments(result.data?.qa_comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [sortBy]);

  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      // Root comments have replyto === genid
      if (comment.replyto && comment.replyto !== comment.genid && commentMap.has(comment.replyto)) {
        const parent = commentMap.get(comment.replyto)!;
        parent.replies!.push(commentWithReplies);
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !username.trim()) return;

    setInsertLoading(true);
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation InsertComment($object: qa_comments_insert_input!) {
              insert_qa_comments_one(object: $object) {
                id
              }
            }
          `,
          variables: {
            object: {
              genid: genidInt,
              replyto: genidInt,
              text: commentText,
              username: username,
            },
          },
        }),
      });
      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        alert('Error posting comment: ' + result.errors[0].message);
      } else {
        setCommentText('');
        await fetchComments();
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Error posting comment: ' + err);
    } finally {
      setInsertLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: number) => {
    if (!replyText.trim() || !username.trim()) return;

    setInsertLoading(true);
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation InsertComment($object: qa_comments_insert_input!) {
              insert_qa_comments_one(object: $object) {
                id
              }
            }
          `,
          variables: {
            object: {
              genid: genidInt,
              replyto: parentId,
              text: replyText,
              username: username,
            },
          },
        }),
      });
      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        alert('Error posting reply: ' + result.errors[0].message);
      } else {
        setReplyText('');
        setReplyingTo(null);
        await fetchComments();
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Error posting reply: ' + err);
    } finally {
      setInsertLoading(false);
    }
  };

  const renderComment = (comment: Comment, depth: number = 0, isLast: boolean = false) => {
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className="relative">
        {depth > 0 && (
          <>
            {/* Vertical line (hidden if last comment) */}
            {!isLast && (
              <div 
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-300 dark:bg-zinc-700"
                style={{ left: `${(depth - 1) * 2}rem` }}
              />
            )}
            
            {/* Hook connector with quarter circle */}
            <div 
              className="absolute"
              style={{ 
                left: `${(depth - 1) * 2}rem`,
                top: '1.5rem',
                width: '1.5rem',
                height: '1.5rem',
              }}
            >
              {/* Quarter circle - bottom-left visible only */}
              <div 
                className="absolute border-b-2 border-l-2 border-zinc-300 dark:border-zinc-700"
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderBottomLeftRadius: '1.5rem',
                  left: '0',
                  top: '-1.5rem',
                }}
              />
            </div>
          </>
        )}

        <div 
          className="mb-4"
          style={{ 
            marginLeft: depth > 0 ? `${depth * 2 + 1.5}rem` : '0'
          }}
        >
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {comment.username}
                </span>
              </div>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap mb-2">
              {comment.text}
            </p>
            <button
              onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {isReplying ? 'Cancel' : 'Reply'}
            </button>

            {isReplying && (
              <div className="mt-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                  rows={3}
                />
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyText.trim() || !username.trim()}
                  className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:disabled:bg-zinc-700"
                >
                  Reply
                </button>
              </div>
            )}
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 relative">
              {comment.replies.map((reply, index) => 
                renderComment(reply, depth + 1, index === comment.replies!.length - 1)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
          Comments ({comments.length})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('new')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setSortBy('old')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'old'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            Old
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'top'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            Top
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmitComment} className="mb-8">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full mb-3 rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          rows={4}
        />
        <button
          type="submit"
          disabled={insertLoading || !commentText.trim() || !username.trim()}
          className="mt-3 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:disabled:bg-zinc-700"
        >
          {insertLoading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {loading && <p className="text-zinc-500 dark:text-zinc-400">Loading comments...</p>}

      {!loading && (
        <div className="space-y-2">
          {commentTree.map(comment => renderComment(comment))}
          {commentTree.length === 0 && (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
