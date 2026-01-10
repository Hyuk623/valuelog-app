import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Experience } from '../types/models';
// No database import needed here if only using models
import { useAuth } from './useAuth';

export function useExperiences(childId?: string) {
    const { user } = useAuth();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExperiences = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        let query = supabase
            .from('experiences')
            .select('*')
            .order('date', { ascending: false });

        if (childId) {
            query = query.eq('child_id', childId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching experiences:', error);
        } else {
            setExperiences((data as unknown as Experience[]) || []);
        }
        setLoading(false);
    }, [user, childId]);

    useEffect(() => {
        if (!user) {
            if (loading) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLoading(false);
            }
            return;
        }
        fetchExperiences();
    }, [fetchExperiences, user, loading]);

    const uploadImage = useCallback(async (file: File) => {
        if (!user) throw new Error('No user logged in');

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
            .from('experience-images')
            .upload(filePath, file);

        if (uploadError) {
            if (uploadError.message.includes('Bucket not found')) {
                throw new Error('Supabase Storage에 "experience-images" 공개(Public) 버킷이 필요합니다. 제공된 SQL 스크립트를 실행해 주세요.');
            }
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('experience-images')
            .getPublicUrl(filePath);

        return publicUrl;
    }, [user]);

    const createExperience = useCallback(async (experience: Omit<Experience, 'id' | 'created_at' | 'user_id'>) => {
        if (!user) throw new Error('No user logged in');

        // Ensure responses is treated as JSON object
        const payload = {
            ...experience,
            user_id: user.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            responses: experience.responses as any,
        } as any;

        const { data, error } = await supabase
            .from('experiences')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        if (data) setExperiences(prev => [data as unknown as Experience, ...prev]);
        return data;
    }, [user]);

    const getExperience = useCallback(async (id: string) => {
        const { data, error } = await supabase
            .from('experiences')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Experience;
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

    const updateExperience = useCallback(async (id: string, experience: Partial<Omit<Experience, 'id' | 'created_at' | 'user_id'>>) => {
        if (!user) throw new Error('No user logged in');

        const { data, error } = await supabase
            .from('experiences')
            .update(experience)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        setExperiences(prev => prev.map(exp => exp.id === id ? (data as unknown as Experience) : exp));
        return data;
    }, [user]);

    const deleteExperience = useCallback(async (id: string) => {
        if (!user) throw new Error('No user logged in');

        const { error } = await supabase
            .from('experiences')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setExperiences(prev => prev.filter(exp => exp.id !== id));
    }, [user]);

    return {
        experiences,
        activityTypes,
        loading,
        uploadImage,
        createExperience,
        updateExperience,
        deleteExperience,
        getExperience,
        refresh: fetchExperiences,
        competencyHistory,
        categoryHistory
    };
}
