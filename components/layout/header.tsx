'use client';

import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">ProjectShelf</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Link href="/auth" className="text-sm font-medium hover:text-primary transition-colors">
            Sign In
          </Link>
        </nav>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}