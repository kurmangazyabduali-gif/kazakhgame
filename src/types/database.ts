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
        Insert: {
          id?: string
          slug: string
          name: string
          category: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          category?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          game_id: string
          user_id: string
          start_time: string
          end_time: string | null
          status: string | null
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          start_time?: string
          end_time?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          status?: string | null
        }
      }
      game_scores: {
        Row: {
          id: string
          session_id: string | null
          user_id: string
          game_id: string
          score: number
          xp_earned: number
          duration: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          user_id: string
          game_id: string
          score?: number
          xp_earned?: number
          duration?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          user_id?: string
          game_id?: string
          score?: number
          xp_earned?: number
          duration?: number | null
          metadata?: Json | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string | null
          xp_reward: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon?: string | null
          xp_reward?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string | null
          xp_reward?: number | null
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      quests: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          requirements: Json
          xp_reward: number | null
          achievement_reward_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          requirements?: Json
          xp_reward?: number | null
          achievement_reward_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          requirements?: Json
          xp_reward?: number | null
          achievement_reward_id?: string | null
          created_at?: string
        }
      }
      quest_progress: {
        Row: {
          id: string
          user_id: string
          quest_id: string
          status: string
          progress: Json
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quest_id: string
          status?: string
          progress?: Json
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quest_id?: string
          status?: string
          progress?: Json
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          read?: boolean
          metadata?: Json | null
          created_at?: string
        }
      }
      kusbegilik_eagles: {
        Row: {
          user_id: string
          name: string
          level: number
          experience: number
          trust: number
          speed: number
          stamina: number
          turning: number
          reaction: number
          focus: number
          divePower: number
          accuracy: number
          missions_completed: number
          best_score: number
          success_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name?: string
          level?: number
          experience?: number
          trust?: number
          speed?: number
          stamina?: number
          turning?: number
          reaction?: number
          focus?: number
          divePower?: number
          accuracy?: number
          missions_completed?: number
          best_score?: number
          success_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          level?: number
          experience?: number
          trust?: number
          speed?: number
          stamina?: number
          turning?: number
          reaction?: number
          focus?: number
          divePower?: number
          accuracy?: number
          missions_completed?: number
          best_score?: number
          success_rate?: number
          created_at?: string
          updated_at?: string
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
