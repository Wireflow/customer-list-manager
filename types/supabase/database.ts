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
          branchId: string
          createdAt: string
          id: string
          phoneNumber: string
        }
        Insert: {
          branchId: string
          createdAt?: string
          id?: string
          phoneNumber: string
        }
        Update: {
          branchId?: string
          createdAt?: string
          id?: string
          phoneNumber?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
        ]
      }
      branch: {
        Row: {
          createdAt: string
          id: string
          name: string
        }
        Insert: {
          createdAt?: string
          id?: string
          name: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          branchId: string
          createdAt: string
          id: string
          name: string
        }
        Insert: {
          branchId: string
          createdAt?: string
          id?: string
          name: string
        }
        Update: {
          branchId?: string
          createdAt?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
        ]
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
          branchId: string
          createdAt: string
          favorited: boolean
          id: string
          name: string
        }
        Insert: {
          branchId: string
          createdAt?: string
          favorited?: boolean
          id?: string
          name: string
        }
        Update: {
          branchId?: string
          createdAt?: string
          favorited?: boolean
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
        ]
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
          branchId: string
          createdAt: string
          id: string
          OrderNumber: number
          totalAmount: number
          totalQuantity: number
        }
        Insert: {
          accountId: string
          branchId: string
          createdAt?: string
          id?: string
          OrderNumber?: number
          totalAmount: number
          totalQuantity: number
        }
        Update: {
          accountId?: string
          branchId?: string
          createdAt?: string
          id?: string
          OrderNumber?: number
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
          {
            foreignKeyName: "orders_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          branchId: string
          categoryId: string | null
          createdAt: string
          description: string | null
          id: string
          imageUrl: string | null
          name: string
          price: number
          unit: string | null
        }
        Insert: {
          branchId: string
          categoryId?: string | null
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name: string
          price: number
          unit?: string | null
        }
        Update: {
          branchId?: string
          categoryId?: string | null
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name?: string
          price?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_categoryId_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      sharedLists: {
        Row: {
          accountId: string
          branchId: string
          createdAt: string
          expirationTime: string
          id: string
          instructions: string | null
          listId: string | null
          type: Database["public"]["Enums"]["shared_list_type"]
        }
        Insert: {
          accountId: string
          branchId: string
          createdAt?: string
          expirationTime: string
          id?: string
          instructions?: string | null
          listId?: string | null
          type?: Database["public"]["Enums"]["shared_list_type"]
        }
        Update: {
          accountId?: string
          branchId?: string
          createdAt?: string
          expirationTime?: string
          id?: string
          instructions?: string | null
          listId?: string | null
          type?: Database["public"]["Enums"]["shared_list_type"]
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
            foreignKeyName: "sharedLists_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "branch"
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
      shared_list_type: "custom" | "full"
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
