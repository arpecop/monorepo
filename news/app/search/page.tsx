"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Clock, Filter, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults] = useState([
    {
      id: 1,
      title:
        "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
      excerpt:
        "World leaders unite in unprecedented commitment to reduce global carbon footprint by 50% within the next decade.",
      image: "/placeholder.svg?height=150&width=200",
      category: "Environment",
      author: "Sarah Johnson",
      publishedAt: "2024-01-15",
      readTime: "5 min read",
      relevance: 95,
    },
    {
      id: 2,
      title: "Tech Giants Announce Revolutionary AI Partnership",
      excerpt:
        "Major technology companies collaborate on next-generation artificial intelligence research and development.",
      image: "/placeholder.svg?height=150&width=200",
      category: "Technology",
      author: "David Rodriguez",
      publishedAt: "2024-01-14",
      readTime: "3 min read",
      relevance: 88,
    },
    {
      id: 3,
      title: "Olympic Games Preparation Enters Final Phase",
      excerpt:
        "Athletes and organizers make final preparations for the upcoming international sporting competition.",
      image: "/placeholder.svg?height=150&width=200",
      category: "Sports",
      author: "James Thompson",
      publishedAt: "2024-01-13",
      readTime: "4 min read",
      relevance: 82,
    },
    {
      id: 4,
      title: "Renewable Energy Investment Reaches Record High",
      excerpt:
        "Global investment in renewable energy technologies surpasses $300 billion in 2024, marking a significant milestone.",
      image: "/placeholder.svg?height=150&width=200",
      category: "Energy",
      author: "Emily Watson",
      publishedAt: "2024-01-12",
      readTime: "6 min read",
      relevance: 79,
    },
    {
      id: 5,
      title: "Cybersecurity Threats Evolve with New Attack Methods",
      excerpt:
        "Security experts warn of sophisticated new cyber attack techniques targeting businesses and individuals worldwide.",
      image: "/placeholder.svg?height=150&width=200",
      category: "Technology",
      author: "Michael Torres",
      publishedAt: "2024-01-11",
      readTime: "4 min read",
      relevance: 75,
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
  };

  const totalResults = searchResults.length;
  const searchTime = "0.23";

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6 font-playfair">
              Search Results
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search for news, articles, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Search Info and Filters */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-muted-foreground">
                About {totalResults.toLocaleString()} results ({searchTime}{" "}
                seconds)
              </div>

              <div className="flex items-center space-x-4">
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="date">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="all-time">
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="past-day">Past Day</SelectItem>
                    <SelectItem value="past-week">Past Week</SelectItem>
                    <SelectItem value="past-month">Past Month</SelectItem>
                    <SelectItem value="past-year">Past Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {searchResults.map((result) => (
                <Card
                  key={result.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex space-x-6">
                      <div className="flex-shrink-0">
                        <Image
                          src={result.image || "/placeholder.svg"}
                          alt={result.title}
                          width={200}
                          height={150}
                          className="rounded-lg object-cover w-48 h-32"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{result.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {result.relevance}% match
                          </span>
                        </div>

                        <h2 className="text-xl font-semibold text-foreground mb-2 hover:text-primary">
                          <Link href={`/article/${result.id}`}>
                            {result.title}
                          </Link>
                        </h2>

                        <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {result.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>By {result.author}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {result.readTime}
                            </span>
                            <span>•</span>
                            <span>
                              {new Date(
                                result.publishedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/article/${result.id}`}>
                              Read Article
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 mt-12">
              <Button variant="outline">Previous</Button>
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">4</Button>
              <Button variant="outline">5</Button>
              <Button variant="outline">Next</Button>
            </div>

            {/* Search Suggestions */}
            <div className="mt-12 p-6 bg-card rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Related Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  climate change
                </Button>
                <Button variant="outline" size="sm">
                  environmental policy
                </Button>
                <Button variant="outline" size="sm">
                  carbon emissions
                </Button>
                <Button variant="outline" size="sm">
                  renewable energy
                </Button>
                <Button variant="outline" size="sm">
                  sustainability
                </Button>
                <Button variant="outline" size="sm">
                  global warming
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
