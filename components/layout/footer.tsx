'use client';

import { Palette } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">ProjectShelf</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create stunning portfolios and dynamic case studies for your creative work.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <div className="space-y-2 text-sm">
              <Link href="#features" className="block text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Templates
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ProjectShelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}