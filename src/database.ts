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
            frameworks: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    version: number
                    schema: Json
                    description?: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    version?: number
                    schema: Json
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    version?: number
                    schema?: Json
                    description?: string | null
                    created_at?: string
                }
            }
            children: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    birth_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    name: string
                    birth_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    birth_date?: string | null
                    created_at?: string
                }
            }
            experiences: {
                Row: {
                    id: string
                    user_id: string
                    child_id: string
                    title: string
                    date: string | null
                    activity_type: string | null
                    location: string | null
                    framework_id: string | null
                    framework_version: number | null
                    responses: Json
                    tags_category: string[] | null
                    tags_competency: string[] | null
                    satisfaction_score: number | null
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string
                    child_id: string
                    title: string
                    date?: string | null
                    activity_type?: string | null
                    location?: string | null
                    framework_id?: string | null
                    framework_version?: number | null
                    responses?: Json
                    tags_category?: string[] | null
                    tags_competency?: string[] | null
                    satisfaction_score?: number | null
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    child_id?: string
                    title?: string
                    date?: string | null
                    activity_type?: string | null
                    location?: string | null
                    framework_id?: string | null
                    framework_version?: number | null
                    responses?: Json
                    tags_category?: string[] | null
                    tags_competency?: string[] | null
                    satisfaction_score?: number | null
                    image_url?: string | null
                    created_at?: string
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
