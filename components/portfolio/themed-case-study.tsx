"use client";

import { useEffect } from "react";
import { Analytics } from "@/lib/analytics";
import { getTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Users,
  Link as LinkIcon,
  Github,
  ExternalLink,
  Clock,
  User,
  Building,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface Outcome {
  id: string;
  title: string;
  description: string;
  metrics: string[];
}

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  overview: string;
  cover_image: string;
  challenge: string;
  solution: string;
  outcome: string;
  tools: string[];
  technologies: string[];
  duration: string;
  role: string;
  team_size: number;
  images: MediaItem[];
  video_url: string;
  live_url: string;
  github_url: string;
  timelines: TimelineEntry[];
  outcomes: Outcome[];
  client: string;
  industry: string;
  user: {
    username: string;
    full_name: string;
    avatar_url: string;
    theme: string;
  };
}

interface ThemedCaseStudyProps {
  caseStudy: CaseStudy;
}

export function ThemedCaseStudy({ caseStudy }: ThemedCaseStudyProps) {
  const theme = getTheme(caseStudy.user.theme);

  useEffect(() => {
    Analytics.trackPageView(
      caseStudy.user.username,
      `/${caseStudy.user.username}/${caseStudy.id}`
    );
  }, [caseStudy.user.username, caseStudy.id]);

  return (
    <div className={cn("min-h-screen", theme.styles.hero)}>
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src={caseStudy.cover_image}
          alt={caseStudy.title}
          fill
          className="object-cover"
          priority
        />
        <div className={cn(
          "absolute inset-0",
          caseStudy.user.theme === "minimal"
            ? "bg-black/40"
            : caseStudy.user.theme === "creative"
            ? "bg-gradient-to-t from-black/80 via-black/50 to-transparent"
            : caseStudy.user.theme === "modern"
            ? "bg-gradient-to-t from-background/90 via-black/50 to-transparent"
            : "bg-black/50"
        )} />
        
        <div className="absolute inset-0 flex items-center">
          <div className={theme.styles.layout.container}>
            <div className={cn(
              "max-w-4xl",
              caseStudy.user.theme === "minimal" ? "text-center mx-auto" : ""
            )}>
              {/* Back Button */}
              <Link
                href={`/${caseStudy.user.username}`}
                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolio
              </Link>

              <h1 className={cn(
                "font-bold text-white mb-4",
                caseStudy.user.theme === "minimal"
                  ? "text-4xl md:text-5xl"
                  : caseStudy.user.theme === "creative"
                  ? "text-5xl md:text-7xl"
                  : caseStudy.user.theme === "modern"
                  ? "text-4xl md:text-6xl"
                  : "text-4xl md:text-5xl"
              )}>
                {caseStudy.title}
              </h1>
              
              <p className={cn(
                "text-white/90 mb-6",
                caseStudy.user.theme === "creative" ? "text-xl md:text-2xl" : "text-lg md:text-xl"
              )}>
                {caseStudy.description}
              </p>
              
              <div className={cn(
                "flex items-center text-white/80 gap-6",
                caseStudy.user.theme === "minimal" ? "justify-center" : ""
              )}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{caseStudy.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Team of {caseStudy.team_size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{caseStudy.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={theme.styles.spacing.section}>
        <div className={theme.styles.layout.container}>
          <div className={cn(
            "grid gap-8",
            caseStudy.user.theme === "minimal"
              ? "grid-cols-1 lg:grid-cols-12"
              : "grid-cols-1 lg:grid-cols-3"
          )}>
            
            {/* Main Content */}
            <div className={cn(
              theme.styles.section,
              caseStudy.user.theme === "minimal" ? "lg:col-span-8" : "lg:col-span-2"
            )}>
              
              {/* Overview */}
              <ContentSection
                title="Overview"
                content={caseStudy.overview}
                theme={theme}
                userTheme={caseStudy.user.theme}
              />

              {/* Challenge */}
              <ContentSection
                title="Challenge"
                content={caseStudy.challenge}
                theme={theme}
                userTheme={caseStudy.user.theme}
              />

              {/* Solution */}
              <ContentSection
                title="Solution"
                content={caseStudy.solution}
                theme={theme}
                userTheme={caseStudy.user.theme}
              />

              {/* Outcome */}
              <ContentSection
                title="Outcome"
                content={caseStudy.outcome}
                theme={theme}
                userTheme={caseStudy.user.theme}
              />

              {/* Timeline */}
              {caseStudy.timelines.length > 0 && (
                <div>
                  <h2 className={cn(
                    "font-bold mb-6",
                    caseStudy.user.theme === "creative" ? "text-4xl" : "text-3xl",
                    theme.styles.text.primary
                  )}>
                    Timeline
                  </h2>
                  <div className={cn(
                    "space-y-6",
                    caseStudy.user.theme === "creative"
                      ? "relative before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-primary/20"
                      : ""
                  )}>
                    {caseStudy.timelines.map((entry) => (
                      <Card
                        key={entry.id}
                        className={cn(
                          theme.styles.card,
                          caseStudy.user.theme === "creative" ? "ml-8" : ""
                        )}
                      >
                        <CardContent className={theme.styles.spacing.card}>
                          <div className={cn(
                            "flex items-start gap-4",
                            caseStudy.user.theme === "minimal" ? "flex-col space-y-2" : ""
                          )}>
                            <div className={cn(
                              "text-sm font-medium",
                              theme.styles.text.secondary,
                              caseStudy.user.theme === "minimal" ? "w-full" : "w-24 flex-shrink-0"
                            )}>
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                            <div className="flex-1">
                              <h3 className={cn(
                                "font-semibold mb-2",
                                caseStudy.user.theme === "creative" ? "text-xl" : "text-lg"
                              )}>
                                {entry.title}
                              </h3>
                              <p className={theme.styles.text.secondary}>
                                {entry.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Outcomes */}
              {caseStudy.outcomes.length > 0 && (
                <div>
                  <h2 className={cn(
                    "font-bold mb-6",
                    caseStudy.user.theme === "creative" ? "text-4xl" : "text-3xl",
                    theme.styles.text.primary
                  )}>
                    Key Outcomes
                  </h2>
                  <div className={cn(
                    "grid gap-6",
                    caseStudy.user.theme === "minimal"
                      ? "grid-cols-1"
                      : "grid-cols-1 md:grid-cols-2"
                  )}>
                    {caseStudy.outcomes.map((outcome) => (
                      <Card
                        key={outcome.id}
                        className={cn(
                          theme.styles.card,
                          caseStudy.user.theme === "creative"
                            ? "hover:scale-105 transition-transform"
                            : ""
                        )}
                      >
                        <CardContent className={theme.styles.spacing.card}>
                          <h3 className={cn(
                            "font-semibold mb-2",
                            caseStudy.user.theme === "creative" ? "text-xl" : "text-lg"
                          )}>
                            {outcome.title}
                          </h3>
                          <p className={cn("mb-4", theme.styles.text.secondary)}>
                            {outcome.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {outcome.metrics.map((metric, index) => (
                              <Badge key={index} className={theme.styles.badge}>
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Gallery */}
              {caseStudy.images.length > 0 && (
                <div>
                  <h2 className={cn(
                    "font-bold mb-6",
                    caseStudy.user.theme === "creative" ? "text-4xl" : "text-3xl",
                    theme.styles.text.primary
                  )}>
                    Media Gallery
                  </h2>
                  <div className={cn(
                    "grid gap-6",
                    caseStudy.user.theme === "minimal"
                      ? "grid-cols-1"
                      : "grid-cols-1 md:grid-cols-2"
                  )}>
                    {caseStudy.images.map((media) => (
                      <Card
                        key={media.id}
                        className={cn(
                          "overflow-hidden",
                          theme.styles.card,
                          caseStudy.user.theme === "creative"
                            ? "hover:scale-105 transition-transform"
                            : ""
                        )}
                      >
                        {media.type === "image" ? (
                          <div className="relative aspect-video">
                            <Image
                              src={media.url}
                              alt={media.caption || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <video
                            src={media.url}
                            controls
                            className="w-full aspect-video"
                          />
                        )}
                        {media.caption && (
                          <CardContent className="p-4">
                            <p className={cn("text-sm", theme.styles.text.secondary)}>
                              {media.caption}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className={cn(
              "space-y-6",
              caseStudy.user.theme === "minimal" ? "lg:col-span-4" : ""
            )}>
              
              {/* Project Info */}
              <Card className={theme.styles.card}>
                <CardHeader>
                  <CardTitle className={cn(
                    caseStudy.user.theme === "creative" ? "text-xl" : "text-lg"
                  )}>
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem label="Client" value={caseStudy.client} theme={theme} />
                  <InfoItem label="Industry" value={caseStudy.industry} theme={theme} />
                  <InfoItem label="Role" value={caseStudy.role} theme={theme} />
                  <InfoItem label="Duration" value={caseStudy.duration} theme={theme} />
                  <InfoItem label="Team Size" value={`${caseStudy.team_size} people`} theme={theme} />
                </CardContent>
              </Card>

              {/* Tools & Technologies */}
              <Card className={theme.styles.card}>
                <CardHeader>
                  <CardTitle className={cn(
                    caseStudy.user.theme === "creative" ? "text-xl" : "text-lg"
                  )}>
                    Tools & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Tools</div>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tools.map((tool) => (
                        <Badge
                          key={tool}
                          className={cn(
                            theme.styles.badge,
                            caseStudy.user.theme === "creative"
                              ? "hover:scale-110 transition-transform"
                              : ""
                          )}
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Technologies</div>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className={cn(
                            caseStudy.user.theme === "creative"
                              ? "hover:scale-110 transition-transform"
                              : ""
                          )}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Links */}
              {(caseStudy.live_url || caseStudy.github_url || caseStudy.video_url) && (
                <Card className={theme.styles.card}>
                  <CardHeader>
                    <CardTitle className={cn(
                      caseStudy.user.theme === "creative" ? "text-xl" : "text-lg"
                    )}>
                      Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {caseStudy.live_url && (
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start",
                          caseStudy.user.theme === "creative"
                            ? "hover:scale-105 transition-transform"
                            : ""
                        )}
                        asChild
                      >
                        <a
                          href={caseStudy.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {caseStudy.github_url && (
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start",
                          caseStudy.user.theme === "creative"
                            ? "hover:scale-105 transition-transform"
                            : ""
                        )}
                        asChild
                      >
                        <a
                          href={caseStudy.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="mr-2 h-4 w-4" />
                          Source Code
                        </a>
                      </Button>
                    )}
                    {caseStudy.video_url && (
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start",
                          caseStudy.user.theme === "creative"
                            ? "hover:scale-105 transition-transform"
                            : ""
                        )}
                        asChild
                      >
                        <a
                          href={caseStudy.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Video Demo
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ContentSectionProps {
  title: string;
  content: string;
  theme: any;
  userTheme: string;
}

function ContentSection({ title, content, theme, userTheme }: ContentSectionProps) {
  return (
    <div>
      <h2 className={cn(
        "font-bold mb-4",
        userTheme === "creative" ? "text-4xl" : "text-3xl",
        theme.styles.text.primary
      )}>
        {title}
      </h2>
      <p className={cn(
        "leading-relaxed",
        userTheme === "creative" ? "text-lg" : "text-base",
        theme.styles.text.secondary
      )}>
        {content}
      </p>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  theme: any;
}

function InfoItem({ label, value, theme }: InfoItemProps) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={theme.styles.text.primary}>{value}</div>
    </div>
  );
}