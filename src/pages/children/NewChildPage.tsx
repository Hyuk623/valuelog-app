import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildren } from '../../hooks/useChildren';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export const NewChildPage = () => {
    const navigate = useNavigate();
    const { addChild } = useChildren();
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await addChild(name, birthDate || null);
            navigate('/children');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            alert(err.message || '아동 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <header className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate(-1)} className="p-1 text-gray-500">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">새 아이 등록</h1>
            </header>

            <Card padding>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="이름 (필수)"
                        placeholder="아이 이름 또는 닉네임"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                    />
                    <Input
                        label="생년월일 (선택)"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => navigate(-1)}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '등록 중...' : '등록하기'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
