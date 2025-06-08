import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  tools: string[];
  technologies: string[];
  duration: string;
  role: string;
  team_size: number;
  client: string;
  industry: string;
  order_index: number;
}

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  website: string;
  location: string;
  theme: string;
}

const themeStyles = {
  default: {
    hero: "bg-gradient-to-b from-background to-muted",
    content: "text-foreground",
    card: "bg-card hover:bg-accent/50",
    badge: "bg-primary/10 text-primary",
    section: "space-y-8",
  },
  minimal: {
    hero: "bg-background",
    content: "text-foreground",
    card: "bg-transparent border-2 hover:border-primary/50",
    badge: "bg-muted text-foreground",
    section: "space-y-12",
  },
  creative: {
    hero: "bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20",
    content: "text-foreground",
    card: "bg-background/80 backdrop-blur-sm hover:shadow-lg",
    badge: "bg-gradient-to-r from-primary to-secondary text-white",
    section: "space-y-16",
  },
  modern: {
    hero: "bg-gradient-to-br from-background via-muted to-background",
    content: "text-foreground",
    card: "bg-card/50 backdrop-blur-sm hover:bg-accent/30",
    badge: "bg-secondary text-secondary-foreground",
    section: "space-y-10",
  },
};

async function getProfile(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getCaseStudies(userId: string) {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);

  if (!profile) {
    return {
      title: "Portfolio Not Found",
    };
  }

  return {
    title: `${profile.full_name} - Portfolio`,
    description:
      profile.bio ||
      `Check out ${profile.full_name}'s portfolio and case studies`,
    openGraph: {
      title: `${profile.full_name} - Portfolio`,
      description:
        profile.bio ||
        `Check out ${profile.full_name}'s portfolio and case studies`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);

  if (!profile) {
    notFound();
  }

  const caseStudies = await getCaseStudies(profile.id);
  const styles = themeStyles[profile.theme as keyof typeof themeStyles];

  return (
    <div className={cn("min-h-screen", styles.hero)}>
      {/* Hero Section */}
      <div className="relative py-20">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "max-w-4xl mx-auto text-center",
              profile.theme === "minimal"
                ? "space-y-8"
                : profile.theme === "creative"
                ? "space-y-12"
                : profile.theme === "modern"
                ? "space-y-10"
                : "space-y-6"
            )}
          >
            <div
              className={cn(
                "relative w-32 h-32 mx-auto mb-8",
                profile.theme === "creative"
                  ? "rounded-full ring-4 ring-primary/20"
                  : profile.theme === "modern"
                  ? "rounded-2xl"
                  : "rounded-full"
              )}
            >
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                fill
                className={cn(
                  "object-cover",
                  profile.theme === "creative"
                    ? "rounded-full"
                    : profile.theme === "modern"
                    ? "rounded-2xl"
                    : "rounded-full"
                )}
                priority
              />
            </div>
            <h1
              className={cn(
                "font-bold",
                profile.theme === "minimal"
                  ? "text-5xl md:text-6xl"
                  : profile.theme === "creative"
                  ? "text-4xl md:text-7xl"
                  : profile.theme === "modern"
                  ? "text-4xl md:text-6xl"
                  : "text-4xl md:text-5xl"
              )}
            >
              {profile.full_name}
            </h1>
            <p
              className={cn(
                "text-xl",
                styles.content,
                profile.theme === "minimal"
                  ? "max-w-2xl mx-auto"
                  : profile.theme === "creative"
                  ? "text-2xl"
                  : profile.theme === "modern"
                  ? "text-xl md:text-2xl"
                  : "text-xl"
              )}
            >
              {profile.bio}
            </p>
            <div
              className={cn(
                "flex items-center justify-center space-x-6",
                styles.content
              )}
            >
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies Section */}
      <div className="container mx-auto px-4 py-12">
        <div
          className={cn(
            "grid gap-8",
            profile.theme === "minimal"
              ? "grid-cols-1 md:grid-cols-2"
              : profile.theme === "creative"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : profile.theme === "modern"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {caseStudies.map((caseStudy) => (
            <Link
              key={caseStudy.id}
              href={`/${profile.username}/${caseStudy.id}`}
              className={cn(
                "group",
                profile.theme === "creative"
                  ? "hover:scale-105 transition-transform"
                  : ""
              )}
            >
              <Card className={cn("h-full overflow-hidden", styles.card)}>
                <div className="relative aspect-video">
                  <Image
                    src={caseStudy.cover_image}
                    alt={caseStudy.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className={cn(
                      "font-semibold mb-2",
                      profile.theme === "creative" ? "text-xl" : ""
                    )}
                  >
                    {caseStudy.title}
                  </h3>
                  <p
                    className={cn("text-sm mb-4 line-clamp-2", styles.content)}
                  >
                    {caseStudy.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{caseStudy.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{caseStudy.team_size}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tools.slice(0, 3).map((tool: string) => (
                        <Badge
                          key={tool}
                          className={cn(
                            styles.badge,
                            profile.theme === "creative"
                              ? "hover:scale-110 transition-transform"
                              : ""
                          )}
                        >
                          {tool}
                        </Badge>
                      ))}
                      {caseStudy.tools.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          +{caseStudy.tools.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
