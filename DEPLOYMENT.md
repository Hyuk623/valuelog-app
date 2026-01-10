# ValueLog 배포 가이드 (Vercel)

## 📦 배포 준비

### 1. 사전 요구사항
- [Vercel 계정](https://vercel.com) 생성 (GitHub 계정으로 로그인 권장)
- Supabase 프로젝트 URL 및 Anon Key 확인
- Git 저장소 (GitHub, GitLab, Bitbucket)

---

## 🚀 배포 방법

### 옵션 1: Vercel 웹사이트에서 배포 (추천)

#### Step 1: GitHub에 코드 푸시
```bash
# 프로젝트 루트에서
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/your-username/valuelog-app.git
git push -u origin main
```

#### Step 2: Vercel에서 Import
1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. **"Add New..." → "Project"** 클릭
3. GitHub 저장소 연결 및 `valuelog-app` 선택
4. **Framework Preset**: Vite 자동 감지됨
5. **Environment Variables** 설정:
   ```
   VITE_SUPABASE_URL = your-supabase-project-url
   VITE_SUPABASE_ANON_KEY = your-supabase-anon-key
   ```
6. **Deploy** 클릭

#### Step 3: 배포 완료
- 배포 완료 후 `https://valuelog-app-xxxxx.vercel.app` 형태의 URL 생성
- 이후 `main` 브랜치에 푸시할 때마다 자동 배포됨

---

### 옵션 2: Vercel CLI로 배포

#### Step 1: Vercel CLI 설치
```bash
npm install -g vercel
```

#### Step 2: 로그인 및 배포
```bash
# 프로젝트 루트에서
cd c:\Users\한찬혁\projects\valuelog-app

# Vercel 로그인
vercel login

# 첫 배포 (설정 진행)
vercel

# 프로덕션 배포
vercel --prod
```

#### Step 3: 환경 변수 설정
```bash
# 환경 변수 추가
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# 재배포
vercel --prod
```

---

## 🔧 Supabase 설정

### 배포된 URL을 Supabase에 등록
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택 → **Authentication** → **URL Configuration**
3. **Site URL** 및 **Redirect URLs**에 Vercel URL 추가:
   ```
   https://valuelog-app-xxxxx.vercel.app
   ```

### Storage Bucket 설정 확인
- `experience-images` 버킷이 **Public**으로 설정되어 있는지 확인
- RLS 정책이 올바르게 설정되어 있는지 확인

---

## 🌐 커스텀 도메인 연결 (선택사항)

### Step 1: 도메인 구매
- [Namecheap](https://www.namecheap.com), [GoDaddy](https://www.godaddy.com) 등에서 도메인 구매

### Step 2: Vercel에서 도메인 추가
1. Vercel 프로젝트 → **Settings** → **Domains**
2. 구매한 도메인 입력 (예: `valuelog.com`)
3. DNS 설정 안내에 따라 CNAME 레코드 추가:
   ```
   Type: CNAME
   Name: www (또는 @)
   Value: cname.vercel-dns.com
   ```

### Step 3: HTTPS 자동 적용
- Vercel이 자동으로 SSL 인증서 발급 (Let's Encrypt)
- 몇 분 내 `https://valuelog.com` 접속 가능

---

## 📱 PWA 설정 (모바일 앱처럼 사용)

### Step 1: PWA 플러그인 설치
```bash
npm install -D vite-plugin-pwa
```

### Step 2: `vite.config.ts` 수정
```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ValueLog',
        short_name: 'ValueLog',
        description: '아이의 성장을 기록하는 포트폴리오 앱',
        theme_color: '#4f46e5',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

### Step 3: 아이콘 추가
- `public/icon-192.png` 및 `public/icon-512.png` 생성
- 재배포 후 모바일에서 "홈 화면에 추가" 가능

---

## 🐛 트러블슈팅

### 문제 1: 환경 변수가 적용되지 않음
**해결:** 
- Vercel 대시보드 → **Settings** → **Environment Variables** 확인
- 변수명이 `VITE_` 접두사로 시작하는지 확인
- 재배포 필요: `vercel --prod`

### 문제 2: 404 에러 (페이지 새로고침 시)
**해결:**
- `vercel.json`의 `rewrites` 설정 확인
- SPA 라우팅을 위해 모든 요청을 `index.html`로 리다이렉트 필요

### 문제 3: Supabase 연결 오류
**해결:**
- Supabase URL이 올바른지 확인
- Anon Key가 정확한지 확인
- Supabase 대시보드에서 Vercel URL이 허용 목록에 있는지 확인

---

## 📊 배포 후 모니터링

### Vercel Analytics (선택사항)
- Vercel 대시보드 → **Analytics** 탭에서 트래픽 확인
- 무료 플랜: 월 100,000 페이지뷰까지 무료

### Supabase 사용량 확인
- Supabase 대시보드 → **Settings** → **Usage**
- 무료 플랜: 500MB 데이터베이스, 1GB 파일 스토리지

---

## 🎉 배포 완료!

배포가 완료되면:
1. **URL 공유**: `https://valuelog-app-xxxxx.vercel.app`
2. **고객 온보딩**: 아래 사용자 가이드 전달
3. **피드백 수집**: 실사용 후 개선사항 파악

---

## 📞 지원

문제가 발생하면:
- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- GitHub Issues 생성
