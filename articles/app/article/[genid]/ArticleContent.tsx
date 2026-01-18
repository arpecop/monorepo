import CommentSection from '@/app/components/CommentSection';

export default function ArticleContent({ genid }: { genid: string }) {
  return <CommentSection genid={genid} />;
}
