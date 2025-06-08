'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Ready to Build Your Dream Portfolio?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of creatives who've already elevated their careers with ProjectShelf. 
          Start building your portfolio today — it's free!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              Get Started Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <p className="text-sm text-blue-200 mt-6">
          No credit card required • Set up in under 5 minutes • Cancel anytime
        </p>
      </div>
    </section>
  );
}