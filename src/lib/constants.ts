import type { FrameworkSchema } from '../types/models';

export const DEFAULT_STARR_SCHEMA: FrameworkSchema = {
    questions: [
        {
            key: 'S',
            label: 'S - 어떤 상황이었나요?',
            type: 'textarea',
            required: true,
            maxLen: 500,
        },
        {
            key: 'T',
            label: 'T - 어떤 목표나 과제가 있었나요?',
            type: 'textarea',
            required: true,
            maxLen: 500,
        },
        {
            key: 'A',
            label: 'A - 아이가 구체적으로 어떤 행동을 했나요?',
            type: 'textarea',
            required: true,
            maxLen: 1000,
        },
        {
            key: 'R',
            label: 'R - 결과는 어땠나요?',
            type: 'textarea',
            required: true,
            maxLen: 500,
        },
        {
            key: 'R2',
            label: 'R2 - 아이가 느낀 점이나 배운 점은 무엇인가요?',
            type: 'textarea',
            required: false,
            maxLen: 500,
        },
    ],
};
