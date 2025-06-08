"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, ArrowUp } from "lucide-react";
import { Analytics } from "@/lib/analytics";

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

interface PortfolioFooterProps {
  profile: Profile;
}

export function PortfolioFooter({ profile }: PortfolioFooterProps) {
  const handleScrollToTop = () => {
    Analytics.trackClick(profile.id, `/${profile.username}`, "scroll_to_top");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProjectShelfClick = () => {
    Analytics.trackClick(
      profile.id,
      `/${profile.username}`,
      "projectshelf_link"
    );
  };

  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleScrollToTop}
              className="rounded-full"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </div>

          <Separator className="max-w-xs mx-auto" />

          <div className="space-y-4">
            <p className="text-lg font-medium">
              Thanks for visiting my portfolio!
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Interested in working together? Feel free to reach out and
              let&apos;s create something amazing.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>using</span>
            <a
              href="https://projectshelf.dev"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleProjectShelfClick}
              className="font-medium text-primary hover:underline"
            >
              ProjectShelf
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {profile.full_name || profile.username}
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
