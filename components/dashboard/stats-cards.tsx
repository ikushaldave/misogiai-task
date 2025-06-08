'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, FolderOpen, TrendingUp, Users } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalViews: number;
    totalProjects: number;
    thisMonth: number;
    engagement: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      description: 'Portfolio page views',
      icon: Eye,
      color: 'text-blue-600',
    },
    {
      title: 'Projects',
      value: stats.totalProjects.toString(),
      description: 'Published case studies',
      icon: FolderOpen,
      color: 'text-green-600',
    },
    {
      title: 'This Month',
      value: stats.thisMonth.toLocaleString(),
      description: 'Views this month',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
    {
      title: 'Engagement',
      value: `${stats.engagement}%`,
      description: 'Monthly growth rate',
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}