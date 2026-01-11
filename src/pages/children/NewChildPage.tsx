import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildren } from '../../hooks/useChildren';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const NewChildPage = () => {
    const navigate = useNavigate();
    const { addChild } = useChildren();

    // Form State
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const nameInputRef = useRef<HTMLInputElement>(null);
    const birthDateInputRef = useRef<HTMLInputElement>(null);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Name validation: 1-20 characters
        if (!name.trim()) {
            newErrors.name = '아이 이름을 입력해 주세요.';
        } else if (name.trim().length > 20) {
            newErrors.name = '이름은 최대 20자까지 입력 가능합니다.';
        }

        // Birth year validation: 1995-2025
        if (birthDate) {
            const year = new Date(birthDate).getFullYear();
            if (year < 1995 || year > 2025) {
                newErrors.birthDate = '출생연도는 1995년부터 2025년 사이여야 합니다.';
            }
        }

        setErrors(newErrors);

        // Scroll to first error
        if (newErrors.name) {
            nameInputRef.current?.focus();
            nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (newErrors.birthDate) {
            birthDateInputRef.current?.focus();
            birthDateInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent double submission

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await addChild(name, birthDate || null);
            navigate('/children');
        } catch (err: any) {
            setErrors({ submit: err.message || '아동 등록에 실패했습니다. 다시 시도해 주세요.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 space-y-4 max-w-[420px] mx-auto min-h-screen bg-gray-50 flex flex-col">
            <header className="flex items-center gap-2 mb-6 pt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black text-gray-900">새 아이 등록</h1>
            </header>

            <Card padding className="shadow-sm border-gray-100/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.submit}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Input
                            ref={nameInputRef}
                            label="이름 (필수)"
                            placeholder="아이 이름 또는 닉네임 (최대 20자)"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                            }}
                            required
                            autoFocus
                            className={`bg-white border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 transition-all ${errors.name ? 'border-red-300 ring-2 ring-red-50' : ''}`}
                        />
                        {errors.name && (
                            <p className="text-[11px] text-red-500 font-bold ml-1 animate-in fade-in">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Input
                            ref={birthDateInputRef}
                            label="생년월일 (선택)"
                            type="date"
                            value={birthDate}
                            onChange={(e) => {
                                setBirthDate(e.target.value);
                                if (errors.birthDate) setErrors(prev => ({ ...prev, birthDate: '' }));
                            }}
                            className={`bg-white border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-50 transition-all ${errors.birthDate ? 'border-red-300 ring-2 ring-red-50' : ''}`}
                        />
                        {errors.birthDate && (
                            <p className="text-[11px] text-red-500 font-bold ml-1 animate-in fade-in">
                                {errors.birthDate}
                            </p>
                        )}
                        <p className="text-[10px] text-gray-400 ml-1 font-medium italic">
                            * 1995년 ~ 2025년 사이의 날짜를 선택해 주세요.
                        </p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-12 rounded-2xl font-bold border-gray-100"
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-12 rounded-2xl shadow-lg shadow-indigo-100 font-black"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '등록 중...' : '등록하기'}
                        </Button>
                    </div>
                </form>
            </Card>

            <footer className="mt-auto py-8 text-center">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    ValueLog Security Hardened
                </p>
            </footer>
        </div>
    );
};
