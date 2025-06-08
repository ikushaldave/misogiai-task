"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Analytics } from "@/lib/analytics";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { TopPages } from "@/components/analytics/top-pages";
import { VisitorInsights } from "@/components/analytics/visitor-insights";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

interface AnalyticsData {
  id: string;
  event_type: string;
  page_path: string;
  visitor_id: string;
  metadata: any;
  created_at: string;
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      redirect("/auth");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user && dateRange?.from && dateRange?.to) {
      fetchAnalytics();
    }
  }, [user, dateRange]);

  const fetchAnalytics = async () => {
    if (!user || !dateRange?.from || !dateRange?.to) return;

    setLoadingData(true);

    const startDate = format(dateRange.from, "yyyy-MM-dd");
    const endDate = format(dateRange.to, "yyyy-MM-dd");

    const data = await Analytics.getAnalytics(user.id, startDate, endDate);
    setAnalyticsData(data);
    setLoadingData(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Track your portfolio performance and visitor engagement
            </p>
          </div>

          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        {loadingData ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        ) : analyticsData.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
              <CardDescription>
                No analytics data found for the selected date range. Share your
                portfolio to start collecting data!
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            <AnalyticsOverview data={analyticsData} />

            <div className="grid gap-6 lg:grid-cols-2">
              <AnalyticsCharts data={analyticsData} />
              <TopPages data={analyticsData} />
            </div>

            <VisitorInsights data={analyticsData} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
