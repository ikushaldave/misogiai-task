"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  bio: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  location: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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

interface ProfileFormProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      username: profile.username,
      full_name: profile.full_name,
      bio: profile.bio || "",
      website: profile.website || "",
      location: profile.location || "",
    },
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        let avatarUrl = profile.avatar_url;

        if (values.avatar) {
          const fileExt = values.avatar.name.split(".").pop();
          const fileName = `avatars/${profile.id}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("media")
            .upload(fileName, values.avatar);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("media").getPublicUrl(fileName);

          avatarUrl = publicUrl;
        }

        // Update profile in database
        const { error } = await supabase
          .from("profiles")
          .update({
            username: values.username,
            full_name: values.full_name,
            bio: values.bio,
            website: values.website,
            location: values.location,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (error) throw error;

        onUpdate({
          ...profile,
          ...values,
          avatar_url: avatarUrl,
        });

        toast.success("Profile updated");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    formik.setFieldValue("avatar", file);

    // Create preview URL for the avatar
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={avatarPreview || profile.avatar_url}
              alt={formik.values.full_name}
              className="object-contain"
            />
            <AvatarFallback>
              {formik.values.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar">Profile Picture</Label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isLoading}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-sm text-red-500">{formik.errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
            {formik.touched.full_name && formik.errors.full_name && (
              <p className="text-sm text-red-500">{formik.errors.full_name}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoading}
            rows={4}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formik.values.website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              placeholder="https://example.com"
            />
            {formik.touched.website && formik.errors.website && (
              <p className="text-sm text-red-500">{formik.errors.website}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="mt-6" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
