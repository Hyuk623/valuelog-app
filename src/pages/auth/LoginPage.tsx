import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
                errorText = `${provider === 'google' ? 'Google' : 'Kakao'} 로그인이 아직 활성화되지 않았습니다. Supabase 대시보드에서 설정을 확인해 주세요.`;
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
                                    onClick={() => handleSocialLogin('kakao')}
                                    className="bg-[#FEE500] border-none text-[#191919] hover:bg-[#FADA0A] h-12 text-base font-bold"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 3C6.47715 3 2 6.47715 2 10.75C2 12.8164 2.92842 14.671 4.43675 16.0374C4.1627 17.5147 3.49122 19.3402 3.40742 19.5694C3.32362 19.7986 3.53508 19.8516 3.66571 19.7891C4.85328 19.2155 7.15197 17.6534 8.07727 17.0264L8.07727 17.0263C9.30396 17.558 10.619 17.8571 12 17.8571C17.5228 17.8571 22 14.3799 22 10.1071C22 5.83437 17.5228 2.35714 12 2.35714L12 3Z" />
                                    </svg>
                                    카카오로 3초만에 시작하기
                                </Button>
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
                        계속 진행함으로써 ValueLog의 <span className="underline cursor-pointer">이용약관</span> 및 <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
                    </p>
                </div>
            </Card>
        </div>
    );
};
