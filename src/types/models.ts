export type QuestionType = 'textarea' | 'text' | 'number';

export interface Question {
    key: string;
    label: string;
    type: QuestionType;
    required: boolean;
    maxLen?: number;
}

export interface FrameworkSchema {
    description?: string;
    questions: Question[];
}

export interface Framework {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    version: number;
    schema: FrameworkSchema;
    created_at: string;
}

export interface Child {
    id: string;
    user_id: string;
    name: string;
    birth_date: string | null;
    created_at: string;
}

export interface Experience {
    id: string;
    user_id: string;
    child_id: string;
    title: string;
    date: string | null;
    activity_type: string | null;
    location: string | null;
    framework_id: string | null;
    framework_version: number | null;
    // Strict typing for responses, compatible with Json
    responses: Record<string, string | number | null>;
    tags_category: string[] | null;
    tags_competency: string[] | null;
    satisfaction_score: number | null;
    image_url: string | null;
    created_at: string;
}
