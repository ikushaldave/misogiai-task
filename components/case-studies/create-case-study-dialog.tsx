"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Trash2, Pencil, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormik } from "formik";

interface TimelineEntry {
  id?: string;
  title: string;
  description: string;
  date: string;
}

interface Outcome {
  id?: string;
  title: string;
  description: string;
  metrics: string[];
}

interface CaseStudy {
  id?: string;
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
  images: string[];
  video_url: string;
  live_url: string;
  github_url: string;
  timelines: TimelineEntry[];
  outcomes: Outcome[];
  client: string;
  industry: string;
}

interface CreateCaseStudyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  caseStudy?: CaseStudy;
  mode?: "create" | "edit";
}

const caseStudySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  overview: z.string().min(1, "Overview is required"),
  cover_image: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  challenge: z.string().min(1, "Challenge is required"),
  solution: z.string().min(1, "Solution is required"),
  outcome: z.string().min(1, "Outcome is required"),
  tools: z.array(z.string()).min(1, "At least one tool is required"),
  technologies: z
    .array(z.string())
    .min(1, "At least one technology is required"),
  duration: z.string().min(1, "Duration is required"),
  role: z.string().min(1, "Role is required"),
  team_size: z.number().min(1, "Team size must be at least 1"),
  images: z.array(z.string()).optional().or(z.literal("")),
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  live_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  timelines: z
    .array(
      z.object({
        id: z.string().optional().or(z.literal("")),
        title: z.string().optional().or(z.literal("")),
        description: z.string().optional().or(z.literal("")),
        date: z.string().optional().or(z.literal("")),
      })
    )
    .optional()
    .or(z.literal("")),
  outcomes: z
    .array(
      z.object({
        id: z.string().optional().or(z.literal("")),
        title: z.string().optional().or(z.literal("")),
        description: z.string().optional().or(z.literal("")),
        metrics: z.array(z.string()).optional().or(z.literal("")),
      })
    )
    .optional()
    .or(z.literal("")),
  newTimelineEntry: z.object({
    title: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    date: z.string().optional().or(z.literal("")),
  }),
  newOutcome: z.object({
    title: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    metrics: z.array(z.string()).optional().or(z.literal("")),
  }),
});

const commonTools = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Django",
  "Flask",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "CI/CD",
  "Jest",
  "Cypress",
  "Tailwind CSS",
  "Material UI",
  "Chakra UI",
  "Redux",
  "GraphQL",
  "REST API",
  "WebSocket",
  "Firebase",
  "Supabase",
  "Vercel",
  "Netlify",
  "Heroku",
];

