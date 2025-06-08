"use client";

import { useEffect } from "react";
import { Analytics } from "@/lib/analytics";
import { PortfolioHeader } from "./portfolio-header";
import { CaseStudyGrid } from "./case-study-grid";
import { PortfolioFooter } from "./portfolio-footer";

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
  overview: string;
  cover_image: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface PortfolioViewProps {
  profile: Profile;
  caseStudies: CaseStudy[];
}

export function PortfolioView({ profile, caseStudies }: PortfolioViewProps) {
  useEffect(() => {
    // Track page view
    Analytics.trackPageView(profile.id, `/${profile.username}`);
  }, [profile.id, profile.username]);

  const themeClasses = {
    minimal: "bg-white text-gray-900",
    dark: "bg-gray-900 text-white",
    colorful: "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900",
  };

  const currentTheme =
    themeClasses[profile.theme as keyof typeof themeClasses] ||
    themeClasses.minimal;

  return (
    <div className={`min-h-screen ${currentTheme}`}>
      <PortfolioHeader profile={profile} />

      <main className="container mx-auto px-4 py-12">
        {caseStudies.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">📁</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">No Projects Yet</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {profile.full_name} is working on some amazing projects. Check
              back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Featured Work</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore my latest projects and case studies
              </p>
            </div>

            <CaseStudyGrid caseStudies={caseStudies} profile={profile} />
          </div>
        )}
      </main>

      <PortfolioFooter profile={profile} />
    </div>
  );
}
