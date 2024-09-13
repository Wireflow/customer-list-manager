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
      accounts: {
        Row: {
          createdAt: string
          id: string
          phoneNumber: string
        }
        Insert: {
          createdAt?: string
          id?: string
          phoneNumber: string
        }
        Update: {
          createdAt?: string
          id?: string
          phoneNumber?: string
        }
        Relationships: []
      }
      listItems: {
        Row: {
          createdAt: string
          id: number
          listId: string
          productId: string
        }
        Insert: {
          createdAt?: string
          id?: number
          listId: string
          productId: string
        }
        Update: {
          createdAt?: string
          id?: number
          listId?: string
          productId?: string
        }
        Relationships: [
          {
            foreignKeyName: "listItems_listId_fkey"
            columns: ["listId"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listItems_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          createdAt: string
          favorited: boolean
          id: string
          name: string
        }
        Insert: {
          createdAt?: string
          favorited?: boolean
          id?: string
          name: string
        }
        Update: {
          createdAt?: string
          favorited?: boolean
          id?: string
          name?: string
        }
        Relationships: []
      }
      orderItems: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          imageUrl: string | null
          name: string
          price: number
          productId: string
          unit: string | null
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name: string
          price: number
          productId: string
          unit?: string | null
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name?: string
          price?: number
          productId?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orderItems_productId_fkey"
            columns: ["productId"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          accountId: string
          createdAt: string
          id: string
          totalAmount: number
          totalQuantity: number
        }
        Insert: {
          accountId: string
          createdAt?: string
          id?: string
          totalAmount: number
          totalQuantity: number
        }
        Update: {
          accountId?: string
          createdAt?: string
          id?: string
          totalAmount?: number
          totalQuantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          imageUrl: string | null
          name: string
          price: number
          unit: string | null
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name: string
          price: number
          unit?: string | null
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name?: string
          price?: number
          unit?: string | null
        }
        Relationships: []
      }
      sharedLists: {
        Row: {
          accountId: string
          createdAt: string
          expirationToken: string
          id: string
          instructions: string | null
          listId: string
        }
        Insert: {
          accountId: string
          createdAt?: string
          expirationToken: string
          id?: string
          instructions?: string | null
          listId: string
        }
        Update: {
          accountId?: string
          createdAt?: string
          expirationToken?: string
          id?: string
          instructions?: string | null
          listId?: string
        }
        Relationships: [
          {
            foreignKeyName: "sharedLists_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sharedLists_listId_fkey"
            columns: ["listId"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
