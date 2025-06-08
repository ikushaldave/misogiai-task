"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Clock, MousePointer } from "lucide-react";

interface AnalyticsData {
  id: string;
  event_type: string;
  page_path: string;
  visitor_id: string;
  metadata: any;
  created_at: string;
}

interface AnalyticsOverviewProps {
  data: AnalyticsData[];
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  // Calculate unique visitors
  const uniqueVisitors = new Set(data.map((item) => item.visitor_id)).size;

  // Calculate total page views
  const totalPageViews = data.length;

  // Calculate average time on site (if available in metadata)
  const timeOnSite =
    data.reduce((acc, item) => {
      return acc + (item.metadata?.timeOnSite || 0);
    }, 0) / uniqueVisitors || 0;

  // Calculate total interactions
  const totalInteractions = data.filter(
    (item) =>
      item.event_type === "click" ||
      item.event_type === "scroll" ||
      item.event_type === "hover"
  ).length;

  const metrics = [
    {
      title: "Unique Visitors",
      value: uniqueVisitors,
      icon: Users,
      description: "Total unique visitors",
    },
    {
      title: "Page Views",
      value: totalPageViews,
      icon: Eye,
      description: "Total page views",
    },
    {
      title: "Avg. Time on Site",
      value: `${Math.round(timeOnSite / 60)}m ${Math.round(timeOnSite % 60)}s`,
      icon: Clock,
      description: "Average time spent",
    },
    {
      title: "Interactions",
      value: totalInteractions,
      icon: MousePointer,
      description: "Total user interactions",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
