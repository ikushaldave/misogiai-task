import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ThemedCaseStudy } from "@/components/portfolio/themed-case-study";
import { FloatingMenu } from "@/components/portfolio/floating-menu";

interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface Outcome {
  id: string;
  title: string;
  description: string;
  metrics: string[];
}

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  overview: string;
  cover_image: string;
  challenge: string;
  solution: string;
  outcome: string;
  tools: string[];
  technologies: string[];
  duration: string;
  role: string;
  team_size: number;
  images: MediaItem[];
  video_url: string;
  live_url: string;
  github_url: string;
  timelines: TimelineEntry[];
  outcomes: Outcome[];
  client: string;
  industry: string;
  user: {
    username: string;
    full_name: string;
    avatar_url: string;
    theme: string;
  };
}

async function getCaseStudy(username: string, caseStudyId: string) {
  const { data: caseStudyData, error: caseStudyError } = await supabase
    .from("case_studies")
    .select(
      `
      *,
      user:user_id (
        username,
        full_name,
        avatar_url,
        theme
      )
    `
    )
    .eq("user.username", username)
    .eq("id", caseStudyId)
    .single();

  if (caseStudyError || !caseStudyData) {
    return null;
  }

  // Fetch related data
  const [timelineData, outcomesData] = await Promise.all([
    supabase
      .from("timelines")
      .select("*")
      .eq("case_study_id", caseStudyData.id)
      .order("order_index", { ascending: true }),
    supabase
      .from("outcomes")
      .select("*")
      .eq("case_study_id", caseStudyData.id),
  ]);

  if (timelineData.error || outcomesData.error) {
    return null;
  }

  return {
    ...caseStudyData,
    timelines: timelineData.data || [],
    outcomes: outcomesData.data || [],
    images: caseStudyData.images || [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: { username: string; caseStudy: string };
}) {
  const caseStudy = await getCaseStudy(params.username, params.caseStudy);

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${caseStudy.title} - Case Study`,
    description: caseStudy.description,
    openGraph: {
      title: `${caseStudy.title} - Case Study`,
      description: caseStudy.description,
      images: caseStudy.cover_image ? [caseStudy.cover_image] : [],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { username: string; caseStudy: string };
}) {
  const caseStudyData = await getCaseStudy(params.username, params.caseStudy);

  if (!caseStudyData) {
    notFound();
  }

  return (
    <>
      <ThemedCaseStudy caseStudy={caseStudyData} />
      <FloatingMenu 
        profileUsername={caseStudyData.user.username} 
        caseStudyId={caseStudyData.id}
      />
    </>
  );
}