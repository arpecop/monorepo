import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db, vsearch } from "@/app/_lib/sql";
import Link from "next/link";

// import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { markdown } from "@/app/_lib/markdown";
import { uniq } from "lodash";
import { readtime, summarize, weightFrequencySort } from "@/app/_lib/timeago";
import {
  Clock,
  Share2,
  Bookmark,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

type D = [
  {
    id: number;
    title: string;
    text: string;
    date: string;
    embed: string;
    cat?: string;
  }[],
  { title: string; genid: string }[],
  { cat: string; title: string }[],
  { cat: string; title: string }[],
  { id: number; title: string; text: string; genid: string }[],
  { cat: string; title: string }[],
];
export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const queries = [
    db`select id, title, text, date, cat,embed from qa.ai where genid = ${slug} limit 1`,
    // db`select genid, title from qa.tags ORDER BY embed <-> (SELECT embed FROM qa.ai WHERE genid = ${slug}) LIMIT 5`,
    db`select genid, title from qa.cats ORDER BY embed <-> (SELECT embed FROM qa.ai WHERE genid = ${slug}) LIMIT 5`,
    db`select title, genid from qa.ai order by id desc limit 5`,
    db`select genid, title from qa.nytimes ORDER BY embed <-> (SELECT embed FROM qa.ai WHERE genid = ${slug}) LIMIT 5`,
  ];

  const [articleResult, categories, latestPosts, nytCoverage] =
    (await Promise.all(queries)) as unknown as D;
  const { title, text, date, cat } = articleResult[0];
  const summary = summarize(text).split(".");
  const relatedArticles = await vsearch(articleResult[0].embed, "ai");
  const tags = await vsearch(articleResult[0].embed, "tags");

  console.log(tags);

  const tagsx = uniq(
    weightFrequencySort(
      tags
        .flatMap((x) => x.title)
        .join(" ")
        .replaceAll("['", "")
        .replaceAll("\n", "")
        .replaceAll("']", "")
        .split("' '"),
    ),
  ).slice(0, 10);

  const article = {
    title: title.replace(/#/g, "").replace(/\*/g, ""),
    subtitle: summary[0] + ". " + summary[1] + ". ",
    content: markdown(text),

    publishedAt: date,
    readTime: readtime(text) + " min read",
    category: cat,
    tags: tagsx,
    image: "/placeholder.svg?height=400&width=800",
    likes: 1247,
    comments: 89,
    shares: 234,
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            <article>
              {/* Article Header */}
              <header className="mb-8">
                <Badge className="mb-4">{article.category}</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight font-playfair">
                  {article.title}
                </h1>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <img
                      alt=""
                      width={100}
                      height={100}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <span>By </span>
                  </div>
                  <span>•</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </span>
                </div>
              </header>

              <div
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <Separator className="my-8" />

              {/* Article Footer */}
              <footer className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Twitter className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Facebook className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Linkedin className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              </footer>
            </article>

            {/* Comments Section */}
            <section className="mt-12">
              {/* Comment Form */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Leave a Comment
                </h3>
                <form className="space-y-4">
                  <textarea
                    placeholder="Write your comment..."
                    rows={4}
                    className="w-full p-2 border rounded-lg bg-transparent"
                  ></textarea>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </form>
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Author Box */}

              {/* Related Articles */}
              <div>
                <h3 className="text-xl font-bold text-foreground border-b">
                  Related Articles
                </h3>
                <div className="space-y-2">
                  {relatedArticles?.map((article) => (
                    <Link
                      key={article.genid}
                      href={`/post/${article.genid}`}
                      className="py-2 bg-primary/10  hover:bg-primary/20 transition-colors border-b font-bold flex text-sm"
                    >
                      {article.title.replace(/#/g, "").replace(/\*/g, "")}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
