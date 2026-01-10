import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Framework, FrameworkSchema } from '../types/models';
// No database import needed here if only using models
import { useAuth } from './useAuth';
import { DEFAULT_STARR_SCHEMA } from '../lib/constants';

export function useFrameworks() {
    const { user } = useAuth();
    const [frameworks, setFrameworks] = useState<Framework[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            if (loading) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLoading(false);
            }
            return;
        }

        async function fetchOrInitFrameworks() {
            if (!user) return;
            // 1. Fetch existing frameworks
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from('frameworks')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching frameworks:', error);
                setLoading(false);
                return;
            }

            // 2. Check if default templates exist and initialize if not
            let finalFrameworks = data || [];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasStarr = data?.some((f: any) => f.name.includes('STARR'));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasFree = data?.some((f: any) => f.name.includes('자유'));

            if (!hasStarr) {
                console.log('STARR framework missing. Initializing...');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: newStarr, error: createError } = await (supabase as any)
                    .from('frameworks')
                    .insert({
                        user_id: user.id,
                        name: 'STARR 회고 템플릿',
                        description: '상황(S), 과제(T), 행동(A), 결과(R), 회고(R) 순서로 경험을 구조화하여 기록합니다.',
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        schema: DEFAULT_STARR_SCHEMA as any,
                        version: 1,
                    })
                    .select()
                    .single();

                if (!createError && newStarr) {
                    finalFrameworks = [...finalFrameworks, newStarr as unknown as Framework];
                }
            }

            if (!hasFree) {
                console.log('Free template missing. Initializing...');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: newFree, error: createError } = await (supabase as any)
                    .from('frameworks')
                    .insert({
                        user_id: user.id,
                        name: '자유 기록 템플릿',
                        description: '특별한 형식 없이 자유롭게 아이의 소중한 순간을 기록합니다.',
                        schema: {
                            questions: [{
                                key: 'content',
                                label: '내용',
                                type: 'textarea',
                                required: true
                            }]
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } as any,
                        version: 1,
                    })
                    .select()
                    .single();

                if (!createError && newFree) {
                    finalFrameworks = [...finalFrameworks, newFree as unknown as Framework];
                }
            }

            setFrameworks(finalFrameworks as Framework[]);
            setLoading(false);
        }

        fetchOrInitFrameworks();
    }, [user, loading]);

    const createFramework = async (name: string, schema: FrameworkSchema) => {
        if (!user) return;
        const payload = {
            user_id: user.id,
            name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            schema: schema as any,
            version: 1,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('frameworks')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        if (data) setFrameworks(prev => [...prev, data as unknown as Framework]);
        return data;
    };

    return { frameworks, loading, createFramework };
}
