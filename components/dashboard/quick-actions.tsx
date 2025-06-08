'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Palette, BarChart3, ExternalLink } from 'lucide-react';
import Link from 'next/link';

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

interface QuickActionsProps {
  profile: Profile;
}

export function QuickActions({ profile }: QuickActionsProps) {
  const actions = [
    {
      title: 'New Case Study',
      description: 'Create a new portfolio project',
      icon: Plus,
      href: '/dashboard/case-studies',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Customize Theme',
      description: 'Change your portfolio theme',
      icon: Palette,
      href: '/dashboard/profile',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'View Analytics',
      description: 'Track your portfolio performance',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'text-green-600 bg-green-100 dark:bg-green-900',
    },
    {
      title: 'View Portfolio',
      description: 'See your public portfolio',
      icon: ExternalLink,
      href: `/${profile.username}`,
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900',
      external: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link 
              key={index} 
              href={action.href}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
            >
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-3 hover:bg-muted"
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}