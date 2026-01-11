import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Experience } from '../types/models';
import { useAuth } from './useAuth';
import { logError, getErrorMessage } from '../utils/errorUtils';

interface UseExperiencesOptions {
    minimal?: boolean;
    childId?: string;
}

export function useExperiences(options: UseExperiencesOptions = {}) {
    const { user } = useAuth();
    const { minimal = false, childId } = options;
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExperiences = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const selectString = minimal
                ? 'id, title, date, activity_type, child_id, image_url, tags_category, tags_competency'
                : '*';

            let query = supabase
                .from('experiences')
                .select(selectString)
                .order('date', { ascending: false });

            if (childId) {
                query = query.eq('child_id', childId);
            }

            const { data, error: supabaseError } = await query;

            if (supabaseError) {
                logError(supabaseError, 'fetchExperiences');
                setError(getErrorMessage(supabaseError, '기록을 불러오는 중 오류가 발생했습니다.'));
            } else {
                setExperiences((data as unknown as Experience[]) || []);
            }
        } catch (err) {
            logError(err, 'fetchExperiences unexpected');
            setError('기록을 불러오는 중 예상치 못한 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [user, childId, minimal]);

    useEffect(() => {
        fetchExperiences();
    }, [fetchExperiences]);

    const uploadImage = useCallback(async (file: File) => {
        if (!user) throw new Error('로그인이 필요합니다.');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('experience-images')
            .upload(fileName, file);

        if (uploadError) {
            logError(uploadError, 'uploadImage');
            throw new Error(getErrorMessage(uploadError, '이미지 업로드에 실패했습니다.'));
        }

        const { data: { publicUrl } } = supabase.storage
            .from('experience-images')
            .getPublicUrl(fileName);

        return publicUrl;
    }, [user]);

    const createExperience = useCallback(async (experience: Omit<Experience, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) throw new Error('로그인이 필요합니다.');

        const { data, error: supabaseError } = await supabase
            .from('experiences')
            .insert({
                ...experience,
                user_id: user.id
            })
            .select()
            .single();

        if (supabaseError) {
            logError(supabaseError, 'createExperience');
            throw new Error(getErrorMessage(supabaseError, '기록 저장에 실패했습니다.'));
        }

        if (data) setExperiences(prev => [data as unknown as Experience, ...prev]);
        return data as Experience;
    }, [user]);

    const getExperience = useCallback(async (id: string) => {
        const { data, error: supabaseError } = await supabase
            .from('experiences')
            .select('*')
            .eq('id', id)
            .single();

        if (supabaseError) {
            logError(supabaseError, 'getExperience');
            throw new Error(getErrorMessage(supabaseError, '기록을 찾을 수 없습니다.'));
        }
        return data as Experience;
    }, []);

    const updateExperience = useCallback(async (id: string, experience: Partial<Omit<Experience, 'id' | 'created_at' | 'user_id'>>) => {
        const { data, error: supabaseError } = await supabase
            .from('experiences')
            .update(experience)
            .eq('id', id)
            .select()
            .single();

        if (supabaseError) {
            logError(supabaseError, 'updateExperience');
            throw new Error(getErrorMessage(supabaseError, '기록 수정에 실패했습니다.'));
        }

        const updated = data as unknown as Experience;
        setExperiences(prev => prev.map(exp => exp.id === id ? updated : exp));
        return updated;
    }, []);

    const deleteExperience = useCallback(async (id: string) => {
        const { error: supabaseError } = await supabase
            .from('experiences')
            .delete()
            .eq('id', id);

        if (supabaseError) {
            logError(supabaseError, 'deleteExperience');
            throw new Error(getErrorMessage(supabaseError, '기록 삭제에 실패했습니다.'));
        }

        setExperiences(prev => prev.filter(exp => exp.id !== id));
    }, []);

    const competencyHistory = useMemo(() => {
        const tags = new Set<string>();
        experiences.forEach(exp => {
            exp.tags_competency?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [experiences]);

    const categoryHistory = useMemo(() => {
        const tags = new Set<string>();
        experiences.forEach(exp => {
            exp.tags_category?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [experiences]);

    const activityTypes = useMemo(() => {
        const types = experiences
            .map(e => e.activity_type)
            .filter((t): t is string => !!t);
        return Array.from(new Set(types));
    }, [experiences]);

    return {
        experiences,
        loading,
        error,
        uploadImage,
        createExperience,
        updateExperience,
        getExperience,
        refresh: fetchExperiences,
        competencyHistory,
        categoryHistory,
        activityTypes,
        deleteExperience
    };
}
