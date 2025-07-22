import { Button } from "@/components/ui/button";
import NewsItems from "@/components/newspostitems";
import { Badge } from "@/components/ui/badge";
import { timeAgo, readtime, summarize } from "@/app/_lib/timeago";
import { db, type NewsItem } from "@/app/_lib/sql";
import { Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const data =
    (await db`select * from qa.ai order by id desc limit  12`) as NewsItem[];

  const featuredArticle = {
    title:
      "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
    excerpt:
      "World leaders unite in unprecedented commitment to reduce global carbon footprint by 50% within the next decade.",
    image: "/placeholder.svg?height=400&width=800",
    category: "Environment",
    readTime: "5 min read",
    author: "Sarah Johnson",
    publishedAt: "2 hours ago",
  };

  const { title, date, cat, text, genid } = data[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="mb-4">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Badge className="bg-red-600 hover:bg-red-700">
                  Breaking News
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {timeAgo(date)}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-light text-foreground leading-tight font-playfair">
                {title.replace(/#/g, "").replace(/\*/g, "")}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {summarize(text)}.
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>By {featuredArticle.author}</span>
                <span>•</span>
                <span>{readtime(text)} minute read</span>
                <span>•</span>
                <Badge variant="outline">{cat}</Badge>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link href={"/post/" + genid}>
                  Read Full Story <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/_next/logorenewz.png"
                alt={featuredArticle.title}
                width={800}
                height={400}
                className="rounded-lg    w-full "
              />
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto p-4">
        <NewsItems posts={data} />
      </div>
      {/* Latest News Section */}
    </div>
  );
}
