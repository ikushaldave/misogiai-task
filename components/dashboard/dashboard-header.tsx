'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Plus } from 'lucide-react';
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

interface DashboardHeaderProps {
  profile: Profile;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="text-lg">
                {profile.full_name?.charAt(0) || profile.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {profile.full_name || profile.username}!</h1>
              <p className="text-muted-foreground">
                Manage your portfolio and track your success
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">@{profile.username}</Badge>
                <Badge variant="outline">{profile.theme} theme</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href={`/${profile.username}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Portfolio
              </Button>
            </Link>
            <Link href="/dashboard/case-studies">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Case Study
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}