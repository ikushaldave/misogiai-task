export interface ThemeConfig {
  name: string;
  description: string;
  styles: {
    hero: string;
    content: string;
    card: string;
    badge: string;
    section: string;
    button: string;
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    spacing: {
      section: string;
      card: string;
    };
    layout: {
      container: string;
      grid: string;
    };
  };
}

export const themes: Record<string, ThemeConfig> = {
  default: {
    name: "Default",
    description: "Clean and professional design with a focus on content",
    styles: {
      hero: "bg-gradient-to-b from-background to-muted/50",
      content: "text-foreground",
      card: "bg-card hover:bg-accent/50 border border-border shadow-sm",
      badge: "bg-primary/10 text-primary border border-primary/20",
      section: "space-y-8",
      button: "bg-primary text-primary-foreground hover:bg-primary/90",
      text: {
        primary: "text-foreground",
        secondary: "text-muted-foreground",
        accent: "text-primary",
      },
      spacing: {
        section: "py-12 md:py-16",
        card: "p-6",
      },
      layout: {
        container: "container mx-auto px-4",
        grid: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
      },
    },
  },
  minimal: {
    name: "Minimal",
    description: "Simple and elegant design with minimal distractions",
    styles: {
      hero: "bg-background",
      content: "text-foreground",
      card: "bg-transparent border-2 border-border hover:border-primary/50",
      badge: "bg-muted text-foreground border border-muted-foreground/20",
      section: "space-y-12",
      button: "bg-foreground text-background hover:bg-foreground/90",
      text: {
        primary: "text-foreground",
        secondary: "text-muted-foreground",
        accent: "text-foreground",
      },
      spacing: {
        section: "py-16 md:py-20",
        card: "p-8",
      },
      layout: {
        container: "max-w-4xl mx-auto px-6",
        grid: "grid gap-8 md:grid-cols-1 lg:grid-cols-2",
      },
    },
  },
  creative: {
    name: "Creative",
    description: "Bold and artistic design for creative professionals",
    styles: {
      hero: "bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20",
      content: "text-foreground",
      card: "bg-background/80 backdrop-blur-sm hover:shadow-xl border border-primary/20",
      badge: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg",
      section: "space-y-16",
      button: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg",
      text: {
        primary: "text-foreground",
        secondary: "text-muted-foreground",
        accent: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
      },
      spacing: {
        section: "py-16 md:py-24",
        card: "p-8",
      },
      layout: {
        container: "container mx-auto px-4",
        grid: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
      },
    },
  },
  modern: {
    name: "Modern",
    description: "Contemporary design with dynamic layouts",
    styles: {
      hero: "bg-gradient-to-br from-background via-muted/30 to-background",
      content: "text-foreground",
      card: "bg-card/50 backdrop-blur-sm hover:bg-accent/30 border border-border/50",
      badge: "bg-secondary text-secondary-foreground border border-secondary/30",
      section: "space-y-10",
      button: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      text: {
        primary: "text-foreground",
        secondary: "text-muted-foreground",
        accent: "text-secondary-foreground",
      },
      spacing: {
        section: "py-12 md:py-20",
        card: "p-6",
      },
      layout: {
        container: "container mx-auto px-4",
        grid: "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      },
    },
  },
};

export function getTheme(themeName: string): ThemeConfig {
  return themes[themeName] || themes.default;
}

export function getThemeClasses(themeName: string, element: keyof ThemeConfig['styles']) {
  const theme = getTheme(themeName);
  return theme.styles[element];
}