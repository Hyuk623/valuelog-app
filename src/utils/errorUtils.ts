export const logError = (error: any, context: string) => {
    console.error(`[ValueLog Error] ${context}:`, error);

    // In a real production app, you might send this to Sentry or a logging service.
    if (error.code === 'PGRST116') {
        console.warn('Record not found (PGRST116)');
        return;
    }

    if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        return '네트워크 상태를 확인해 주세요. 인터넷 연결이 불안정할 수 있습니다.';
    }

    return null;
};

// Simple toast-like interface for the user messages
export const getErrorMessage = (error: any, fallback: string): string => {
    if (!error) return fallback;

    if (error.message?.includes('network') || error.code === 'ECONNREFUSED') {
        return '인터넷 연결이 불안정합니다. 네트워크 상태를 확인하고 다시 시도해 주세요.';
    }

    if (error.code === '42P01') {
        return '서버 데이터베이스 설정 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }

    if (error.message?.includes('JWT')) {
        return '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.';
    }

    return error.message || fallback;
};
