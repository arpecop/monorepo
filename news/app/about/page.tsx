import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Users,
  Globe,
  Target,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Michael Chen",
      role: "Editor-in-Chief",
      bio: "Award-winning journalist with 20+ years in international news reporting.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "michael@maxwire.com",
      },
    },
    {
      name: "Sarah Johnson",
      role: "Environmental Correspondent",
      bio: "Specialized in climate policy and environmental issues for over 15 years.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@maxwire.com",
      },
    },
    {
      name: "David Rodriguez",
      role: "Technology Editor",
      bio: "Former Silicon Valley insider covering tech innovation and digital transformation.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "david@maxwire.com",
      },
    },
    {
      name: "Emily Watson",
      role: "Business Reporter",
      bio: "Financial markets expert with deep knowledge of global economic trends.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "emily@maxwire.com",
      },
    },
    {
      name: "James Thompson",
      role: "Sports Editor",
      bio: "Veteran sports journalist covering major international sporting events.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "james@maxwire.com",
      },
    },
    {
      name: "Lisa Park",
      role: "Lifestyle Editor",
      bio: "Cultural trends expert focusing on lifestyle, health, and social issues.",
      image: "/placeholder.svg?height=200&width=200",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "lisa@maxwire.com",
      },
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: "Excellence in Journalism",
      description:
        "Winner of 15+ prestigious journalism awards including the Digital Media Excellence Award",
    },
    {
      icon: Users,
      title: "Trusted by Millions",
      description:
        "Over 5 million monthly readers across our digital platforms worldwide",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description:
        "Correspondents in 50+ countries providing comprehensive international coverage",
    },
    {
      icon: Target,
      title: "Accuracy First",
      description:
        "99.8% accuracy rate with rigorous fact-checking and editorial standards",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-playfair">
              About Max Wire News
            </h1>
            <p className="text-xl lg:text-2xl text-primary-foreground/80 leading-relaxed">
              Your trusted source for accurate, timely, and comprehensive news
              coverage since 2010. We re committed to delivering the stories
              that matter most to you.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-card-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  At Max Wire News, we believe that informed citizens are the
                  foundation of a healthy democracy. Our mission is to provide
                  accurate, unbiased, and comprehensive news coverage that
                  empowers people to make informed decisions about their lives
                  and communities.
                </p>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  We are committed to the highest standards of journalistic
                  integrity, transparency, and accountability. Our team of
                  experienced journalists and editors work tirelessly to bring
                  you the stories that matter, from breaking news to in-depth
                  analysis.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Integrity</Badge>
                  <Badge variant="secondary">
                    Accuracy
                  </Badge>
                  <Badge variant="secondary">
                    Transparency
                  </Badge>
                  <Badge variant="secondary">
                    Independence
                  </Badge>
                </div>
              </div>
              <div>
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Max Wire News newsroom"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Achievements
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <achievement.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {achievement.title}
                    </h3>
                    <p className="text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-card-foreground text-center mb-12">
              Meet Our Team
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="rounded-full mx-auto mb-4 object-cover w-32 h-32"
                    />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={member.social.linkedin}>
                          <Linkedin className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={member.social.twitter}>
                          <Twitter className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`mailto:${member.social.email}`}>
                          <Mail className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Story
            </h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold">
                  2010
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    The Beginning
                  </h3>
                  <p className="text-muted-foreground">
                    Max Wire News was founded with a vision to revolutionize
                    digital journalism. Starting as a small team of passionate
                    journalists, we began covering local news with a commitment
                    to accuracy and integrity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold">
                  2015
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Global Expansion
                  </h3>
                  <p className="text-muted-foreground">
                    We expanded our coverage to international news, establishing
                    correspondent networks across major global cities. Our
                    readership grew to over 1 million monthly visitors.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold">
                  2020
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Digital Innovation
                  </h3>
                  <p className="text-muted-foreground">
                    We launched our mobile app and introduced innovative
                    multimedia storytelling formats. Our coverage of global
                    events earned recognition from industry peers and journalism
                    organizations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold">
                  2024
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Leading the Future
                  </h3>
                  <p className="text-muted-foreground">
                    Today, Max Wire News serves over 5 million readers monthly,
                    with a team of 50+ journalists and editors worldwide. We
                    continue to innovate in digital journalism while maintaining
                    our core values of accuracy and integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Have a story tip, feedback, or want to join our team? Wed love to
            hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Join Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
