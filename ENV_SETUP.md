# 환경 변수 설정 가이드

## Vercel 배포 시 필수 환경 변수

배포 전에 다음 환경 변수를 Vercel 대시보드에서 설정해야 합니다.

### 1. VITE_SUPABASE_URL
- **설명**: Supabase 프로젝트 URL
- **확인 방법**:
  1. [Supabase Dashboard](https://app.supabase.com) 접속
  2. 프로젝트 선택
  3. **Settings** → **API**
  4. **Project URL** 복사
- **예시**: `https://abcdefghijklmnop.supabase.co`

### 2. VITE_SUPABASE_ANON_KEY
- **설명**: Supabase 익명 키 (공개 키)
- **확인 방법**:
  1. [Supabase Dashboard](https://app.supabase.com) 접속
  2. 프로젝트 선택
  3. **Settings** → **API**
  4. **Project API keys** → **anon public** 복사
- **예시**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Vercel에서 환경 변수 설정하기

### 방법 1: 웹 대시보드
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. 각 변수 추가:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: (위에서 복사한 URL)
   - **Environment**: Production, Preview, Development 모두 선택
5. **Save** 클릭
6. 동일하게 `VITE_SUPABASE_ANON_KEY` 추가

### 방법 2: Vercel CLI
```bash
# Production 환경에 추가
vercel env add VITE_SUPABASE_URL production
# 프롬프트에 값 입력

vercel env add VITE_SUPABASE_ANON_KEY production
# 프롬프트에 값 입력

# 재배포
vercel --prod
```

---

## 로컬 개발 환경 설정

### .env 파일 생성
프로젝트 루트에 `.env` 파일 생성:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **주의**: `.env` 파일은 절대 Git에 커밋하지 마세요! (`.gitignore`에 이미 포함됨)

---

## 환경 변수 확인

### 로컬에서 확인
```bash
npm run dev
```
브라우저 콘솔에서:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
```

### Vercel에서 확인
배포 후 브라우저 개발자 도구 → Network 탭에서 Supabase API 요청 확인

---

## 문제 해결

### 문제: "Supabase configuration missing" 오류
**원인**: 환경 변수가 설정되지 않음

**해결**:
1. Vercel 대시보드에서 환경 변수 확인
2. 변수명이 정확한지 확인 (`VITE_` 접두사 필수)
3. 재배포: `vercel --prod`

### 문제: 환경 변수가 `undefined`로 표시됨
**원인**: 빌드 시 환경 변수가 주입되지 않음

**해결**:
1. Vercel에서 환경 변수 설정 후 **Redeploy** 클릭
2. 로컬에서는 개발 서버 재시작: `npm run dev`

---

## 보안 주의사항

### ✅ 안전한 키
- `VITE_SUPABASE_ANON_KEY`: 공개 키이므로 클라이언트에 노출되어도 안전
- Supabase RLS (Row Level Security)로 데이터 접근 제어

### ❌ 절대 노출 금지
- `SUPABASE_SERVICE_ROLE_KEY`: 서버 전용 키, 절대 클라이언트에 노출 금지
- 데이터베이스 비밀번호

---

## 추가 환경 변수 (선택사항)

필요에 따라 추가 가능:

```env
# Google Analytics (선택)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Sentry (에러 추적, 선택)
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# 커스텀 API URL (선택)
VITE_API_BASE_URL=https://api.valuelog.com
```

---

## 참고 자료

- [Vite 환경 변수 문서](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase API 키 관리](https://supabase.com/docs/guides/api/api-keys)
