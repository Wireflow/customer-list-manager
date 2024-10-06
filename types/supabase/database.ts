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
          name: string | null
          notify_new_orders: boolean
          notify_phoneNumber: string | null
          opted: boolean
          optedAt: string | null
          phoneNumber: string
        }
        Insert: {
          branchId: string
          createdAt?: string
          id?: string
          name?: string | null
          notify_new_orders?: boolean
          notify_phoneNumber?: string | null
          opted?: boolean
          optedAt?: string | null
          phoneNumber: string
        }
        Update: {
          branchId?: string
          createdAt?: string
          id?: string
          name?: string | null
          notify_new_orders?: boolean
          notify_phoneNumber?: string | null
          opted?: boolean
          optedAt?: string | null
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
          listValidTime: number
          name: string
        }
        Insert: {
          createdAt?: string
          id?: string
          listValidTime?: number
          name: string
        }
        Update: {
          createdAt?: string
          id?: string
          listValidTime?: number
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
      group_account_assignments: {
        Row: {
          accountId: string
          assignedAt: string
          groupId: string
          id: string
        }
        Insert: {
          accountId: string
          assignedAt?: string
          groupId: string
          id?: string
        }
        Update: {
          accountId?: string
          assignedAt?: string
          groupId?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_account_assignments_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_account_assignments_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "notified_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_account_assignments_groupId_fkey"
            columns: ["groupId"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          branchId: string
          createdAt: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          branchId: string
          createdAt?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          branchId?: string
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_branchId_fkey"
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
          orderId: string
          price: number
          productId: string
          quantity: number
          unit: string | null
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name: string
          orderId: string
          price: number
          productId: string
          quantity: number
          unit?: string | null
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name?: string
          orderId?: string
          price?: number
          productId?: string
          quantity?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orderItems_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
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
          orderNumber: number
          paymentId: number | null
          sharedListId: string | null
          status: Database["public"]["Enums"]["order_status"]
          totalAmount: number
          totalQuantity: number
        }
        Insert: {
          accountId: string
          branchId: string
          createdAt?: string
          id?: string
          orderNumber?: number
          paymentId?: number | null
          sharedListId?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          totalAmount: number
          totalQuantity: number
        }
        Update: {
          accountId?: string
          branchId?: string
          createdAt?: string
          id?: string
          orderNumber?: number
          paymentId?: number | null
          sharedListId?: string | null
          status?: Database["public"]["Enums"]["order_status"]
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
            foreignKeyName: "orders_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "notified_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_branchId_fkey"
            columns: ["branchId"]
            isOneToOne: false
            referencedRelation: "branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_paymentId_fkey"
            columns: ["paymentId"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_sharedListId_fkey"
            columns: ["sharedListId"]
            isOneToOne: false
            referencedRelation: "sharedLists"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          checkAmount: number | null
          checkNumber: string | null
          createdAt: string
          customMethod: string | null
          id: number
          method: Database["public"]["Enums"]["payment_method"]
          orderId: string
        }
        Insert: {
          amount: number
          checkAmount?: number | null
          checkNumber?: string | null
          createdAt?: string
          customMethod?: string | null
          id?: number
          method: Database["public"]["Enums"]["payment_method"]
          orderId: string
        }
        Update: {
          amount?: number
          checkAmount?: number | null
          checkNumber?: string | null
          createdAt?: string
          customMethod?: string | null
          id?: number
          method?: Database["public"]["Enums"]["payment_method"]
          orderId?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_orderId_fkey"
            columns: ["orderId"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          branchId: string
          categoryId: string | null
          costPrice: number | null
          createdAt: string
          description: string | null
          id: string
          imageUrl: string | null
          name: string
          price: number
          quantityInStock: number
          unit: string | null
        }
        Insert: {
          branchId: string
          categoryId?: string | null
          costPrice?: number | null
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name: string
          price: number
          quantityInStock?: number
          unit?: string | null
        }
        Update: {
          branchId?: string
          categoryId?: string | null
          costPrice?: number | null
          createdAt?: string
          description?: string | null
          id?: string
          imageUrl?: string | null
          name?: string
          price?: number
          quantityInStock?: number
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
          forceExpire: boolean
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
          forceExpire?: boolean
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
          forceExpire?: boolean
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
            foreignKeyName: "sharedLists_accountId_fkey"
            columns: ["accountId"]
            isOneToOne: false
            referencedRelation: "notified_accounts"
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
      notified_accounts: {
        Row: {
          branchId: string | null
          createdAt: string | null
          id: string | null
          notify_new_orders: boolean | null
          notify_phoneNumber: string | null
        }
        Insert: {
          branchId?: string | null
          createdAt?: string | null
          id?: string | null
          notify_new_orders?: boolean | null
          notify_phoneNumber?: string | null
        }
        Update: {
          branchId?: string | null
          createdAt?: string | null
          id?: string | null
          notify_new_orders?: boolean | null
          notify_phoneNumber?: string | null
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
    }
    Functions: {
      create_order: {
        Args: {
          order_data: Json
        }
        Returns: Json
      }
      force_shared_list_expire: {
        Args: {
          list_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      order_status: "completed" | "voided" | "refunded" | "pending"
      payment_method:
        | "check"
        | "card"
        | "cash"
        | "hold"
        | "zelle"
        | "wire"
        | "custom"
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
