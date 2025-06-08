import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Profile, CaseStudy, ThemeValue } from "@/types/case-study";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { CaseStudyCard } from "@/components/case-studies/case-study-card";

interface PortfolioPageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getProfile(username: string): Promise<Profile | null> {
  const supabase = createServerComponentClient({ cookies });
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  return profile;
}

async function getCaseStudies(profileId: string): Promise<CaseStudy[]> {
  const supabase = createServerComponentClient({ cookies });
  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });
  return caseStudies || [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    return {
      title: "Portfolio Not Found",
    };
  }

  return {
    title: `${profile.full_name} - Portfolio`,
    description:
      profile.bio ||
      `Check out ${profile.full_name}'s portfolio and case studies`,
    openGraph: {
      title: `${profile.full_name} - Portfolio`,
      description:
        profile.bio ||
        `Check out ${profile.full_name}'s portfolio and case studies`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) notFound();

  const caseStudies = await getCaseStudies(profile.id);

  return (
    <ThemeWrapper theme={profile.theme}>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <PortfolioCard profile={profile} />
        </div>
        <div
          className={cn(
            "grid gap-6",
            profile.theme === "minimal"
              ? "md:grid-cols-2"
              : profile.theme === "creative"
              ? "md:grid-cols-3 gap-8"
              : profile.theme === "modern"
              ? "md:grid-cols-3 gap-8"
              : "md:grid-cols-3"
          )}
        >
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard
              user={profile}
              key={caseStudy.id}
              caseStudy={caseStudy}
              theme={profile.theme}
            />
          ))}
        </div>
      </div>
    </ThemeWrapper>
  );
}
