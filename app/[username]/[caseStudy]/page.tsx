import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Users,
  Link as LinkIcon,
  Github,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  images: {
    id: string;
    type: "image" | "video";
    url: string;
    caption?: string;
  }[];
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

async function getCaseStudy(username: string, caseStudyId: string) {
  const { data: caseStudyData, error: caseStudyError } = await supabase
    .from("case_studies")
    .select(
      `
      *,
      user:user_id (
        username,
        full_name,
        avatar_url,
        theme
      )
    `
    )
    .eq("user.username", username)
    .eq("id", caseStudyId)
    .single();

  if (caseStudyError || !caseStudyData) {
    return null;
  }

  // Fetch related data
  const [timelineData, outcomesData] = await Promise.all([
    supabase
      .from("timelines")
      .select("*")
      .eq("case_study_id", caseStudyData.id),
    supabase.from("outcomes").select("*").eq("case_study_id", caseStudyData.id),
  ]);

  if (timelineData.error || outcomesData.error) {
    return null;
  }

  return {
    ...caseStudyData,
    timelines: timelineData.data,
    outcomes: outcomesData.data,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { username: string; caseStudy: string };
}) {
  const caseStudy = await getCaseStudy(params.username, params.caseStudy);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${caseStudy.title} - Case Study`,
    description: caseStudy.description,
    openGraph: {
      title: `${caseStudy.title} - Case Study`,
      description: caseStudy.description,
      images: caseStudy.cover_image ? [caseStudy.cover_image] : [],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { username: string; caseStudy: string };
}) {
  const caseStudyData = await getCaseStudy(params.username, params.caseStudy);

  if (!caseStudyData) {
    notFound();
  }

  const styles =
    themeStyles[caseStudyData.user.theme as keyof typeof themeStyles];

  return (
    <div className={cn("min-h-screen", styles.hero)}>
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={caseStudyData.cover_image}
          alt={caseStudyData.title}
          fill
          className="object-cover"
          priority
        />
        <div
          className={cn(
            "absolute inset-0",
            caseStudyData.user.theme === "minimal"
              ? "bg-black/30"
              : caseStudyData.user.theme === "creative"
              ? "bg-gradient-to-t from-black/70 via-black/50 to-transparent"
              : caseStudyData.user.theme === "modern"
              ? "bg-gradient-to-t from-background via-black/50 to-transparent"
              : "bg-black/50"
          )}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div
              className={cn(
                "max-w-3xl",
                caseStudyData.user.theme === "minimal"
                  ? "text-center"
                  : caseStudyData.user.theme === "creative"
                  ? "max-w-4xl"
                  : caseStudyData.user.theme === "modern"
                  ? "max-w-5xl"
                  : "max-w-3xl"
              )}
            >
              <h1
                className={cn(
                  "font-bold text-white mb-4",
                  caseStudyData.user.theme === "minimal"
                    ? "text-5xl md:text-6xl"
                    : caseStudyData.user.theme === "creative"
                    ? "text-4xl md:text-7xl"
                    : caseStudyData.user.theme === "modern"
                    ? "text-4xl md:text-6xl"
                    : "text-4xl md:text-5xl"
                )}
              >
                {caseStudyData.title}
              </h1>
              <p
                className={cn(
                  "text-white/90 mb-6",
                  caseStudyData.user.theme === "minimal"
                    ? "text-xl"
                    : caseStudyData.user.theme === "creative"
                    ? "text-2xl"
                    : caseStudyData.user.theme === "modern"
                    ? "text-xl md:text-2xl"
                    : "text-xl"
                )}
              >
                {caseStudyData.description}
              </p>
              <div
                className={cn(
                  "flex items-center text-white/80",
                  caseStudyData.user.theme === "minimal"
                    ? "justify-center space-x-8"
                    : caseStudyData.user.theme === "creative"
                    ? "space-x-6"
                    : caseStudyData.user.theme === "modern"
                    ? "space-x-8"
                    : "space-x-4"
                )}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{caseStudyData.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Team of {caseStudyData.team_size}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div
          className={cn(
            "grid gap-8",
            caseStudyData.user.theme === "minimal"
              ? "grid-cols-1 lg:grid-cols-12"
              : caseStudyData.user.theme === "creative"
              ? "grid-cols-1 xl:grid-cols-12"
              : caseStudyData.user.theme === "modern"
              ? "grid-cols-1 lg:grid-cols-12"
              : "grid-cols-1 lg:grid-cols-3"
          )}
        >
          {/* Main Content */}
          <div
            className={cn(
              styles.section,
              caseStudyData.user.theme === "minimal"
                ? "lg:col-span-8 lg:pr-12"
                : caseStudyData.user.theme === "creative"
                ? "xl:col-span-8"
                : caseStudyData.user.theme === "modern"
                ? "lg:col-span-8"
                : "lg:col-span-2"
            )}
          >
            {/* Overview */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-4",
                  caseStudyData.user.theme === "minimal"
                    ? "text-3xl"
                    : caseStudyData.user.theme === "creative"
                    ? "text-4xl"
                    : caseStudyData.user.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Overview
              </h2>
              <p className={styles.content}>{caseStudyData.overview}</p>
            </section>

            {/* Challenge */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-4",
                  caseStudyData.user.theme === "minimal"
                    ? "text-3xl"
                    : caseStudyData.user.theme === "creative"
                    ? "text-4xl"
                    : caseStudyData.user.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Challenge
              </h2>
              <p className={styles.content}>{caseStudyData.challenge}</p>
            </section>

            {/* Solution */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-4",
                  caseStudyData.user.theme === "minimal"
                    ? "text-3xl"
                    : caseStudyData.user.theme === "creative"
                    ? "text-4xl"
                    : caseStudyData.user.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Solution
              </h2>
              <p className={styles.content}>{caseStudyData.solution}</p>
            </section>

            {/* Outcome */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-4",
                  caseStudyData.user.theme === "minimal"
                    ? "text-3xl"
                    : caseStudyData.user.theme === "creative"
                    ? "text-4xl"
                    : caseStudyData.user.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Outcome
              </h2>
              <p className={styles.content}>{caseStudyData.outcome}</p>
            </section>

            {/* Timeline */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-6",
                  caseStudyData.user.theme === "minimal"
                    ? "text-3xl"
                    : caseStudyData.user.theme === "creative"
                    ? "text-4xl"
                    : caseStudyData.user.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Timeline
              </h2>
              <div
                className={cn(
                  "space-y-6",
                  caseStudyData.user.theme === "creative"
                    ? "relative before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-primary/20"
                    : "space-y-6"
                )}
              >
                {caseStudyData.timelines.map((entry: TimelineEntry) => (
                  <Card
                    key={entry.id}
                    className={cn(
                      "p-6",
                      styles.card,
                      caseStudyData.user.theme === "creative" ? "ml-8" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-start space-x-4",
                        caseStudyData.user.theme === "minimal"
                          ? "flex-col space-y-4"
                          : caseStudyData.user.theme === "creative"
                          ? "space-x-6"
                          : caseStudyData.user.theme === "modern"
                          ? "space-x-6"
                          : "space-x-4"
                      )}
                    >
                      <div
                        className={cn(
                          "text-sm text-muted-foreground",
                          caseStudyData.user.theme === "minimal"
                            ? "w-full"
                            : caseStudyData.user.theme === "creative"
                            ? "w-32"
                            : caseStudyData.user.theme === "modern"
                            ? "w-32"
                            : "w-24"
                        )}
                      >
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <div>
                        <h3
                          className={cn(
                            "font-semibold mb-2",
                            caseStudyData.user.theme === "creative"
                              ? "text-xl"
                              : ""
                          )}
                        >
                          {entry.title}
                        </h3>
                        <p className={styles.content}>{entry.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Outcomes */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-6",
                  caseStudyData.user.theme === "minimal"
                    ? "text-3xl"
                    : caseStudyData.user.theme === "creative"
                    ? "text-4xl"
                    : caseStudyData.user.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Key Outcomes
              </h2>
              <div
                className={cn(
                  "grid gap-6",
                  caseStudyData.user.theme === "minimal"
                    ? "grid-cols-1"
                    : caseStudyData.user.theme === "creative"
                    ? "grid-cols-1 md:grid-cols-2"
                    : caseStudyData.user.theme === "modern"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2"
                )}
              >
                {caseStudyData.outcomes.map((outcome: Outcome) => (
                  <Card
                    key={outcome.id}
                    className={cn(
                      "p-6",
                      styles.card,
                      caseStudyData.user.theme === "creative"
                        ? "hover:scale-105 transition-transform"
                        : ""
                    )}
                  >
                    <h3
                      className={cn(
                        "font-semibold mb-2",
                        caseStudyData.user.theme === "creative" ? "text-xl" : ""
                      )}
                    >
                      {outcome.title}
                    </h3>
                    <p className={cn("mb-4", styles.content)}>
                      {outcome.description}
                    </p>
                    <div className="space-y-2">
                      {outcome.metrics.map((metric: string, index: number) => (
                        <Badge key={index} className={cn("mr-2", styles.badge)}>
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Media Gallery */}
            {caseStudyData.images.length > 0 && (
              <section>
                <h2
                  className={cn(
                    "font-bold mb-6",
                    caseStudyData.user.theme === "minimal"
                      ? "text-3xl"
                      : caseStudyData.user.theme === "creative"
                      ? "text-4xl"
                      : caseStudyData.user.theme === "modern"
                      ? "text-3xl"
                      : "text-2xl"
                  )}
                >
                  Media Gallery
                </h2>
                <div
                  className={cn(
                    "grid gap-6",
                    caseStudyData.user.theme === "minimal"
                      ? "grid-cols-1"
                      : caseStudyData.user.theme === "creative"
                      ? "grid-cols-1 md:grid-cols-2"
                      : caseStudyData.user.theme === "modern"
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1 md:grid-cols-2"
                  )}
                >
                  {caseStudyData.images.map(
                    (media: {
                      id: string;
                      type: "image" | "video";
                      url: string;
                      caption?: string;
                    }) => (
                      <Card
                        key={media.id}
                        className={cn(
                          "overflow-hidden",
                          styles.card,
                          caseStudyData.user.theme === "creative"
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
                          <div className="p-4">
                            <p className={cn("text-sm", styles.content)}>
                              {media.caption}
                            </p>
                          </div>
                        )}
                      </Card>
                    )
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div
            className={cn(
              "space-y-8",
              caseStudyData.user.theme === "minimal"
                ? "lg:col-span-4"
                : caseStudyData.user.theme === "creative"
                ? "xl:col-span-4"
                : caseStudyData.user.theme === "modern"
                ? "lg:col-span-4"
                : ""
            )}
          >
            {/* Project Info */}
            <Card className={cn("p-6", styles.card)}>
              <h3
                className={cn(
                  "font-semibold mb-4",
                  caseStudyData.user.theme === "creative" ? "text-xl" : ""
                )}
              >
                Project Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Client</div>
                  <div className={styles.content}>{caseStudyData.client}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Industry</div>
                  <div className={styles.content}>{caseStudyData.industry}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Role</div>
                  <div className={styles.content}>{caseStudyData.role}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className={styles.content}>{caseStudyData.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Team Size</div>
                  <div className={styles.content}>
                    {caseStudyData.team_size} people
                  </div>
                </div>
              </div>
            </Card>

            {/* Tools & Technologies */}
            <Card className={cn("p-6", styles.card)}>
              <h3
                className={cn(
                  "font-semibold mb-4",
                  caseStudyData.user.theme === "creative" ? "text-xl" : ""
                )}
              >
                Tools & Technologies
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Tools
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {caseStudyData.tools.map((tool: string) => (
                      <Badge
                        key={tool}
                        className={cn(
                          styles.badge,
                          caseStudyData.user.theme === "creative"
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
                  <div className="text-sm text-muted-foreground mb-2">
                    Technologies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {caseStudyData.technologies.map((tech: string) => (
                      <Badge
                        key={tech}
                        className={cn(
                          styles.badge,
                          caseStudyData.user.theme === "creative"
                            ? "hover:scale-110 transition-transform"
                            : ""
                        )}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Links */}
            {(caseStudyData.live_url ||
              caseStudyData.github_url ||
              caseStudyData.video_url) && (
              <Card className={cn("p-6", styles.card)}>
                <h3
                  className={cn(
                    "font-semibold mb-4",
                    caseStudyData.user.theme === "creative" ? "text-xl" : ""
                  )}
                >
                  Links
                </h3>
                <div className="space-y-2">
                  {caseStudyData.live_url && (
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start",
                        caseStudyData.user.theme === "creative"
                          ? "hover:scale-105 transition-transform"
                          : ""
                      )}
                      asChild
                    >
                      <a
                        href={caseStudyData.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {caseStudyData.github_url && (
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start",
                        caseStudyData.user.theme === "creative"
                          ? "hover:scale-105 transition-transform"
                          : ""
                      )}
                      asChild
                    >
                      <a
                        href={caseStudyData.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Source Code
                      </a>
                    </Button>
                  )}
                  {caseStudyData.video_url && (
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start",
                        caseStudyData.user.theme === "creative"
                          ? "hover:scale-105 transition-transform"
                          : ""
                      )}
                      asChild
                    >
                      <a
                        href={caseStudyData.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Video Demo
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
