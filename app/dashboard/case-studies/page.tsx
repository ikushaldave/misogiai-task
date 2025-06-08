"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CaseStudyCard } from "@/components/case-studies/case-study-card";
import { CreateCaseStudyDialog } from "@/components/case-studies/create-case-study-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List, Pencil } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
}

interface Outcome {
  id: string;
  title: string;
  description: string;
  metrics: string[];
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
}

export default function CaseStudiesPage() {
  const { user, loading } = useAuth();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      fetchCaseStudies();
    }
  }, [user]);

  const fetchCaseStudies = async () => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("user_id", user?.id)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching case studies:", error);
      toast.error("Failed to fetch case studies");
    } else {
      setCaseStudies(data || []);
    }
  };

  const handleEdit = (caseStudy: CaseStudy) => {
    setSelectedCaseStudy(caseStudy);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedCaseStudy(null);
    fetchCaseStudies();
    toast.success("Case study updated successfully");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading case studies...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Case Studies</h1>
            <p className="text-muted-foreground">
              Manage your portfolio projects and case studies
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Case Study
            </Button>
          </div>
        </div>

        {caseStudies.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No case studies yet</h3>
            <p className="text-muted-foreground mb-4">
              Start showcasing your work by creating your first case study
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Your First Case Study
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {caseStudies.map((caseStudy) => (
              <div key={caseStudy.id} className="relative group">
                <CaseStudyCard
                  caseStudy={caseStudy}
                  viewMode={viewMode}
                  onUpdate={fetchCaseStudies}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleEdit(caseStudy)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <CreateCaseStudyDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={fetchCaseStudies}
        />

        {selectedCaseStudy && (
          <CreateCaseStudyDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={handleEditSuccess}
            caseStudy={{
              ...selectedCaseStudy,
            }}
            mode="edit"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
