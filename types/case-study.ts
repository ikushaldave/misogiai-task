export type ThemeValue = "default" | "minimal" | "creative" | "modern";

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Outcome {
  id: string;
  title: string;
  description: string;
  metrics: string[];
}

export interface CaseStudy {
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
  images: string[];
  video_url: string;
  live_url: string;
  github_url: string;
  timelines: TimelineEntry[];
  outcomes: Outcome[];
  client: string;
  industry: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  website: string;
  location: string;
  theme: ThemeValue;
}

export interface ThemeStyles {
  hero: string;
  content: string;
  card: string;
  badge: string;
  section: string;
}

export const themeStyles: Record<ThemeValue, ThemeStyles> = {
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
