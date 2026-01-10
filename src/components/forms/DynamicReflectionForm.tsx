import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { FrameworkSchema } from '../../types/models';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface DynamicReflectionFormProps {
    schema: FrameworkSchema;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData?: any;
    onCancel?: () => void;
    isSubmitting?: boolean;
}

export const DynamicReflectionForm = ({ schema, onSubmit, initialData, onCancel, isSubmitting }: DynamicReflectionFormProps) => {
    const [formData, setFormData] = useState<Record<string, string | string[]>>(initialData || {});

    useEffect(() => {
        if (initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (id: string, value: string | number | string[]) => {
        setFormData(prev => ({ ...prev, [id]: value as string | string[] }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const questions = schema?.questions || [];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {questions.map((question: any) => (
                <div key={question.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {question.label}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {question.type === 'textarea' ? (
                        <textarea
                            className="block w-full rounded-xl border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 min-h-[120px]"
                            placeholder={question.label}
                            value={formData[question.key] || ''}
                            onChange={(e) => handleChange(question.key, e.target.value)}
                            required={question.required}
                            maxLength={question.maxLen}
                        />
                    ) : question.type === 'number' ? (
                        <input
                            type="number"
                            className="block w-full rounded-xl border-gray-300 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                            value={formData[question.key] || ''}
                            onChange={(e) => handleChange(question.key, Number(e.target.value))}
                            required={question.required}
                        />
                    ) : (
                        <Input
                            value={formData[question.key] || ''}
                            onChange={(e) => handleChange(question.key, e.target.value)}
                            required={question.required}
                            maxLength={question.maxLen}
                        />
                    )}

                    {question.type === 'textarea' && question.maxLen && (
                        <div className="text-right text-xs text-gray-400 mt-1">
                            {String(formData[question.key] || '').length} / {question.maxLen}
                        </div>
                    )}
                </div>
            ))}

            <div className="pt-4 flex gap-3">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
                        취소
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                    variant="primary"
                >
                    {isSubmitting ? '저장 중...' : '저장하기'}
                </Button>
            </div>
        </form>
    );
};
