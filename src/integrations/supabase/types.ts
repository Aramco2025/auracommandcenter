export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_agent_activities: {
        Row: {
          agent_name: string
          completed_at: string | null
          created_at: string
          id: string
          last_action: string | null
          progress: number | null
          started_at: string | null
          status: string | null
          task_description: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_name: string
          completed_at?: string | null
          created_at?: string
          id?: string
          last_action?: string | null
          progress?: number | null
          started_at?: string | null
          status?: string | null
          task_description: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_name?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          last_action?: string | null
          progress?: number | null
          started_at?: string | null
          status?: string | null
          task_description?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          attendees: Json | null
          created_at: string
          description: string | null
          end_time: string
          google_event_id: string
          id: string
          location: string | null
          meeting_link: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: Json | null
          created_at?: string
          description?: string | null
          end_time: string
          google_event_id: string
          id?: string
          location?: string | null
          meeting_link?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: Json | null
          created_at?: string
          description?: string | null
          end_time?: string
          google_event_id?: string
          id?: string
          location?: string | null
          meeting_link?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      command_history: {
        Row: {
          command_text: string
          command_type: string | null
          created_at: string
          executed_at: string | null
          id: string
          result: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          command_text: string
          command_type?: string | null
          created_at?: string
          executed_at?: string | null
          id?: string
          result?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          command_text?: string
          command_type?: string | null
          created_at?: string
          executed_at?: string | null
          id?: string
          result?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emails: {
        Row: {
          body_preview: string | null
          created_at: string
          id: string
          is_reply: boolean | null
          is_sent: boolean | null
          labels: string[] | null
          message_id: string
          received_at: string | null
          recipient_emails: string[] | null
          sender_email: string
          sent_at: string | null
          subject: string | null
          thread_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body_preview?: string | null
          created_at?: string
          id?: string
          is_reply?: boolean | null
          is_sent?: boolean | null
          labels?: string[] | null
          message_id: string
          received_at?: string | null
          recipient_emails?: string[] | null
          sender_email: string
          sent_at?: string | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body_preview?: string | null
          created_at?: string
          id?: string
          is_reply?: boolean | null
          is_sent?: boolean | null
          labels?: string[] | null
          message_id?: string
          received_at?: string | null
          recipient_emails?: string[] | null
          sender_email?: string
          sent_at?: string | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notion_tasks: {
        Row: {
          assignee: string | null
          created_at: string
          due_date: string | null
          id: string
          last_edited_time: string | null
          notion_page_id: string
          notion_task_id: string | null
          notion_url: string | null
          priority: string | null
          progress: number | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          last_edited_time?: string | null
          notion_page_id: string
          notion_task_id?: string | null
          notion_url?: string | null
          priority?: string | null
          progress?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          last_edited_time?: string | null
          notion_page_id?: string
          notion_task_id?: string | null
          notion_url?: string | null
          priority?: string | null
          progress?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sheets_data: {
        Row: {
          created_at: string
          id: string
          last_updated: string | null
          row_data: Json
          row_index: number | null
          sheet_id: string
          sheet_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated?: string | null
          row_data: Json
          row_index?: number | null
          sheet_id: string
          sheet_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_updated?: string | null
          row_data?: Json
          row_index?: number | null
          sheet_id?: string
          sheet_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          billing_cycle: string | null
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          created_at: string
          google_access_token: string | null
          google_refresh_token: string | null
          id: string
          integration_type: string
          is_connected: boolean | null
          last_sync: string | null
          notion_access_token: string | null
          settings: Json | null
          slack_access_token: string | null
          stripe_customer_id: string | null
          stripe_subscription_status: string | null
          sync_frequency: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          google_access_token?: string | null
          google_refresh_token?: string | null
          id?: string
          integration_type: string
          is_connected?: boolean | null
          last_sync?: string | null
          notion_access_token?: string | null
          settings?: Json | null
          slack_access_token?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_status?: string | null
          sync_frequency?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          google_access_token?: string | null
          google_refresh_token?: string | null
          id?: string
          integration_type?: string
          is_connected?: boolean | null
          last_sync?: string | null
          notion_access_token?: string | null
          settings?: Json | null
          slack_access_token?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_status?: string | null
          sync_frequency?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_notes: {
        Row: {
          audio_url: string | null
          created_at: string
          duration: number | null
          id: string
          is_processed: boolean | null
          is_urgent: boolean | null
          tags: string[] | null
          title: string | null
          transcript: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          is_processed?: boolean | null
          is_urgent?: boolean | null
          tags?: string[] | null
          title?: string | null
          transcript?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          is_processed?: boolean | null
          is_urgent?: boolean | null
          tags?: string[] | null
          title?: string | null
          transcript?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
