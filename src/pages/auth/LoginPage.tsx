import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '../../constants/legalDocuments';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            navigate('/children');
        }
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({
                type: 'success',
                text: '회원가입 요청이 완료되었습니다! 입력하신 이메일함에서 인증 메일을 확인해 주세요.'
            });
            setIsSignUp(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'kakao') => {
        setMessage(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/children`,
            },
        });

        if (error) {
            let errorText = error.message;
            if (errorText.includes('provider is not enabled')) {
                errorText = `Google 로그인이 아직 활성화되지 않았습니다. 프로젝트 폴더의 'AUTH_SOCIAL_SETUP.md' 파일을 참고하여 Supabase 설정을 완료해 주세요.`;
            }
            setMessage({ type: 'error', text: errorText });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
            <Card className="w-full max-w-sm overflow-hidden" padding={false}>
                {/* Header Section */}
                <div className="bg-indigo-600 p-8 text-center text-white">
                    <h1 className="text-3xl font-black tracking-tight mb-2">ValueLog</h1>
                    <p className="text-indigo-100 text-sm opacity-90">
                        우리 아이의 소중한 경험 자산
                    </p>
                </div>

                <div className="p-6">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => { setIsSignUp(false); setMessage(null); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSignUp ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => { setIsSignUp(true); setMessage(null); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSignUp ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            회원가입
                        </button>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Social Buttons - Prominent as "Fast Sign-up" */}
                        <div className="space-y-3">
                            <h2 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {isSignUp ? '간편 회원가입' : '간편 로그인'}
                            </h2>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => handleSocialLogin('google')}
                                    className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 h-12 text-base font-bold shadow-sm"
                                >
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
                                    Google로 시작하기
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-tighter">
                                <span className="bg-white px-4 text-gray-300">또는 이메일로 {isSignUp ? '가입' : '로그인'}</span>
                            </div>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                            <Input
                                label="이메일"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="example@email.com"
                                className="bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
                            <Input
                                label="비밀번호"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="6자리 이상"
                                minLength={6}
                                className="bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                disabled={loading}
                                className="h-12 text-lg font-bold bg-gray-900 hover:bg-black mt-2"
                            >
                                {loading ? '처리 중...' : isSignUp ? '회원가입 완료' : '로그인'}
                            </Button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-[11px] text-gray-400 px-4 leading-relaxed">
                        계속 진행함으로써 ValueLog의 <span onClick={() => setShowTerms(true)} className="underline cursor-pointer hover:text-gray-600 transition-colors">이용약관</span> 및 <span onClick={() => setShowPrivacy(true)} className="underline cursor-pointer hover:text-gray-600 transition-colors">개인정보처리방침</span>에 동의하게 됩니다.
                    </p>
                </div>
            </Card>

            {/* Legal Modals */}
            <Modal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                title="이용약관"
            >
                <div className="space-y-4 whitespace-pre-wrap">
                    {TERMS_OF_SERVICE}
                </div>
            </Modal>

            <Modal
                isOpen={showPrivacy}
                onClose={() => setShowPrivacy(false)}
                title="개인정보처리방침"
            >
                <div className="space-y-4 whitespace-pre-wrap">
                    {PRIVACY_POLICY}
                </div>
            </Modal>
        </div>
    );
};
