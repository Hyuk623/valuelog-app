import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChildren } from '../../hooks/useChildren';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, AlertCircle, Save } from 'lucide-react';

export const EditChildPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { children, updateChild, loading: childrenLoading } = useChildren();

    // Form State
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Validation State
    const [errors, setErrors] = useState<Record<string, string>>({});
    const nameInputRef = useRef<HTMLInputElement>(null);
    const birthDateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!childrenLoading && children.length > 0) {
            const child = children.find(c => c.id === id);
            if (child) {
                setName(child.name);
                setBirthDate(child.birth_date || '');
                setInitialLoading(false);
            } else {
                navigate('/children');
            }
        }
    }, [children, childrenLoading, id, navigate]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = '아이 이름을 입력해 주세요.';
        } else if (name.trim().length > 20) {
            newErrors.name = '이름은 최대 20자까지 입력 가능합니다.';
        }

        if (birthDate) {
            const year = new Date(birthDate).getFullYear();
            if (year > 2025) {
                newErrors.birthDate = '출생연도는 2025년까지 선택 가능합니다.';
            }
        }

        setErrors(newErrors);

        if (newErrors.name) {
            nameInputRef.current?.focus();
        } else if (newErrors.birthDate) {
            birthDateInputRef.current?.focus();
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !id) return;

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await updateChild(id, name, birthDate || null);
            navigate('/children');
        } catch (err: any) {
            setErrors({ submit: err.message || '정보 수정에 실패했습니다.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (initialLoading || childrenLoading) {
        return <div className="p-8 text-center text-gray-500 font-bold">정보를 불러오는 중...</div>;
    }

    return (
        <div className="p-4 space-y-4 max-w-[420px] mx-auto min-h-screen bg-gray-50 flex flex-col">
            <header className="flex items-center gap-2 mb-6 pt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black text-gray-900">아이 정보 수정</h1>
            </header>

            <Card padding className="shadow-sm border-gray-100/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold">
                            <AlertCircle className="w-4 h-4" />
                            {errors.submit}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Input
                            ref={nameInputRef}
                            label="이름 (필수)"
                            placeholder="아이 이름 또는 닉네임"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={`bg-white border-gray-100 rounded-2xl p-4 transition-all ${errors.name ? 'border-red-300 ring-2 ring-red-50' : ''}`}
                        />
                        {errors.name && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Input
                            ref={birthDateInputRef}
                            label="생년월일 (선택)"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className={`bg-white border-gray-100 rounded-2xl p-4 transition-all ${errors.birthDate ? 'border-red-300 ring-2 ring-red-50' : ''}`}
                        />
                        {errors.birthDate && <p className="text-[11px] text-red-500 font-bold ml-1">{errors.birthDate}</p>}
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
                            className="flex-1 h-12 rounded-2xl shadow-lg shadow-indigo-100 font-black gap-2"
                            disabled={isSubmitting}
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting ? '저장 중...' : '완료'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
