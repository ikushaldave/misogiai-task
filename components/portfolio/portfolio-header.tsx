"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Mail, Download } from "lucide-react";
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

interface PortfolioHeaderProps {
  profile: Profile;
}

export function PortfolioHeader({ profile }: PortfolioHeaderProps) {
  const handleContactClick = () => {
    Analytics.trackClick(profile.id, `/${profile.username}`, "contact_button");
  };

  const handleWebsiteClick = () => {
    Analytics.trackClick(profile.id, `/${profile.username}`, "website_link");
  };

  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-white shadow-lg">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className="text-2xl">
              {profile.full_name?.charAt(0) || profile.username.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {profile.full_name || profile.username}
          </h1>

          <div className="flex items-center justify-center space-x-2 mb-6">
            <Badge variant="secondary" className="text-sm">
              @{profile.username}
            </Badge>
            {profile.location && (
              <Badge variant="outline" className="text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                {profile.location}
              </Badge>
            )}
          </div>

          {profile.bio && (
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleContactClick}>
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

            <Button variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
