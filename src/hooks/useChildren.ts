import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Child } from '../types/models';
import { useAuth } from './useAuth';
import { logError, getErrorMessage } from '../utils/errorUtils';

export function useChildren() {
    const { user } = useAuth();
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    const fetchChildren = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data, error: supabaseError } = await supabase
                .from('children')
                .select('id, name, birth_date, created_at')
                .order('created_at', { ascending: true });

            if (supabaseError) {
                logError(supabaseError, 'fetchChildren');
                setError(getErrorMessage(supabaseError, '아이 목록을 불러오는 중 오류가 발생했습니다.'));
            } else {
                setChildren(data || []);
                hasFetched.current = true;
            }
        } catch (err) {
            logError(err, 'fetchChildren unexpected');
            setError('아이 목록을 불러오는 중 예상치 못한 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user && !hasFetched.current) {
            fetchChildren();
        } else if (!user) {
            setChildren([]);
            setLoading(false);
            hasFetched.current = false;
        }
    }, [user, fetchChildren]);

    const addChild = useCallback(async (name: string, birthDate: string | null) => {
        if (!user) throw new Error('로그인이 필요합니다.');

        const { data, error: supabaseError } = await supabase
            .from('children')
            .insert({
                user_id: user.id,
                name: name.trim(),
                birth_date: birthDate || null,
            })
            .select()
            .single();

        if (supabaseError) {
            logError(supabaseError, 'addChild');
            throw new Error(getErrorMessage(supabaseError, '아이 등록에 실패했습니다.'));
        }

        if (data) setChildren(prev => [...prev, data]);
        return data as Child;
    }, [user]);

    const updateChild = useCallback(async (id: string, name: string, birthDate: string | null) => {
        if (!user) throw new Error('로그인이 필요합니다.');

        const { data, error: supabaseError } = await supabase
            .from('children')
            .update({
                name: name.trim(),
                birth_date: birthDate || null,
            })
            .eq('id', id)
            .select()
            .single();

        if (supabaseError) {
            logError(supabaseError, 'updateChild');
            throw new Error(getErrorMessage(supabaseError, '아이 정보 수정에 실패했습니다.'));
        }

        if (data) setChildren(prev => prev.map(c => c.id === id ? data : c));
        return data as Child;
    }, [user]);

    const deleteChild = useCallback(async (id: string) => {
        if (!user) throw new Error('로그인이 필요합니다.');

        const { error: supabaseError } = await supabase
            .from('children')
            .delete()
            .eq('id', id);

        if (supabaseError) {
            logError(supabaseError, 'deleteChild');
            throw new Error(getErrorMessage(supabaseError, '아이 삭제에 실패했습니다.'));
        }

        setChildren(prev => prev.filter(c => c.id !== id));
    }, [user]);

    return {
        children,
        loading,
        error,
        addChild,
        updateChild,
        deleteChild,
        refresh: fetchChildren
    };
}
