import { DEFAULT_STARR_SCHEMA } from '../lib/constants';

// System Framework Interface
export interface SystemFramework {
    id: string; // Used as a key to identify this system template
    name: string;
    description: string;
    schema: typeof DEFAULT_STARR_SCHEMA;
    version: number;
}

export const SYSTEM_TEMPLATES: SystemFramework[] = [
    {
        id: 'system-starr', // Internal ID for logic
        name: 'STARR 회고 템플릿',
        description: '표준 질문으로 구성된 성찰 템플릿',
        schema: DEFAULT_STARR_SCHEMA,
        version: 1
    },
    // Future templates (e.g., Free Writing) can be added here
];
