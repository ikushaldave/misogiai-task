import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CaseStudy, Profile, TimelineEntry } from "@/types/case-study";
import {
  ThemeWrapper,
  ThemeCard,
  ThemeContent,
  ThemeBadge,
} from "@/components/theme-wrapper";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Calendar, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Theme = "default" | "minimal" | "creative" | "modern";

interface CaseStudyPageProps {
  params: Promise<{
    username: string;
    caseStudy: string;
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

async function getCaseStudy(
  profileId: string,
  caseStudyId: string
): Promise<CaseStudy | null> {
  const supabase = createServerComponentClient({ cookies });
  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select(
      `
      *,
      outcomes (*),
      timelines (*)
    `
    )
    .eq("user_id", profileId)
    .eq("id", caseStudyId)
    .order("date", { ascending: false, referencedTable: "timelines" })
    .single();
  return caseStudy;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { username, caseStudy } = await params;
  const profile = await getProfile(username);
  if (!profile) notFound();

  const caseStudyData = await getCaseStudy(profile.id, caseStudy);
  if (!caseStudyData) notFound();

  return (
    <ThemeWrapper theme={profile.theme as Theme}>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link
          href={`/${profile.username}`}
          className={cn(
            "inline-flex items-center mb-8 hover:underline",
            profile.theme === "minimal"
              ? "text-lg"
              : profile.theme === "creative"
              ? "text-xl"
              : profile.theme === "modern"
              ? "text-lg"
              : "text-base"
          )}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portfolio
        </Link>

        {/* Hero Section */}
        <div className="relative aspect-video mb-12 rounded-lg overflow-hidden">
          <Image
            src={caseStudyData?.cover_image}
            alt={caseStudyData?.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-6",
                  profile.theme === "minimal"
                    ? "text-3xl"
                    : profile.theme === "creative"
                    ? "text-4xl"
                    : profile.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Overview
              </h2>
              <ThemeContent
                theme={profile.theme as Theme}
                className="prose max-w-none"
              >
                <p>{caseStudyData?.description}</p>
              </ThemeContent>
            </section>

            {/* Challenge */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-6",
                  profile.theme === "minimal"
                    ? "text-3xl"
                    : profile.theme === "creative"
                    ? "text-4xl"
                    : profile.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Challenge
              </h2>
              <ThemeContent
                theme={profile.theme as Theme}
                className="prose max-w-none"
              >
                <p>{caseStudyData?.challenge}</p>
              </ThemeContent>
            </section>

            {/* Solution */}
            <section>
              <h2
                className={cn(
                  "font-bold mb-6",
                  profile.theme === "minimal"
                    ? "text-3xl"
                    : profile.theme === "creative"
                    ? "text-4xl"
                    : profile.theme === "modern"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                Solution
              </h2>
              <ThemeContent
                theme={profile.theme as Theme}
                className="prose max-w-none"
              >
                <p>{caseStudyData?.solution}</p>
              </ThemeContent>
            </section>

            {/* Timeline */}
            {caseStudyData?.timelines &&
              caseStudyData?.timelines.length > 0 && (
                <section>
                  <h2
                    className={cn(
                      "font-bold mb-6",
                      profile.theme === "minimal"
                        ? "text-3xl"
                        : profile.theme === "creative"
                        ? "text-4xl"
                        : profile.theme === "modern"
                        ? "text-3xl"
                        : "text-2xl"
                    )}
                  >
                    Timeline
                  </h2>
                  <div className="space-y-6">
                    {caseStudyData?.timelines.map((entry: TimelineEntry) => (
                      <ThemeCard
                        key={entry.id}
                        theme={profile.theme as Theme}
                        className="p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">
                              {entry.title}
                            </h3>
                            <ThemeContent theme={profile.theme as Theme}>
                              <p>{entry.description}</p>
                            </ThemeContent>
                            <p className="text-sm text-muted-foreground mt-2">
                              {entry.date}
                            </p>
                          </div>
                        </div>
                      </ThemeCard>
                    ))}
                  </div>
                </section>
              )}

            {/* Key Outcomes */}
            {caseStudyData?.outcomes && caseStudyData?.outcomes.length > 0 && (
              <section>
                <h2
                  className={cn(
                    "font-bold mb-6",
                    profile.theme === "minimal"
                      ? "text-3xl"
                      : profile.theme === "creative"
                      ? "text-4xl"
                      : profile.theme === "modern"
                      ? "text-3xl"
                      : "text-2xl"
                  )}
                >
                  Key Outcomes
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {caseStudyData?.outcomes.map((outcome) => (
                    <ThemeCard
                      key={outcome.id}
                      theme={profile.theme as Theme}
                      className="p-6"
                    >
                      <h3 className="font-semibold mb-2">{outcome.title}</h3>
                      <ThemeContent theme={profile.theme as Theme}>
                        <p>{outcome.description}</p>
                      </ThemeContent>
                      {outcome.metrics && outcome.metrics.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {outcome.metrics.map((metric, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-muted-foreground">
                                {metric}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </ThemeCard>
                  ))}
                </div>
              </section>
            )}

            {/* Media Gallery */}
            {caseStudyData?.images && caseStudyData?.images.length > 0 && (
              <section>
                <h2
                  className={cn(
                    "font-bold mb-6",
                    profile.theme === "minimal"
                      ? "text-3xl"
                      : profile.theme === "creative"
                      ? "text-4xl"
                      : profile.theme === "modern"
                      ? "text-3xl"
                      : "text-2xl"
                  )}
                >
                  Media Gallery
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {caseStudyData?.images.map((image, index) => (
                    <div
                      key={image}
                      className="relative aspect-video rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`Media ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Info */}
            <ThemeCard theme={profile.theme as Theme} className="p-6">
              <h3
                className={cn(
                  "font-semibold mb-4",
                  profile.theme === "minimal"
                    ? "text-xl"
                    : profile.theme === "creative"
                    ? "text-2xl"
                    : profile.theme === "modern"
                    ? "text-xl"
                    : "text-lg"
                )}
              >
                Project Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{caseStudyData?.duration}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{caseStudyData?.team_size}</span>
                </div>
              </div>
            </ThemeCard>

            {/* Tools & Technologies */}
            <ThemeCard theme={profile.theme as Theme} className="p-6">
              <h3
                className={cn(
                  "font-semibold mb-4",
                  profile.theme === "minimal"
                    ? "text-xl"
                    : profile.theme === "creative"
                    ? "text-2xl"
                    : profile.theme === "modern"
                    ? "text-xl"
                    : "text-lg"
                )}
              >
                Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {caseStudyData?.tools.map((tool) => (
                  <ThemeBadge key={tool} theme={profile.theme as Theme}>
                    {tool}
                  </ThemeBadge>
                ))}
              </div>
            </ThemeCard>

            {/* Project Links */}
            <ThemeCard theme={profile.theme as Theme} className="p-6">
              <h3
                className={cn(
                  "font-semibold mb-4",
                  profile.theme === "minimal"
                    ? "text-xl"
                    : profile.theme === "creative"
                    ? "text-2xl"
                    : profile.theme === "modern"
                    ? "text-xl"
                    : "text-lg"
                )}
              >
                Project Links
              </h3>
              <div className="space-y-2">
                {caseStudyData?.live_url && (
                  <a
                    href={caseStudyData?.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "block text-sm hover:underline",
                      profile.theme === "minimal"
                        ? "text-primary"
                        : profile.theme === "creative"
                        ? "text-primary"
                        : profile.theme === "modern"
                        ? "text-primary"
                        : "text-primary"
                    )}
                  >
                    Live Demo
                  </a>
                )}
                {caseStudyData?.github_url && (
                  <a
                    href={caseStudyData?.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "block text-sm hover:underline",
                      profile.theme === "minimal"
                        ? "text-primary"
                        : profile.theme === "creative"
                        ? "text-primary"
                        : profile.theme === "modern"
                        ? "text-primary"
                        : "text-primary"
                    )}
                  >
                    GitHub Repository
                  </a>
                )}
              </div>
            </ThemeCard>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
}
