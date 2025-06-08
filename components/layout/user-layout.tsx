"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, LayoutDashboard, FileText } from "lucide-react";

export function UserLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      {/* Floating Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <Link
            href="/dashboard"
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              pathname === "/dashboard" ? "bg-gray-100 dark:bg-gray-700" : ""
            }`}
            aria-label="Go to dashboard"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <Link
            href="/dashboard/case-studies"
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              pathname === "/dashboard/case-studies"
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }`}
            aria-label="Go to case studies"
          >
            <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
