export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      books: {
        Row: {
          aladin_item_id: number | null
          author: string | null
          cover_url: string | null
          created_at: string
          id: string
          isbn: string | null
          published_date: string | null
          publisher: string | null
          title: string
        }
        Insert: {
          aladin_item_id?: number | null
          author?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          published_date?: string | null
          publisher?: string | null
          title: string
        }
        Update: {
          aladin_item_id?: number | null
          author?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          published_date?: string | null
          publisher?: string | null
          title?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          trace_card_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          trace_card_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          trace_card_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "admin_conversation_logs"
            referencedColumns: ["trace_id"]
          },
          {
            foreignKeyName: "comments_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "trace_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "trace_cards_with_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          book_id: string
          created_at: string
          id: string
          last_message_at: string | null
          message_count: number
          status: string
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          message_count?: number
          status?: string
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          message_count?: number
          status?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          attachments?: Json
          content?: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          attachments?: Json
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "admin_conversation_logs"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          from_user_id: string | null
          id: string
          is_read: boolean
          message: string
          trace_card_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean
          message?: string
          trace_card_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean
          message?: string
          trace_card_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "admin_conversation_logs"
            referencedColumns: ["trace_id"]
          },
          {
            foreignKeyName: "notifications_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "trace_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "trace_cards_with_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          nickname: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id: string
          nickname?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          nickname?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          id: string
          trace_card_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          trace_card_id: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          trace_card_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "admin_conversation_logs"
            referencedColumns: ["trace_id"]
          },
          {
            foreignKeyName: "reactions_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "trace_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "trace_cards_with_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      share_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          owner_id: string
          requester_id: string
          status: string
          trace_card_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          owner_id: string
          requester_id: string
          status?: string
          trace_card_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          owner_id?: string
          requester_id?: string
          status?: string
          trace_card_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_requests_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "admin_conversation_logs"
            referencedColumns: ["trace_id"]
          },
          {
            foreignKeyName: "share_requests_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "trace_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_requests_trace_card_id_fkey"
            columns: ["trace_card_id"]
            isOneToOne: false
            referencedRelation: "trace_cards_with_counts"
            referencedColumns: ["id"]
          },
        ]
      }
      trace_cards: {
        Row: {
          book_id: string
          conversation_id: string | null
          created_at: string
          id: string
          is_public: boolean
          layers: Json
          nickname: string
          quote: string | null
          representative_sentence: string | null
          trace_expanded: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          layers?: Json
          nickname?: string
          quote?: string | null
          representative_sentence?: string | null
          trace_expanded?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          layers?: Json
          nickname?: string
          quote?: string | null
          representative_sentence?: string | null
          trace_expanded?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trace_cards_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trace_cards_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "admin_conversation_logs"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "trace_cards_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trace_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_conversation_logs: {
        Row: {
          book_id: string | null
          book_title: string | null
          conversation_created_at: string | null
          conversation_id: string | null
          conversation_text: string | null
          first_message_at: string | null
          last_message_at: string | null
          message_count: number | null
          nickname: string | null
          status: string | null
          summary: string | null
          trace_id: string | null
          trace_quote: string | null
          trace_representative_sentence: string | null
          trace_updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trace_cards_with_counts: {
        Row: {
          book_id: string | null
          comment_count: number | null
          created_at: string | null
          heart_count: number | null
          id: string | null
          is_public: boolean | null
          layers: Json | null
          quote: string | null
          representative_sentence: string | null
          trace_expanded: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          comment_count?: never
          created_at?: string | null
          heart_count?: never
          id?: string | null
          is_public?: boolean | null
          layers?: Json | null
          quote?: string | null
          representative_sentence?: string | null
          trace_expanded?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          comment_count?: never
          created_at?: string | null
          heart_count?: never
          id?: string | null
          is_public?: boolean | null
          layers?: Json | null
          quote?: string | null
          representative_sentence?: string | null
          trace_expanded?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trace_cards_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trace_cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

