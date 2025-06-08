"use client";

import { useEffect } from "react";
import { Analytics } from "@/lib/analytics";
import { getTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Globe, Mail, Calendar, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

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
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface ThemedPortfolioProps {
  profile: Profile;
  caseStudies: CaseStudy[];
}

export function ThemedPortfolio({ profile, caseStudies }: ThemedPortfolioProps) {
  const theme = getTheme(profile.theme);

  useEffect(() => {
    Analytics.trackPageView(profile.id, `/${profile.username}`);
  }, [profile.id, profile.username]);

  const handleContactClick = () => {
    Analytics.trackClick(profile.id, `/${profile.username}`, "contact_button");
  };

  const handleWebsiteClick = () => {
    Analytics.trackClick(profile.id, `/${profile.username}`, "website_link");
  };

  const handleCaseStudyClick = (caseStudyId: string, title: string) => {
    Analytics.trackClick(
      profile.id,
      `/${profile.username}`,
      "case_study_view",
      {
        case_study_id: caseStudyId,
        case_study_title: title,
      }
    );
  };

  const featuredCaseStudies = caseStudies.filter((cs) => cs.featured);
  const regularCaseStudies = caseStudies.filter((cs) => !cs.featured);

  return (
    <div className={cn("min-h-screen", theme.styles.hero)}>
      {/* Hero Section */}
      <section className={cn(theme.styles.spacing.section, "relative overflow-hidden")}>
        <div className={theme.styles.layout.container}>
          <div className={cn(
            "text-center space-y-6",
            profile.theme === "minimal" ? "max-w-3xl mx-auto" : 
            profile.theme === "creative" ? "max-w-5xl mx-auto" : 
            "max-w-4xl mx-auto"
          )}>
            {/* Avatar */}
            <div className="flex justify-center">
              <Avatar className={cn(
                "ring-4 ring-background shadow-xl",
                profile.theme === "minimal" ? "h-24 w-24" :
                profile.theme === "creative" ? "h-32 w-32 ring-primary/20" :
                profile.theme === "modern" ? "h-28 w-28 ring-border" :
                "h-28 w-28"
              )}>
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.charAt(0) || profile.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name and Title */}
            <div className="space-y-4">
              <h1 className={cn(
                "font-bold",
                profile.theme === "minimal" ? "text-4xl md:text-5xl" :
                profile.theme === "creative" ? "text-5xl md:text-7xl" :
                profile.theme === "modern" ? "text-4xl md:text-6xl" :
                "text-4xl md:text-5xl",
                theme.styles.text.primary
              )}>
                {profile.full_name || profile.username}
              </h1>

              <div className="flex items-center justify-center flex-wrap gap-3">
                <Badge className={theme.styles.badge}>
                  @{profile.username}
                </Badge>
                {profile.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </Badge>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className={cn(
                "text-lg leading-relaxed",
                profile.theme === "creative" ? "text-xl md:text-2xl" : "text-lg md:text-xl",
                theme.styles.text.secondary
              )}>
                {profile.bio}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleContactClick}
                className={theme.styles.button}
              >
                <Mail className="h-4 w-4 mr-2" />
                Get In Touch
              </Button>

              {profile.website && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWebsiteClick}
                  asChild
                >
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className={cn(theme.styles.spacing.section, "bg-background/50")}>
        <div className={theme.styles.layout.container}>
          {caseStudies.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📁</span>
              </div>
              <h2 className={cn("text-2xl font-bold mb-4", theme.styles.text.primary)}>
                No Projects Yet
              </h2>
              <p className={cn("max-w-md mx-auto", theme.styles.text.secondary)}>
                {profile.full_name} is working on some amazing projects. Check back soon!
              </p>
            </div>
          ) : (
            <div className={theme.styles.section}>
              {/* Featured Projects */}
              {featuredCaseStudies.length > 0 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className={cn(
                      "font-bold mb-4",
                      profile.theme === "creative" ? "text-4xl" : "text-3xl",
                      theme.styles.text.accent
                    )}>
                      Featured Projects
                    </h2>
                  </div>
                  
                  <div className={theme.styles.layout.grid}>
                    {featuredCaseStudies.map((caseStudy) => (
                      <CaseStudyCard
                        key={caseStudy.id}
                        caseStudy={caseStudy}
                        profile={profile}
                        theme={theme}
                        onCaseStudyClick={handleCaseStudyClick}
                        featured
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Projects */}
              {regularCaseStudies.length > 0 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className={cn(
                      "font-bold mb-4",
                      profile.theme === "creative" ? "text-4xl" : "text-3xl",
                      theme.styles.text.primary
                    )}>
                      {featuredCaseStudies.length > 0 ? "More Projects" : "All Projects"}
                    </h2>
                  </div>
                  
                  <div className={theme.styles.layout.grid}>
                    {regularCaseStudies.map((caseStudy) => (
                      <CaseStudyCard
                        key={caseStudy.id}
                        caseStudy={caseStudy}
                        profile={profile}
                        theme={theme}
                        onCaseStudyClick={handleCaseStudyClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  profile: Profile;
  theme: any;
  onCaseStudyClick: (id: string, title: string) => void;
  featured?: boolean;
}

function CaseStudyCard({ caseStudy, profile, theme, onCaseStudyClick, featured }: CaseStudyCardProps) {
  return (
    <Link
      href={`/${profile.username}/${caseStudy.id}`}
      className={cn(
        "group block",
        profile.theme === "creative" ? "hover:scale-105 transition-all duration-300" : 
        "hover:scale-[1.02] transition-transform duration-200"
      )}
      onClick={() => onCaseStudyClick(caseStudy.id, caseStudy.title)}
    >
      <Card className={cn(
        "h-full overflow-hidden",
        theme.styles.card,
        featured && "ring-2 ring-primary/20"
      )}>
        {/* Cover Image */}
        <div className={cn(
          "relative overflow-hidden",
          profile.theme === "minimal" ? "aspect-[4/3]" : "aspect-video"
        )}>
          {caseStudy.cover_image ? (
            <Image
              src={caseStudy.cover_image}
              alt={caseStudy.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-4xl opacity-50">🎨</span>
            </div>
          )}
          {featured && (
            <div className="absolute top-4 right-4">
              <Badge className={theme.styles.badge}>Featured</Badge>
            </div>
          )}
        </div>

        <CardHeader className={theme.styles.spacing.card}>
          <CardTitle className={cn(
            "group-hover:text-primary transition-colors",
            profile.theme === "creative" ? "text-xl" : "text-lg"
          )}>
            {caseStudy.title}
          </CardTitle>
          <p className={cn(
            "text-sm line-clamp-2",
            theme.styles.text.secondary
          )}>
            {caseStudy.description}
          </p>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Project Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{caseStudy.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{caseStudy.team_size}</span>
            </div>
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-2">
            {caseStudy.tools.slice(0, 3).map((tool) => (
              <Badge key={tool} variant="outline" className="text-xs">
                {tool}
              </Badge>
            ))}
            {caseStudy.tools.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{caseStudy.tools.length - 3}
              </Badge>
            )}
          </div>

          {/* View Project Link */}
          <div className="flex items-center justify-between pt-2">
            <span className={cn("text-sm", theme.styles.text.secondary)}>
              {formatDistanceToNow(new Date(caseStudy.updated_at), { addSuffix: true })}
            </span>
            <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">View Project</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}