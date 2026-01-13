import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Framework, FrameworkSchema } from '../types/models';
import { useAuth } from './useAuth';
import { SYSTEM_TEMPLATES } from '../config/systemTemplates';

export function useFrameworks() {
    const { user } = useAuth();
    const [frameworks, setFrameworks] = useState<Framework[]>([]);
    const [loading, setLoading] = useState(true);

    const createFramework = async (name: string, schema: FrameworkSchema) => {
        if (!user) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('frameworks')
            .insert([{
                user_id: user.id,
                name,
                schema,
                version: 1,
                is_public: false
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating framework:', error);
            throw error;
        }
        setFrameworks(prev => [...prev, data]);
        return data;
    };

    /**
     * Initializes a System Template into the User's Database
     */
    const initSystemTemplate = async (systemId: string) => {
        const template = SYSTEM_TEMPLATES.find(t => t.id === systemId);
        if (!template) throw new Error('System template not found');
        return createFramework(template.name, template.schema);
    };

    useEffect(() => {
        let mounted = true;

        async function fetchFrameworks() {
            if (!user) {
                if (mounted) setLoading(false);
                return;
            }

            try {
                // 1. Fetch frameworks from DB
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data, error } = await (supabase as any)
                    .from('frameworks')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Error fetching frameworks:', error);
                }

                const dbFrameworks: Framework[] = data || [];

                // 2. Merge with System Templates
                // Identify which system templates are MISSING from the DB list (by name matching)
                const missingSystemTemplates = SYSTEM_TEMPLATES.filter(sysTmpl =>
                    !dbFrameworks.some(dbFw => dbFw.name === sysTmpl.name)
                );

                // 3. Create "Virtual" Framework objects
                // These acts as placeholders that users can click to instantiate
                const virtualFrameworks: Framework[] = missingSystemTemplates.map(sysTmpl => ({
                    id: `virtual-${sysTmpl.id}`, // Virtual ID to trigger init logic
                    user_id: 'system',
                    name: sysTmpl.name,
                    description: sysTmpl.description,
                    schema: sysTmpl.schema,
                    version: sysTmpl.version,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any));

                if (mounted) {
                    setFrameworks([...dbFrameworks, ...virtualFrameworks]);
                }
            } catch (err) {
                console.error('Framework fetch error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchFrameworks();

        return () => { mounted = false; };
    }, [user]);

    return {
        frameworks,
        loading,
        createFramework,
        initSystemTemplate
    };
}
