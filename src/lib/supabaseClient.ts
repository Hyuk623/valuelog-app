import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Pilot Hardening: Explicit Multi-Env Check
const isConfigMissing = !supabaseUrl || !supabaseAnonKey;

if (isConfigMissing) {
    const missing = [];
    if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');

    console.error(
        `[ValueLog Critical] Missing Supabase environment variables: ${missing.join(', ')}.\n` +
        'Please check your .env file or deployment settings.'
    );
}

// Export a constant to be used by ErrorBoundary for specific UI
export const IS_SUPABASE_CONFIGURED = !isConfigMissing;

export const supabase = IS_SUPABASE_CONFIGURED
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: async () => ({ error: new Error('Supabase configuration missing') }),
            signUp: async () => ({ error: new Error('Supabase configuration missing') }),
            signInWithOAuth: async () => ({ error: new Error('Supabase configuration missing') }),
        },
        from: () => ({
            select: () => ({
                order: () => ({
                    eq: () => Promise.resolve({ data: [], error: new Error('Configuration Missing') }),
                    Promise: () => Promise.resolve({ data: [], error: new Error('Configuration Missing') }),
                }),
                eq: () => Promise.resolve({ data: [], error: new Error('Configuration Missing') }),
                single: () => Promise.resolve({ data: null, error: new Error('Configuration Missing') }),
            }),
            insert: () => Promise.resolve({ data: null, error: new Error('Configuration Missing') }),
            update: () => Promise.resolve({ data: null, error: new Error('Configuration Missing') }),
            delete: () => Promise.resolve({ error: new Error('Configuration Missing') }),
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ data: null, error: new Error('Configuration Missing') }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            })
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
