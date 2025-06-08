'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Palette, FileText, Camera, Baseline as Timeline, Globe, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Dynamic Case Studies',
    description: 'Create detailed case studies with project overviews, challenges, solutions, and outcomes.',
  },
  {
    icon: Camera,
    title: 'Media Galleries',
    description: 'Showcase your work with beautiful image galleries and video embeds.',
  },
  {
    icon: Timeline,
    title: 'Project Timelines',
    description: 'Document your design and development process with interactive timelines.',
  },
  {
    icon: Palette,
    title: 'Beautiful Themes',
    description: 'Choose from professionally designed themes with real-time preview.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Track portfolio performance, visitor engagement, and project popularity.',
  },
  {
    icon: Globe,
    title: 'Custom URLs',
    description: 'Get your own personalized portfolio URL to share with clients and employers.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for performance with fast loading times and smooth interactions.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Your portfolio is hosted securely with 99.9% uptime guarantee.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need to Showcase Your Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ProjectShelf provides all the tools you need to create professional portfolios 
            that stand out and convert visitors into clients.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}