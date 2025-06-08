import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ThemedPortfolio } from "@/components/portfolio/themed-portfolio";
import { FloatingMenu } from "@/components/portfolio/floating-menu";

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  tools: string[];
  technologies: string[];
  duration: string;
  role: string;
  team_size: number;
  client: string;
  industry: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

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

async function getProfile(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getCaseStudies(userId: string) {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  if (error) {
    return [];
  }

  return data || [];
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);

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

export default async function PortfolioPage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);

  if (!profile) {
    notFound();
  }

  const caseStudies = await getCaseStudies(profile.id);

  return (
    <>
      <ThemedPortfolio profile={profile} caseStudies={caseStudies} />
      <FloatingMenu profileUsername={profile.username} />
    </>
  );
}