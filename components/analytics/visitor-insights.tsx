"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Clock, MousePointer, ArrowUpRight } from "lucide-react";

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

export function VisitorInsights({ data }: AnalyticsChartsProps) {
  // Calculate average session duration
  const sessionDurations = data.reduce((acc, item) => {
    const visitorId = item.visitor_id;
    if (!acc[visitorId]) {
      acc[visitorId] = {
        firstVisit: new Date(item.created_at),
        lastVisit: new Date(item.created_at),
      };
    } else {
      const visitTime = new Date(item.created_at);
      if (visitTime < acc[visitorId].firstVisit) {
        acc[visitorId].firstVisit = visitTime;
      }
      if (visitTime > acc[visitorId].lastVisit) {
        acc[visitorId].lastVisit = visitTime;
      }
    }
    return acc;
  }, {} as Record<string, { firstVisit: Date; lastVisit: Date }>);

  const avgSessionDuration =
    Object.values(sessionDurations).reduce((acc, session) => {
      return acc + (session.lastVisit.getTime() - session.firstVisit.getTime());
    }, 0) /
    Object.keys(sessionDurations).length /
    1000; // Convert to seconds

  // Calculate bounce rate (visitors who only viewed one page)
  const visitorPages = data.reduce((acc, item) => {
    const visitorId = item.visitor_id;
    if (!acc[visitorId]) {
      acc[visitorId] = new Set();
    }
    acc[visitorId].add(item.page_path);
    return acc;
  }, {} as Record<string, Set<string>>);

  const bounceRate =
    (Object.values(visitorPages).filter((pages) => pages.size === 1).length /
      Object.keys(visitorPages).length) *
    100;

  // Calculate average pages per session
  const avgPagesPerSession =
    Object.values(visitorPages).reduce((acc, pages) => acc + pages.size, 0) /
    Object.keys(visitorPages).length;

  // Calculate most common entry points
  const entryPoints = data.reduce((acc, item) => {
    const visitorId = item.visitor_id;
    if (!acc[visitorId]) {
      acc[visitorId] = item.page_path;
    }
    return acc;
  }, {} as Record<string, string>);

  const topEntryPoints = Object.values(entryPoints).reduce((acc, path) => {
    acc[path] = (acc[path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedEntryPoints = Object.entries(topEntryPoints)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg. Session Duration</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(avgSessionDuration / 60)}m{" "}
              {Math.round(avgSessionDuration % 60)}s
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Bounce Rate</span>
            </div>
            <div className="text-2xl font-bold">{Math.round(bounceRate)}%</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Pages per Session</span>
            </div>
            <div className="text-2xl font-bold">
              {avgPagesPerSession.toFixed(1)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Top Entry Points</span>
            </div>
            <div className="space-y-1">
              {sortedEntryPoints.map(([path, count]) => (
                <div key={path} className="flex justify-between text-sm">
                  <span className="truncate max-w-[150px]">{path}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
