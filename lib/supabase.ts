import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          bio: string;
          avatar_url: string;
          website: string;
          location: string;
          theme: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string;
          bio?: string;
          avatar_url?: string;
          website?: string;
          location?: string;
          theme?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          bio?: string;
          avatar_url?: string;
          website?: string;
          location?: string;
          theme?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      case_studies: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          overview: string;
          challenge: string;
          solution: string;
          outcome: string;
          tools: string[];
          technologies: string[];
          duration: string;
          role: string;
          team_size: number;
          cover_image: string;
          images: string[];
          video_url: string;
          live_url: string;
          github_url: string;
          featured: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          overview?: string;
          challenge?: string;
          solution?: string;
          outcome?: string;
          tools?: string[];
          technologies?: string[];
          duration?: string;
          role?: string;
          team_size?: number;
          cover_image?: string;
          images?: string[];
          video_url?: string;
          live_url?: string;
          github_url?: string;
          featured?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          overview?: string;
          challenge?: string;
          solution?: string;
          outcome?: string;
          tools?: string[];
          technologies?: string[];
          duration?: string;
          role?: string;
          team_size?: number;
          cover_image?: string;
          images?: string[];
          video_url?: string;
          live_url?: string;
          github_url?: string;
          featured?: boolean;
          order_index?: number;
          client?: string;
          industry?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      timelines: {
        Row: {
          id: string;
          case_study_id: string;
          title: string;
          description: string;
          date: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_study_id: string;
          title: string;
          description?: string;
          date: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_study_id?: string;
          title?: string;
          description?: string;
          date?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          page_path: string;
          visitor_id: string;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          page_path: string;
          visitor_id: string;
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_type?: string;
          page_path?: string;
          visitor_id?: string;
          metadata?: any;
          created_at?: string;
        };
      };
      outcomes: {
        Row: {
          id: string;
          case_study_id: string;
          title: string;
          description: string;
          metrics: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          case_study_id: string;
          title: string;
          description?: string;
          metrics?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          case_study_id?: string;
          title?: string;
          description?: string;
          metrics?: string[];
          created_at?: string;
        };
      };
    };
  };
};
