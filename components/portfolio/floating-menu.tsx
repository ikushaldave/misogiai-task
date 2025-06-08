"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Palette, Edit, Plus, MoreVertical } from "lucide-react";
import Link from "next/link";

interface FloatingMenuProps {
  profileUsername: string;
  caseStudyId?: string;
}

export function FloatingMenu({ profileUsername, caseStudyId }: FloatingMenuProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Only show for authenticated users viewing their own profile
  if (!user || !user.user_metadata?.username || user.user_metadata.username !== profileUsername) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            <MoreVertical className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mb-2">
          {caseStudyId ? (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/case-studies`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Case Study
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/case-studies" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Case Study
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Change Theme
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}