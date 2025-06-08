"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CaseStudiesGrid } from "@/components/dashboard/case-studies-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { redirect } from "next/navigation";

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
  cover_image: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const { user, loading, authUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalProjects: 0,
    thisMonth: 0,
    engagement: 0,
  });

  useEffect(() => {
    if (!loading && !user && !authUser) {
      redirect("/auth");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchCaseStudies();
      fetchAnalytics();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };

  const fetchCaseStudies = async () => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("user_id", user?.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching case studies:", error);
    } else {
      setCaseStudies(data || []);
    }
  };

  const fetchAnalytics = async () => {
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", user?.id);

    if (error) {
      console.error("Error fetching analytics:", error);
    } else {
      const totalViews =
        data?.filter((item) => item.event_type === "page_view").length || 0;
      const thisMonth =
        data?.filter((item) => {
          const itemDate = new Date(item.created_at);
          const now = new Date();
          return (
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          );
        }).length || 0;

      setStats({
        totalViews,
        totalProjects: caseStudies.length,
        thisMonth,
        engagement:
          totalViews > 0 ? Math.round((thisMonth / totalViews) * 100) : 0,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCards stats={stats} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CaseStudiesGrid
              caseStudies={caseStudies}
              onRefresh={fetchCaseStudies}
            />
          </div>

          <div className="space-y-6">
            <QuickActions profile={profile} />
            <RecentActivity userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
