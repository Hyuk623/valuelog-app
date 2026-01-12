import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Child } from '../types/models';
import { useAuth } from './useAuth';
import { logError, getErrorMessage } from '../utils/errorUtils';

/**
 * Hook that loads the list of children for the logged‑in user and keeps track of the
 * currently selected child. It returns the list, the selected child, a setter, and
 * a loading flag.
 */
export function useCurrentChild() {
    const { user } = useAuth();
    const [children, setChildren] = useState<Child[]>([]);
    const [currentChild, setCurrentChild] = useState<Child | null>(null);
    const [loading, setLoading] = useState(true);

    const loadChildren = useCallback(async () => {
        if (!user) {
            setChildren([]);
            setCurrentChild(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('children')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });
            if (error) {
                logError(error, 'loadChildren');
                setChildren([]);
                setCurrentChild(null);
            } else {
                const list = (data as unknown as Child[]) || [];
                setChildren(list);
                // default to first child if none selected
                if (!currentChild && list.length > 0) {
                    setCurrentChild(list[0]);
                }
            }
        } catch (e) {
            logError(e as Error, 'loadChildren unexpected');
        } finally {
            setLoading(false);
        }
    }, [user, currentChild]);

    // Load children on mount / when user changes
    useEffect(() => {
        loadChildren();
    }, [loadChildren]);

    return { children, currentChild, setCurrentChild, loading };
}
