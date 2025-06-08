import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ThemeStyles, themeStyles } from "@/types/case-study";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeValue } from "@/types/case-study";

interface ThemeWrapperProps {
  theme: ThemeValue;
  children: ReactNode;
  className?: string;
}

export function ThemeWrapper({
  theme,
  children,
  className,
}: ThemeWrapperProps) {
  return (
    <div
      className={cn(
        "min-h-screen",
        theme === "minimal"
          ? "bg-background"
          : theme === "creative"
          ? "bg-gradient-to-br from-background to-background/80"
          : theme === "modern"
          ? "bg-gradient-to-b from-background to-background/95"
          : "bg-background",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ThemeCardProps {
  theme: ThemeValue;
  children: ReactNode;
  className?: string;
}

export function ThemeCard({ theme, children, className }: ThemeCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        theme === "minimal"
          ? "bg-transparent border-2 hover:border-primary/50"
          : theme === "creative"
          ? "bg-gradient-to-br from-card to-card/80 hover:scale-[1.02]"
          : theme === "modern"
          ? "bg-card/80 backdrop-blur-sm hover:bg-card/90"
          : "hover:shadow-lg",
        className
      )}
    >
      {children}
    </Card>
  );
}

interface ThemeContentProps {
  theme: ThemeValue;
  children: ReactNode;
  className?: string;
}

export function ThemeContent({
  theme,
  children,
  className,
}: ThemeContentProps) {
  return (
    <div
      className={cn(
        theme === "minimal"
          ? "text-foreground/90"
          : theme === "creative"
          ? "text-foreground/95"
          : theme === "modern"
          ? "text-foreground/90"
          : "text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ThemeBadgeProps {
  theme: ThemeValue;
  children: ReactNode;
  className?: string;
}

export function ThemeBadge({ theme, children, className }: ThemeBadgeProps) {
  return (
    <Badge
      className={cn(
        theme === "minimal"
          ? "bg-primary/10 text-primary hover:bg-primary/20"
          : theme === "creative"
          ? "bg-primary/20 text-primary hover:bg-primary/30"
          : theme === "modern"
          ? "bg-primary/15 text-primary hover:bg-primary/25"
          : "bg-primary/10 text-primary hover:bg-primary/20",
        className
      )}
    >
      {children}
    </Badge>
  );
}

export function ThemeSection({
  theme,
  children,
  className,
}: ThemeWrapperProps) {
  const styles = themeStyles[theme as keyof typeof themeStyles];

  return <div className={cn(styles.section, className)}>{children}</div>;
}
