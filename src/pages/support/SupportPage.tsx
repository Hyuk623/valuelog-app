import { useState } from 'react';
import { Mail, MessageSquare, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const SupportPage = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send an email or store in a DB
        console.log('Support Request:', { subject, message });
        setIsSubmitted(true);
    };

    const handleDeletionRequest = () => {
        setSubject('아이 프로필 삭제 요청');
        setMessage('안녕하세요, 관리자님.\n\n[아이 이름 입력]의 프로필 및 모든 관련 기록의 삭제를 요청합니다.\n사유: ');
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">문의가 접수되었습니다</h2>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    회신은 영업일 기준 1~3일 내에<br />
                    가입하신 이메일로 보내드립니다.
                </p>
                <Button onClick={() => setIsSubmitted(false)} className="rounded-2xl px-8 h-12 shadow-lg shadow-emerald-50">
                    추가 문의하기
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in">
            <header>
                <h1 className="text-2xl font-black text-gray-900">고객센터</h1>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black opacity-50">Support & Feedback</p>
            </header>

            <section className="space-y-4">
                <div className="flex bg-indigo-50/50 p-4 rounded-3xl border border-indigo-50 gap-3">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-gray-800">공식 문의 이메일</h3>
                        <p className="text-[11px] text-indigo-600 font-bold select-all">valuelog.biz@gmail.com</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Card padding className="bg-white border-gray-50 shadow-sm flex flex-col items-center text-center gap-2 group hover:border-indigo-100 transition-colors cursor-pointer" onClick={() => { setSubject('기능 제안'); setMessage('기능 제안 내용: '); }}>
                        <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-gray-600">기능 제안</span>
                    </Card>
                    <Card padding className="bg-white border-gray-50 shadow-sm flex flex-col items-center text-center gap-2 group hover:border-red-100 transition-colors cursor-pointer" onClick={handleDeletionRequest}>
                        <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-gray-600">삭제 요청</span>
                    </Card>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="w-1 h-3 bg-indigo-600 rounded-full" />
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">1:1 문의하기</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Card padding className="border-gray-100 space-y-4 shadow-sm">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase">문의 제목</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="제목을 입력해 주세요"
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-1.5 ml-1 uppercase">문의 내용</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="궁금하신 점이나 요청사항을 상세히 적어주세요."
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all min-h-[160px] resize-none"
                                required
                            />
                        </div>
                    </Card>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                            삭제 요청 시 해당 아이의 이름과 삭제 사유를 적어주시면<br />
                            본인 확인 절차 후 처리가 진행됩니다.
                        </p>
                    </div>

                    <Button type="submit" fullWidth className="h-14 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100">
                        문의 보내기
                    </Button>
                </form>
            </section>
        </div>
    );
};
