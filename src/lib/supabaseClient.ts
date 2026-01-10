import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Supabase environment variables are missing. Please check your .env file.\n' +
        'Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY'
    );
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: new Error('Supabase configuration missing') }),
            signUp: async () => ({ error: new Error('Supabase configuration missing') }),
        },
        from: () => ({
            select: () => ({
                order: () => ({
                    eq: () => Promise.resolve({ data: [], error: null }),
                    Promise: () => Promise.resolve({ data: [], error: null }),
                }),
                eq: () => Promise.resolve({ data: [], error: null }),
                single: () => Promise.resolve({ data: null, error: null }),
            }),
            insert: () => Promise.resolve({ data: null, error: new Error('Supabase configuration missing') }),
            update: () => Promise.resolve({ data: null, error: new Error('Supabase configuration missing') }),
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
