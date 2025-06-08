"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CaseStudy, Profile, ThemeValue } from "@/types/case-study";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ThemeCard,
  ThemeBadge,
  ThemeContent,
} from "@/components/theme-wrapper";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  theme: ThemeValue;
  className?: string;
  user: Profile;
}

export function CaseStudyCard({
  caseStudy,
  theme,
  className,
  user,
}: CaseStudyCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this case study?")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("case_studies")
        .delete()
        .eq("id", caseStudy.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting case study:", error);
      alert("Failed to delete case study");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Link
      href={`/${user.username}/case-studies/${caseStudy.id}`}
      className={cn(
        "group",
        theme === "creative" ? "hover:scale-105 transition-transform" : ""
      )}
    >
      <ThemeCard
        theme={theme}
        className={cn("h-full overflow-hidden", className)}
      >
        <div className="relative aspect-video">
          <Image
            src={caseStudy.cover_image}
            alt={caseStudy.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3
            className={cn(
              "font-semibold mb-2",
              theme === "creative" ? "text-xl" : ""
            )}
          >
            {caseStudy.title}
          </h3>
          <ThemeContent theme={theme} className="text-sm mb-4 line-clamp-2">
            {caseStudy.description}
          </ThemeContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{caseStudy.duration}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{caseStudy.team_size}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tools.slice(0, 3).map((tool: string) => (
                <ThemeBadge
                  key={tool}
                  theme={theme}
                  className={cn(
                    theme === "creative"
                      ? "hover:scale-110 transition-transform"
                      : ""
                  )}
                >
                  {tool}
                </ThemeBadge>
              ))}
              {caseStudy.tools.length > 3 && (
                <Badge variant="outline" className="text-muted-foreground">
                  +{caseStudy.tools.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </ThemeCard>
    </Link>
  );
}
