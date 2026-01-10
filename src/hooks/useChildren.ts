import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Child } from '../types/models';
import { useAuth } from './useAuth';

export function useChildren() {
    const { user } = useAuth();
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            if (loading) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLoading(false);
            }
            return;
        }

        async function fetchChildren() {
            const { data, error } = await supabase
                .from('children')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error(error);
            } else {
                setChildren(data || []);
            }
            setLoading(false);
        }

        fetchChildren();
    }, [user, loading]);

    const addChild = async (name: string, birthDate: string | null) => {
        if (!user) {
            console.error('User not authenticated');
            throw new Error('로그인이 필요합니다.');
        }

        console.log('Adding child:', { name, birthDate, userId: user.id });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('children')
            .insert({
                user_id: user.id,
                name: name,
                birth_date: birthDate || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error adding child:', error);
            throw error;
        }

        console.log('Child added successfully:', data);
        if (data) setChildren(prev => [...prev, data]);
        return data;
    };

    return { children, loading, addChild };
}
