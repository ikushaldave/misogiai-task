"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface CaseStudiesGridProps {
  caseStudies: CaseStudy[];
  onRefresh: () => void;
}

export function CaseStudiesGrid({
  caseStudies,
  onRefresh,
}: CaseStudiesGridProps) {
  const recentCaseStudies = caseStudies.slice(0, 6);
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Case Studies</CardTitle>
          <CardDescription>Your latest portfolio projects</CardDescription>
        </div>
        <Link href="/dashboard/case-studies">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentCaseStudies.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No case studies yet</h3>
            <p className="text-muted-foreground mb-4">
              Start showcasing your work by creating your first case study
            </p>
            <Link href="/dashboard/case-studies">
              <Button>Create Case Study</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentCaseStudies.map((caseStudy) => (
              <Card
                key={caseStudy.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {caseStudy.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {caseStudy.description}
                      </CardDescription>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/${user?.username}/case-studies/${caseStudy.id}`
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/case-studies`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {caseStudy.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(caseStudy.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
