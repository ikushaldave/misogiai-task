"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface AnalyticsData {
  id: string;
  event_type: string;
  page_path: string;
  visitor_id: string;
  metadata: any;
  created_at: string;
}

interface AnalyticsChartsProps {
  data: AnalyticsData[];
}

export function TopPages({ data }: AnalyticsChartsProps) {
  // Group data by page path and count visits
  const pageStats = data.reduce((acc, item) => {
    const path = item.page_path;
    if (!acc[path]) {
      acc[path] = {
        path,
        visits: 0,
        uniqueVisitors: new Set(),
      };
    }
    acc[path].visits++;
    acc[path].uniqueVisitors.add(item.visitor_id);
    return acc;
  }, {} as Record<string, { path: string; visits: number; uniqueVisitors: Set<string> }>);

  // Convert to array and sort by visits
  const topPages = Object.values(pageStats)
    .map((item) => ({
      path: item.path,
      visits: item.visits,
      uniqueVisitors: item.uniqueVisitors.size,
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPages.map((page, index) => (
            <div key={page.path} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{page.path}</div>
                  <div className="text-sm text-muted-foreground">
                    {page.uniqueVisitors} unique visitors
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium">{page.visits} views</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
