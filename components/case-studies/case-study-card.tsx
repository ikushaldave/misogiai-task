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

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  overview: string;
  cover_image: string;
  client: string;
  industry: string;
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  viewMode: "grid" | "list";
  onUpdate: () => void;
}

export function CaseStudyCard({
  caseStudy,
  viewMode,
  onUpdate,
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
      onUpdate();
    } catch (error) {
      console.error("Error deleting case study:", error);
      alert("Failed to delete case study");
    } finally {
      setIsDeleting(false);
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="flex items-center p-4">
        <div className="relative h-20 w-20 flex-shrink-0">
          <Image
            src={caseStudy.cover_image || "/placeholder.png"}
            alt={caseStudy.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-semibold">{caseStudy.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {caseStudy.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              router.push(`/dashboard/case-studies/${caseStudy.id}`)
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/case-studies/${caseStudy.id}`)}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={caseStudy.cover_image || "/placeholder.png"}
          alt={caseStudy.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <h3 className="font-semibold">{caseStudy.title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {caseStudy.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/case-studies/${caseStudy.id}`)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/case-studies/${caseStudy.id}`)}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
