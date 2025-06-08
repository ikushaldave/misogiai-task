'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Palette, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="h-4 w-4" />
              <span>Create stunning portfolios in minutes</span>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Showcase Your Work with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dynamic Portfolios
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            ProjectShelf helps designers, developers, and writers create stunning portfolios 
            with modular case studies, beautiful themes, and detailed analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth">
              <Button size="lg" className="h-12 px-8">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-12 px-8">
                Learn More
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Beautiful Themes</h3>
              <p className="text-sm text-muted-foreground">
                Choose from professionally designed themes
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Create and deploy portfolios in minutes
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold mb-2">Built for Creatives</h3>
              <p className="text-sm text-muted-foreground">
                Perfect for designers, developers, and writers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}