import { useState } from 'react';
import { Mail, MessageSquare, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';

export const SupportPage = () => {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            console.log('Sending inquiry:', { user_id: user.id, email: user.email, subject, message });
            const { data: insertData, error: insertError } = await supabase
                .from('support_inquiries')
                .insert([
                    {
                        user_id: user.id,
                        email: user.email || 'unknown',
                        subject,
                        message,
                        status: 'open'
                    }
                ])
                .select(); // Fetch back the inserted row

            if (insertError) {
                console.error('Supabase Insert Error:', insertError);
                throw insertError;
            }

            console.log('Insert successful, verifying:', insertData);

            if (!insertData || insertData.length === 0) {
                throw new Error('데이터가 저장된 것으로 표시되었으나, 실제 확인 결과 데이터가 비어있습니다. RLS 정책을 확인해 주세요.');
            }

            alert(`데이터가 성공적으로 서버에 기록되었습니다 (ID: ${insertData[0].id}).\n대시보드에서 새로고침을 해주세요.`);
            setIsSubmitted(true);
        } catch (err: any) {
            console.error('Support submission failed:', err);
            alert(`문의 전송에 실패했습니다: ${err.message || '알 수 없는 오류'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletionRequest = () => {
        setSubject('[계정/아이 삭제 요청]');
        setMessage(`안녕하세요, 다음 데이터를 삭제 요청합니다:
- 아이 이름: 
- 요청 사유: 

(위 내용을 채워주시면 확인 후 처리해 드리겠습니다.)`);
    };

    if (isSubmitted) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-[32px] flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">문의가 접수되었습니다</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    소중한 의견 감사드립니다.<br />
                    최대한 빨리 확인 후 답변 드리겠습니다.
                </p>
                <div className="text-[10px] text-gray-300 mb-4 font-mono">Ver: 1.0.2-diag</div>
                <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="rounded-2xl h-14 px-8"
                >
                    확인
                </Button>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-6 py-8">
            <header className="mb-10">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">고객센터</h1>
                <p className="text-gray-500 mt-2 font-medium">무엇을 도와드릴까요?</p>
            </header>

            <div className="space-y-4 mb-10">
                <Card
                    className="p-5 border-none bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer group"
                    onClick={() => setSubject('[기능 제안] ')}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-gray-900">기능 제안</div>
                            <div className="text-xs text-indigo-400 font-medium">새로운 아이디어를 들려주세요</div>
                        </div>
                    </div>
                </Card>

                <Card
                    className="p-5 border-none bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-pointer group"
                    onClick={handleDeletionRequest}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-gray-900 text-sm">계정/아이 삭제 요청</div>
                            <div className="text-[10px] text-orange-400 font-medium">민감한 정보 삭제를 요청하세요</div>
                        </div>
                    </div>
                </Card>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">문의 제목</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                        className="w-full h-14 px-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 transition-all font-medium placeholder:text-gray-300"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">문의 내용</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="내용을 입력하세요"
                        required
                        rows={6}
                        className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 transition-all font-medium placeholder:text-gray-300 resize-none"
                    />
                </div>

                <Card className="p-4 bg-gray-50/50 border-none flex gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                        보내주신 문의사항은 순차적으로 검토 후 가입하신 이메일로 답변을 남겨 드립니다.
                    </p>
                </Card>

                <Button
                    type="submit"
                    fullWidth
                    className="h-14 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100"
                    loading={isSubmitting}
                >
                    문의 보내기
                </Button>
            </form>
        </div>
    );
};
