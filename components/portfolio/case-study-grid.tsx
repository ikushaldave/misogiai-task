"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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

interface CaseStudyGridProps {
  caseStudies: CaseStudy[];
  profile: Profile;
}

export function CaseStudyGrid({ caseStudies, profile }: CaseStudyGridProps) {
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
    <div className="space-y-12">
      {/* Featured Case Studies */}
      {featuredCaseStudies.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center">
            Featured Projects
          </h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCaseStudies.map((caseStudy) => (
              <Card
                key={caseStudy.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                onClick={() =>
                  handleCaseStudyClick(caseStudy.id, caseStudy.title)
                }
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-lg overflow-hidden">
                  {caseStudy.cover_image ? (
                    <img
                      src={caseStudy.cover_image}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {caseStudy.title}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {caseStudy.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      Featured
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(caseStudy.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Regular Case Studies */}
      {regularCaseStudies.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-6 text-center">
            {featuredCaseStudies.length > 0 ? "More Projects" : "All Projects"}
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularCaseStudies.map((caseStudy) => (
              <Card
                key={caseStudy.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() =>
                  handleCaseStudyClick(caseStudy.id, caseStudy.title)
                }
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                  {caseStudy.cover_image ? (
                    <img
                      src={caseStudy.cover_image}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl">📋</span>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {caseStudy.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {caseStudy.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(caseStudy.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
