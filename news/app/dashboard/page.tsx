"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { BookmarkIcon, Clock, User, Bell, Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const [notifications, setNotifications] = useState({
    breaking: true,
    daily: true,
    weekly: false,
    categories: true,
  });

  const savedArticles = [
    {
      id: 1,
      title: "Global Climate Summit Reaches Historic Agreement",
      category: "Environment",
      savedAt: "2 days ago",
      readTime: "5 min read",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      title: "Tech Giants Announce AI Partnership",
      category: "Technology",
      savedAt: "1 week ago",
      readTime: "3 min read",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 3,
      title: "Olympic Games Preparation Update",
      category: "Sports",
      savedAt: "2 weeks ago",
      readTime: "4 min read",
      image: "/placeholder.svg?height=100&width=150",
    },
  ];

  const readingHistory = [
    {
      id: 1,
      title: "Global Markets Show Recovery Signs",
      category: "Business",
      readAt: "Today",
      readTime: "4 min read",
    },
    {
      id: 2,
      title: "Renewable Energy Investment Reaches Record High",
      category: "Energy",
      readAt: "Yesterday",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "Space Mission Launches Successfully",
      category: "Science",
      readAt: "2 days ago",
      readTime: "5 min read",
    },
  ];

  const recommendations = [
    {
      id: 1,
      title: "The Future of Sustainable Transportation",
      category: "Environment",
      readTime: "7 min read",
      image: "/placeholder.svg?height=100&width=150",
      reason: "Based on your interest in environmental news",
    },
    {
      id: 2,
      title: "Breakthrough in Quantum Computing",
      category: "Technology",
      readTime: "5 min read",
      image: "/placeholder.svg?height=100&width=150",
      reason: "Similar to articles you have read",
    },
  ];

  const readingStats = {
    articlesRead: 47,
    timeSpent: "12h 34m",
    favoriteCategory: "Technology",
    streak: 15,
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground">
            Here is your personalized news dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {readingStats.articlesRead}
              </div>
              <p className="text-sm text-muted-foreground">Articles Read</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {readingStats.timeSpent}
              </div>
              <p className="text-sm text-muted-foreground">
                Time Spent Reading
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {readingStats.favoriteCategory}
              </div>
              <p className="text-sm text-muted-foreground">Favorite Category</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {readingStats.streak} days
              </div>
              <p className="text-sm text-muted-foreground">Reading Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="saved">Saved Articles</TabsTrigger>
            <TabsTrigger value="history">Reading History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Personalized Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Recommended for You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.map((article) => (
                    <div
                      key={article.id}
                      className="flex space-x-4 p-4 border rounded-lg hover:bg-muted"
                    >
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={150}
                        height={100}
                        className="rounded object-cover w-20 h-16"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {article.readTime}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {article.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {readingHistory.slice(0, 3).map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{article.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {article.readAt}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookmarkIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  Saved Articles ({savedArticles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex space-x-4 p-4 border rounded-lg hover:bg-muted"
                    >
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        width={150}
                        height={100}
                        className="rounded object-cover w-24 h-20"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <span>{article.readTime}</span>
                          <span>Saved {article.savedAt}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" asChild>
                            <Link href={`/article/${article.id}`}>
                              Read Article
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Reading History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {readingHistory.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <span>{article.readTime}</span>
                          <span>Read {article.readAt}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <BookmarkIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/article/${article.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-muted-foreground" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself" />
                  </div>
                  <Button>Update Profile</Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-muted-foreground" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Breaking News Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified of urgent news
                      </p>
                    </div>
                    <Switch
                      checked={notifications.breaking}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          breaking: checked,
                        }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Newsletter</p>
                      <p className="text-sm text-muted-foreground">
                        Daily summary of top stories
                      </p>
                    </div>
                    <Switch
                      checked={notifications.daily}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          daily: checked,
                        }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">
                        Weekly roundup of important news
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weekly}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          weekly: checked,
                        }))
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Category Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Updates from your favorite categories
                      </p>
                    </div>
                    <Switch
                      checked={notifications.categories}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          categories: checked,
                        }))
                      }
                    />
                  </div>
                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