export function CreateCaseStudyDialog({
  open,
  onOpenChange,
  onSuccess,
  caseStudy,
  mode = "create",
}: CreateCaseStudyDialogProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedTool, setSelectedTool] = useState("");

  const formik = useFormik({
    initialValues: {
      title: caseStudy?.title || "",
      description: caseStudy?.description || "",
      overview: caseStudy?.overview || "",
      cover_image: caseStudy?.cover_image || "",
      challenge: caseStudy?.challenge || "",
      solution: caseStudy?.solution || "",
      outcome: caseStudy?.outcome || "",
      tools: caseStudy?.tools || [],
      technologies: caseStudy?.technologies || [],
      duration: caseStudy?.duration || "",
      role: caseStudy?.role || "",
      team_size: caseStudy?.team_size || "",
      images: caseStudy?.images || [],
      video_url: caseStudy?.video_url || "",
      live_url: caseStudy?.live_url || "",
      github_url: caseStudy?.github_url || "",
      timelines: caseStudy?.timelines || [],
      outcomes: caseStudy?.outcomes || [],
      client: caseStudy?.client || "",
      industry: caseStudy?.industry || "",
      newTimelineEntry: {
        title: "",
        description: "",
        date: "",
      },
      newOutcome: {
        title: "",
        description: "",
        metrics: [],
      },
      removedTimelines: [],
      removedOutcomes: [],
    },
    validationSchema: toFormikValidationSchema(caseStudySchema),
    onSubmit: async (values, { setSubmitting }) => {
      if (!user) return;

      setSubmitting(true);
      try {
        let coverImageUrl = values.cover_image;
        if (coverImage && coverImage.startsWith("data:")) {
          const coverImageFile = await fetch(coverImage).then((r) => r.blob());
          const coverImagePath = `case-studies/${
            user.id
          }/cover-${Date.now()}.jpg`;

          const { error: coverError } = await supabase.storage
            .from("media")
            .upload(coverImagePath, coverImageFile)
            .catch((error) => {
              console.error("Error uploading cover image:", error);
              throw error;
            });

          if (coverError) throw coverError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("media").getPublicUrl(coverImagePath);

          coverImageUrl = publicUrl;
        }

        const uploadedUrls = await Promise.all(
          uploadedFiles.map(async (file) => {
            const filePath = `case-studies/${user.id}/${Date.now()}-${
              file.name
            }`;

            const { error: uploadError } = await supabase.storage
              .from("media")
              .upload(filePath, file)
              .catch((error) => {
                console.error("Error uploading file:", error);
                throw error;
              });

            if (uploadError) throw uploadError;

            const {
              data: { publicUrl },
            } = supabase.storage.from("media").getPublicUrl(filePath);

            return publicUrl;
          })
        );

        if (uploadedUrls.length > 0) {
          values.images = [...values.images, ...uploadedUrls];
        }

        const {
          outcomes,
          timelines,
          newOutcome,
          newTimelineEntry,
          removedTimelines,
          removedOutcomes,
          ...caseStudyData
        } = {
          ...values,
          cover_image: coverImageUrl,
          images: values.images.length > 0 ? values.images : undefined,
        };

        if (mode === "edit" && caseStudy) {
          const { error } = await supabase
            .from("case_studies")
            .upsert({
              id: caseStudy.id,
              ...caseStudyData,
            })
            .eq("id", caseStudy.id);

          if (error) throw error;

          if (outcomes.length > 0) {
            const { error: outError } = await supabase
              .from("outcomes")
              .upsert(
                outcomes.map((outcome) => {
                  return {
                    ...outcome,
                    case_study_id: caseStudy.id,
                    user_id: user.id,
                  };
                })
              )
              .eq("case_study_id", caseStudy.id)
              .eq("user_id", user.id);

            if (outError) throw outError;
          }

          if (timelines.length > 0) {
            const { error: timelineError } = await supabase
              .from("timelines")
              .upsert(
                timelines.map((timeline) => {
                  return {
                    ...timeline,
                    case_study_id: caseStudy.id,
                    user_id: user.id,
                  };
                })
              )
              .eq("case_study_id", caseStudy.id)
              .eq("user_id", user.id);

            if (timelineError) throw timelineError;
          }

          if (removedTimelines.length > 0) {
            for (const timelineId of removedTimelines) {
              const { error: removedTimelineError } = await supabase
                .from("timelines")
                .delete()
                .eq("id", timelineId)
                .eq("user_id", user.id);

              if (removedTimelineError) throw removedTimelineError;
            }
          }

          if (removedOutcomes.length > 0) {
            for (const outcomeId of removedOutcomes) {
              const { error: removedOutcomeError } = await supabase
                .from("outcomes")
                .delete()
                .eq("id", outcomeId)
                .eq("user_id", user.id);

              if (removedOutcomeError) throw removedOutcomeError;
            }
          }
        } else {
          const { data: newCaseStudy, error: caseStudyError } = await supabase
            .from("case_studies")
            .insert([
              {
                ...caseStudyData,
                user_id: user.id,
                featured: false,
                order_index: 0,
              },
            ])
            .select()
            .single();

          if (caseStudyError) throw caseStudyError;

          if (outcomes.length > 0) {
            const { error: outError } = await supabase.from("outcomes").insert(
              outcomes.map((outcome) => ({
                ...outcome,
                user_id: user.id,
                case_study_id: newCaseStudy.id,
              }))
            );

            if (outError) {
              toast.error("Failed to create outcomes");
              return;
            }
          }

          if (timelines.length > 0) {
            const { error: timelineError } = await supabase
              .from("timelines")
              .insert(
                timelines.map((timeline) => ({
                  ...timeline,
                  user_id: user.id,
                  case_study_id: newCaseStudy.id,
                }))
              );

            if (timelineError) {
              toast.error("Failed to create timelines");
              return;
            }
          }
          router.push(`/${user.username}/case-studies/${newCaseStudy.id}`);
        }

        onSuccess();
        onOpenChange(false);
      } catch (error) {
        console.error(
          `Error ${mode === "edit" ? "updating" : "creating"} case study:`,
          error
        );
        toast.error(
          `Failed to ${mode === "edit" ? "update" : "create"} case study`
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const addTool = () => {
    if (!selectedTool) return;
    formik.setFieldValue("tools", [...formik.values.tools, selectedTool]);
    setSelectedTool("");
  };

  const removeTool = (toolId: string) => {
    formik.setFieldValue(
      "tools",
      formik.values.tools.filter((tool: string) => tool !== toolId)
    );
  };

  const addTimelineEntry = () => {
    const { newTimelineEntry } = formik.values;
    if (
      !newTimelineEntry.title ||
      !newTimelineEntry.description ||
      !newTimelineEntry.date
    ) {
      toast.error("Please fill in all timeline entry fields");
      return;
    }

    formik.setFieldValue("timelines", [
      ...formik.values.timelines,
      { ...newTimelineEntry },
    ]);

    formik.setFieldValue("newTimelineEntry", {
      title: "",
      description: "",
      date: "",
    });
  };

  const removeTimelineEntry = (id: string) => {
    formik.setFieldValue(
      "timelines",
      formik.values.timelines.filter((entry: TimelineEntry) => entry.id !== id)
    );
  };

  const addOutcome = () => {
    const { newOutcome } = formik.values;
    if (!newOutcome.title || !newOutcome.description) {
      toast.error("Please fill in all outcome fields");
      return;
    }

    formik.setFieldValue("outcomes", [
      ...formik.values.outcomes,
      { ...newOutcome },
    ]);

    formik.setFieldValue("newOutcome", {
      title: "",
      description: "",
      metrics: [],
    });
  };

  const removeOutcome = (id: string) => {
    formik.setFieldValue(
      "outcomes",
      formik.values.outcomes.filter((outcome: Outcome) => outcome.id !== id)
    );
  };

  const addMetric = (outcomeId: string, metric: string) => {
    if (!metric) return;
    formik.setFieldValue(
      "outcomes",
      formik.values.outcomes.map((o: Outcome) =>
        o.id === outcomeId ? { ...o, metrics: [...o.metrics, metric] } : o
      )
    );
  };

  const removeMetric = (outcomeId: string, metric: string) => {
    formik.setFieldValue(
      "outcomes",
      formik.values.outcomes.map((o: Outcome) =>
        o.id === outcomeId
          ? { ...o, metrics: o.metrics.filter((m: string) => m !== metric) }
          : o
      )
    );
  };

  const handleCoverImageDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setCoverImage(result);
          formik.setFieldValue("cover_image", result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    getRootProps: getCoverImageRootProps,
    getInputProps: getCoverImageInputProps,
  } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    onDrop: handleCoverImageDrop,
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "video/*": [".mp4", ".webm"],
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Case Study" : "Edit Case Study"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4 mb-4">
          {["overview", "timelines", "media", "tools", "outcomes"].map(
            (tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab}
              </Button>
            )
          )}
        </div>
        <ScrollArea className="h-[calc(90vh-8rem)]">
          <form onSubmit={formik.handleSubmit} className="p-4">
            {Object.keys(formik.errors).length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {Object.entries(formik.errors).map(([field, error]) => (
                    <li key={field}>{String(error)}</li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter case study title"
                    />
                    {formik.touched.title && formik.errors.title && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.title}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter case study description"
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="text-sm text-red-500 mt-1">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      name="overview"
                      value={formik.values.overview}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter case study overview"
                    />
                    {formik.touched.overview && formik.errors.overview && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.overview}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Cover Image</Label>
                    <div
                      {...getCoverImageRootProps()}
                      className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <input {...getCoverImageInputProps()} />
                      {coverImage || formik.values.cover_image ? (
                        <div className="relative group">
                          <img
                            src={coverImage || formik.values.cover_image || ""}
                            alt="Cover"
                            className="max-h-48 mx-auto rounded object-cover w-full"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCoverImage(null);
                                formik.setFieldValue("cover_image", "");
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            Drag and drop your cover image here, or click to
                            select
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Supported formats: PNG, JPG, JPEG, GIF
                          </div>
                        </div>
                      )}
                    </div>
                    {formik.touched.cover_image &&
                      formik.errors.cover_image && (
                        <div className="text-sm text-red-500 mt-1">
                          {formik.errors.cover_image}
                        </div>
                      )}
                  </div>

                  <div>
                    <Label htmlFor="challenge">Challenge</Label>
                    <Textarea
                      id="challenge"
                      name="challenge"
                      value={formik.values.challenge}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter the challenge faced"
                    />
                    {formik.touched.challenge && formik.errors.challenge && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.challenge}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="solution">Solution</Label>
                    <Textarea
                      id="solution"
                      name="solution"
                      value={formik.values.solution}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter the solution implemented"
                    />
                    {formik.touched.solution && formik.errors.solution && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.solution}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="outcome">Outcome</Label>
                    <Textarea
                      id="outcome"
                      name="outcome"
                      value={formik.values.outcome}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter the outcome achieved"
                    />
                    {formik.touched.outcome && formik.errors.outcome && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.outcome}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={formik.values.duration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter project duration"
                    />
                    {formik.touched.duration && formik.errors.duration && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.duration}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formik.values.role}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter your role in the project"
                    />
                    {formik.touched.role && formik.errors.role && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.role}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      name="team_size"
                      value={formik.values.team_size}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                      placeholder="Enter team size"
                    />
                    {formik.touched.team_size && formik.errors.team_size && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.team_size}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      name="client"
                      value={formik.values.client}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter client name"
                    />
                    {formik.touched.client && formik.errors.client && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.client}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formik.values.industry}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter industry"
                    />
                    {formik.touched.industry && formik.errors.industry && (
                      <div className="text-sm text-red-500 mt-1">
                        {formik.errors.industry}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "timelines" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Timeline Entry</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Title"
                      value={formik.values.newTimelineEntry.title}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "newTimelineEntry.title",
                          e.target.value
                        );
                      }}
                    />
                    <Input
                      type="date"
                      value={formik.values.newTimelineEntry.date}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "newTimelineEntry.date",
                          e.target.value
                        );
                      }}
                    />
                    <Button type="button" onClick={addTimelineEntry}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Entry
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={formik.values.newTimelineEntry.description}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "newTimelineEntry.description",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timeline Entries</Label>
                  {formik.values.timelines.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="flex items-start space-x-2 p-2 border rounded"
                    >
                      <div className="flex-grow">
                        <div className="font-semibold">{entry.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.date}
                        </div>
                        <div className="text-sm">{entry.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          formik.setFieldValue(
                            "timelines",
                            formik.values.timelines.filter(
                              (e) => e.id !== entry.id
                            )
                          );
                          formik.setFieldValue("removedTimelines", [entry.id]);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Media</Label>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag & drop files here, or click to select files
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports images and videos
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Media Preview</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {formik.values.images.map((image, index) => (
                      <div
                        key={image}
                        className="relative border rounded p-2 group"
                      >
                        <img
                          src={image}
                          alt={`Media ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            formik.setFieldValue(
                              "images",
                              formik.values.images.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative border rounded p-2 group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded"
                        />
                        <div className="text-sm text-muted-foreground mt-1 truncate">
                          {file.name}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setUploadedFiles((files) =>
                              files.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tools" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Tool/Technology</Label>
                  <div className="flex space-x-2">
                    <Select
                      value={selectedTool}
                      onValueChange={setSelectedTool}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tool" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonTools.map((tool) => (
                          <SelectItem key={tool} value={tool}>
                            {tool}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addTool}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tools & Technologies</Label>
                  <div className="flex flex-wrap gap-2">
                    {formik.values.tools.map((tool) => (
                      <Badge
                        key={tool}
                        variant="secondary"
                        className="flex items-center"
                      >
                        {tool}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => removeTool(tool)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "outcomes" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Outcome</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Title"
                      value={formik.values.newOutcome.title}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "newOutcome.title",
                          e.target.value
                        );
                      }}
                    />
                    <Button type="button" onClick={addOutcome}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Outcome
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Description"
                    value={formik.values.newOutcome.description}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "newOutcome.description",
                        e.target.value
                      );
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Outcomes</Label>
                  {formik.values.outcomes.map((outcome, index) => (
                    <div
                      key={outcome.id || index}
                      className="flex items-start space-x-2 p-2 border rounded"
                    >
                      <div className="flex-grow">
                        <div className="font-semibold">{outcome.title}</div>
                        <div className="text-sm">{outcome.description}</div>
                        <div className="mt-2 space-y-1">
                          {outcome.metrics.map((metric, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <span>{metric}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  formik.setFieldValue(
                                    "outcomes",
                                    formik.values.outcomes.map((o) =>
                                      o.id === outcome.id
                                        ? {
                                            ...o,
                                            metrics: o.metrics.filter(
                                              (m) => m !== metric
                                            ),
                                          }
                                        : o
                                    )
                                  );
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const metric = prompt("Enter metric:");
                              if (metric) {
                                formik.setFieldValue(
                                  "outcomes",
                                  formik.values.outcomes.map((o) =>
                                    o.id === outcome.id
                                      ? {
                                          ...o,
                                          metrics: [...o.metrics, metric],
                                        }
                                      : o
                                  )
                                );
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Metric
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          formik.setFieldValue(
                            "outcomes",
                            formik.values.outcomes.filter(
                              (o) => o.id !== outcome.id
                            )
                          );
                          formik.setFieldValue("removedOutcomes", [outcome.id]);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            onClick={() => formik.handleSubmit()}
          >
            {formik.isSubmitting ? "Saving..." : "Save Case Study"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
