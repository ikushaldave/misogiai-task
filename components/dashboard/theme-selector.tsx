"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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

interface ThemeSelectorProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
}

const themes = [
  {
    id: "default",
    name: "Default",
    description: "Clean and professional design with a focus on content",
    preview: "/themes/default.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design with minimal distractions",
    preview: "/themes/minimal.png",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and artistic design for creative professionals",
    preview: "/themes/creative.png",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with dynamic layouts",
    preview: "/themes/modern.png",
  },
];

export function ThemeSelector({ profile, onUpdate }: ThemeSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(
    profile.theme || "default"
  );

  const handleThemeChange = async (theme: string) => {
    setIsLoading(true);
    setSelectedTheme(theme);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          theme,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      onUpdate({
        ...profile,
        theme,
      });

      toast.success("Theme updated");
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        value={selectedTheme}
        onValueChange={handleThemeChange}
        className="grid gap-4 md:grid-cols-2"
      >
        {themes.map((theme) => (
          <div key={theme.id}>
            <RadioGroupItem
              value={theme.id}
              id={theme.id}
              className="peer sr-only"
              disabled={isLoading}
            />
            <Label
              htmlFor={theme.id}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="space-y-2">
                <div className="font-medium">{theme.name}</div>
                <div className="text-sm text-muted-foreground">
                  {theme.description}
                </div>
              </div>
              <div className="mt-4 h-32 w-full overflow-hidden rounded-md border bg-background">
                <img
                  src={theme.preview}
                  alt={`${theme.name} theme preview`}
                  className="h-full w-full object-cover"
                />
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        <Button
          onClick={() => window.open(`/${profile.username}`, "_blank")}
          variant="outline"
        >
          Preview Portfolio
        </Button>
      </div>
    </div>
  );
}
