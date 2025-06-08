'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@/lib/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Eye, MousePointer } from 'lucide-react';

interface Activity {
  id: string;
  event_type: string;
  page_path: string;
  visitor_id: string;
  metadata: any;
  created_at: string;
}

interface RecentActivityProps {
  userId: string;
}

export function RecentActivity({ userId }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, [userId]);

  const fetchRecentActivity = async () => {
    setLoading(true);
    const data = await Analytics.getAnalytics(userId);
    setActivities(data.slice(0, 10));
    setLoading(false);
  };

  const getActivityIcon = (eventType: string) => {
    switch (eventType) {
      case 'page_view':
        return <Eye className="h-4 w-4" />;
      case 'click':
        return <MousePointer className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getActivityDescription = (activity: Activity) => {
    switch (activity.event_type) {
      case 'page_view':
        return `Viewed ${activity.page_path}`;
      case 'click':
        return `Clicked ${activity.metadata?.element || 'element'}`;
      default:
        return activity.event_type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest visitor interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-2 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Eye className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No recent activity to show
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-xs">
                    {getActivityIcon(activity.event_type)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {getActivityDescription(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}