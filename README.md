# ValueLog App (v2)

아이의 성장 경험을 기록하고 회고하는 모바일 중심 웹 애플리케이션입니다.
STARR 회고 기법을 기본 제공하며, 사용자가 자신만의 질문지를 정의할 수 있는 Custom Framework 기능을 지원합니다.

## 🚀 시작하기

### 1. 설치 및 실행
```bash
cd valuelog-app
npm install
npm run dev
```

### 2. 환경 변수 설정 (.env)
프로젝트 루트에 `.env` (또는 `.env.local`) 파일을 생성하고 Supabase 키를 입력하세요.
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 설정 (필수)
`supabase/migrations/001_init.sql` 파일의 SQL을 Supabase SQL Editor에서 실행하여 테이블과 RLS 정책을 생성해야 합니다.

## 🛠 기술 스택
- **Client**: React 18, TypeScript, Vite
- **Style**: Tailwind CSS v4, Lucide React
- **Router**: React Router DOM
- **Data**: Supabase (Postgres, Auth)
- **Charts**: Recharts

## 📂 주요 구조
- `src/components/forms/DynamicReflectionForm.tsx`: JSON 스키마 기반 동적 폼 렌더러
- `src/lib/constants.ts`: 기본 STARR 템플릿 정의
- `src/types/models.ts`: 핵심 데이터 모델 (Framework, Experience 등)
- `src/hooks/*`: Supabase 데이터 로직 분리 (useChildren, useFrameworks, useExperiences)

## ✅ 기능 목록
- [x] 이메일 로그인/회원가입
- [x] 아이 프로필 관리
- [x] 커스텀 회고 템플릿 (기본 STARR 자동 생성)
- [x] 경험 기록 (동적 질문지 반영)
- [x] 통계 차트 (예시)
