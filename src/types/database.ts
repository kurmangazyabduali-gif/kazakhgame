export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          region_id: string | null
          school_id: string | null
          class_name: string | null
          level: number
          xp: number
          total_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          region_id?: string | null
          school_id?: string | null
          class_name?: string | null
          level?: number
          xp?: number
          total_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          region_id?: string | null
          school_id?: string | null
          class_name?: string | null
          level?: number
          xp?: number
          total_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      // Add other tables as needed...
      games: {
        Row: {
          id: string
          slug: string
          name: string
          category: string
          description: string | null
          image_url: string | null
          created_at: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
