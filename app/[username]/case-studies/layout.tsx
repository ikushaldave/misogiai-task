"use client";

import { UserLayout } from "@/components/layout/user-layout";

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
