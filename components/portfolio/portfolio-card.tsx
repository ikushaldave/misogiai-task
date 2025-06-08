import { Profile } from "@/types/case-study";
import { Card } from "@/components/ui/card";
import { MapPin, Globe } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ThemeCard, ThemeContent } from "@/components/theme-wrapper";
import { ThemeValue } from "@/types/case-study";

interface PortfolioCardProps {
  profile: Profile;
  className?: string;
}

export function PortfolioCard({ profile, className }: PortfolioCardProps) {
  return (
    <ThemeCard theme={profile.theme} className={cn("p-6", className)}>
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
          "font-bold text-center mb-4",
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
      <ThemeContent
        theme={profile.theme}
        className={cn(
          "text-xl text-center mb-6",
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
      </ThemeContent>
      <div
        className={cn(
          "flex items-center justify-center space-x-6",
          profile.theme === "minimal"
            ? "text-lg"
            : profile.theme === "creative"
            ? "text-xl"
            : profile.theme === "modern"
            ? "text-lg"
            : "text-base"
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
    </ThemeCard>
  );
}
