import { supabase } from './supabase';

export class Analytics {
  private static generateVisitorId(): string {
    return crypto.randomUUID();
  }

  private static getVisitorId(): string {
    const key = 'projectshelf_visitor_id';
    let visitorId = localStorage.getItem(key);
    
    if (!visitorId) {
      visitorId = this.generateVisitorId();
      localStorage.setItem(key, visitorId);
    }
    
    return visitorId;
  }

  static async trackPageView(userId: string, pagePath: string, metadata?: any) {
    try {
      const visitorId = this.getVisitorId();
      
      await supabase.from('analytics').insert({
        user_id: userId,
        event_type: 'page_view',
        page_path: pagePath,
        visitor_id: visitorId,
        metadata: metadata || {},
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  static async trackClick(userId: string, pagePath: string, element: string, metadata?: any) {
    try {
      const visitorId = this.getVisitorId();
      
      await supabase.from('analytics').insert({
        user_id: userId,
        event_type: 'click',
        page_path: pagePath,
        visitor_id: visitorId,
        metadata: { element, ...metadata },
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  static async getAnalytics(userId: string, startDate?: string, endDate?: string) {
    try {
      let query = supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  }
}