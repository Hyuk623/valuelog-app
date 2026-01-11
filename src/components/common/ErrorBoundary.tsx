import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
// import { AlertCircle, RefreshCcw, Settings } from 'lucide-react';
const AlertCircle = () => null;
const RefreshCcw = () => null;
const Settings = () => null;
import { Button } from '../ui/Button';
import { IS_SUPABASE_CONFIGURED } from '../../lib/supabaseClient';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public override state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ValueLog Runtime Error]:', error, errorInfo);
    }

    private handleReset = () => {
        window.location.href = '/';
    };

    public override render() {
        if (!IS_SUPABASE_CONFIGURED) {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-[32px] flex items-center justify-center mb-6">
                        <Settings className="w-10 h-10 text-orange-500" />
                    </div>
                    <h1 className="text-xl font-black text-gray-900 mb-2">환경 설정 오류</h1>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed px-4">
                        서비스 연결 설정(Supabase)이 누락되었습니다.<br />
                        관리자에게 문의하거나 .env 설정을 확인해 주세요.
                    </p>
                    <div className="p-4 bg-white rounded-2xl border border-orange-100 text-[10px] text-orange-400 font-mono mb-8">
                        VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY IS MISSING
                    </div>
                </div>
            );
        }

        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-[32px] flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-xl font-black text-gray-900 mb-2">예상치 못한 오류가 발생했습니다</h1>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        일시적인 오류일 수 있습니다.<br />
                        페이지를 새로고침하거나 다시 시도해 주세요.
                    </p>
                    <Button
                        onClick={this.handleReset}
                        className="rounded-2xl h-14 px-8 shadow-lg shadow-indigo-100 font-black gap-2"
                    >
                        <RefreshCcw className="w-5 h-5" /> 메인으로 돌아가기
                    </Button>

                    <details className="mt-12 text-left">
                        <summary className="text-[10px] text-gray-300 cursor-pointer text-center">에러 상세 정보 확인</summary>
                        <pre className="mt-4 p-4 bg-white rounded-xl text-[10px] text-red-400 overflow-auto max-w-xs mx-auto">
                            {this.state.error?.toString()}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
