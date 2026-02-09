import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }, error }: { data: { session: Session | null }, error: any }) => {
            if (error) {
                console.error('[ValueLog Auth] Session check failed:', error);
            }
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch((err: any) => {
            console.error('[ValueLog Auth] Unexpected session error:', err);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return {
        session,
        user,
        loading,
    };
}
