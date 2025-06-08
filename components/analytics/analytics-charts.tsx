"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, eachDayOfInterval } from "date-fns";

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

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  // Get the date range from the data
  const dates = data.map((item) => parseISO(item.created_at));
  const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  // Create an array of all days in the range
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Prepare data for the chart
  const chartData = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayData = data.filter(
      (item) => format(parseISO(item.created_at), "yyyy-MM-dd") === dayStr
    );

    return {
      date: format(day, "MMM dd"),
      visitors: new Set(dayData.map((item) => item.visitor_id)).size,
      pageViews: dayData.length,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                name="Unique Visitors"
              />
              <Line
                type="monotone"
                dataKey="pageViews"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                name="Page Views"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
