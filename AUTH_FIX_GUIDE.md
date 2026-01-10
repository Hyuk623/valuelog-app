# 로그인/회원가입 오류 해결 가이드

## 🚨 현재 발생한 오류

```json
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

---

## 🔍 오류 원인

이 오류는 **Supabase에서 이메일 인증 기능이 비활성화**되어 있어서 발생합니다.

ValueLog는 현재 **이메일/비밀번호 방식**으로만 로그인하도록 설계되어 있는데, Supabase에서 이 기능이 꺼져 있는 상태입니다.

---

## ✅ 해결 방법

### 1단계: Supabase Dashboard 접속
1. https://app.supabase.com 접속
2. ValueLog 프로젝트 선택

### 2단계: Email Provider 활성화
1. 좌측 메뉴에서 **Authentication** (🔐 아이콘) 클릭
2. **Providers** 탭 클릭
3. **Email** 찾기
4. **Enable Email provider** 토글을 **ON**으로 변경
5. **Confirm email** 옵션:
   - ✅ **OFF 권장** (테스트 단계)
   - 이메일 인증 없이 바로 회원가입 가능
   - 나중에 실제 서비스 시 ON으로 변경
6. **Save** 버튼 클릭

### 3단계: Site URL 설정
1. **Authentication** → **URL Configuration**
2. **Site URL**에 Vercel 배포 URL 입력:
   ```
   https://valuelog-app-xxxxx.vercel.app
   ```
3. **Redirect URLs**에도 동일하게 추가:
   ```
   https://valuelog-app-xxxxx.vercel.app/**
   ```
4. **Save** 클릭

### 4단계: 테스트
1. 배포된 사이트 접속
2. **회원가입** 클릭
3. 이메일과 비밀번호 입력
4. 정상적으로 가입되는지 확인

---

## 🎯 추가 기능: 소셜 로그인 (카카오, 구글)

### 현재 상태
ValueLog는 **이메일/비밀번호 로그인만** 지원합니다.

### 소셜 로그인 추가 방법

#### 1. Google 로그인 추가

**Supabase 설정:**
1. Authentication → Providers → **Google**
2. **Enable Google provider** ON
3. Google Cloud Console에서:
   - OAuth 2.0 클라이언트 ID 생성
   - 승인된 리디렉션 URI 추가:
     ```
     https://fetmsdbwgocthkqfnmbh.supabase.co/auth/v1/callback
     ```
4. Client ID와 Client Secret을 Supabase에 입력

**코드 수정 (LoginPage.tsx):**
```typescript
// Google 로그인 버튼 추가
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) alert(error.message);
};

// UI에 버튼 추가
<button onClick={handleGoogleLogin}>
  Google로 로그인
</button>
```

---

#### 2. 카카오 로그인 추가

**Supabase 설정:**
1. Authentication → Providers → **Kakao**
2. **Enable Kakao provider** ON
3. Kakao Developers에서:
   - 애플리케이션 생성
   - REST API 키 발급
   - Redirect URI 설정:
     ```
     https://fetmsdbwgocthkqfnmbh.supabase.co/auth/v1/callback
     ```
4. Client ID와 Client Secret을 Supabase에 입력

**코드 수정 (LoginPage.tsx):**
```typescript
// 카카오 로그인 버튼 추가
const handleKakaoLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) alert(error.message);
};

// UI에 버튼 추가
<button onClick={handleKakaoLogin}>
  카카오로 로그인
</button>
```

---

## 📝 소셜 로그인 구현 체크리스트

### Google 로그인
- [ ] Google Cloud Console에서 OAuth 클라이언트 생성
- [ ] Supabase에서 Google Provider 활성화
- [ ] Client ID, Secret 입력
- [ ] LoginPage.tsx 코드 수정
- [ ] 테스트

### 카카오 로그인
- [ ] Kakao Developers에서 앱 생성
- [ ] Supabase에서 Kakao Provider 활성화
- [ ] REST API 키 입력
- [ ] LoginPage.tsx 코드 수정
- [ ] 테스트

---

## 🐛 자주 발생하는 오류

### 오류 1: "Email not confirmed"
**원인:** Confirm email 옵션이 ON인 상태

**해결:**
- Supabase → Authentication → Providers → Email
- **Confirm email** OFF로 변경

---

### 오류 2: "Invalid redirect URL"
**원인:** Redirect URLs에 배포 URL이 없음

**해결:**
- Supabase → Authentication → URL Configuration
- Redirect URLs에 Vercel URL 추가

---

### 오류 3: "User already registered"
**원인:** 같은 이메일로 이미 가입됨

**해결:**
- 다른 이메일 사용
- 또는 Supabase → Authentication → Users에서 기존 사용자 삭제

---

## 💡 권장 설정 (프로덕션)

### 보안 설정
1. **Email confirmation**: ON (이메일 인증 필수)
2. **Password requirements**: 
   - 최소 8자
   - 대소문자, 숫자, 특수문자 포함
3. **Rate limiting**: 활성화 (무차별 대입 공격 방지)

### 사용자 경험
1. **소셜 로그인**: Google, Kakao 추가
2. **비밀번호 재설정**: 이메일로 재설정 링크 발송
3. **자동 로그인 유지**: Remember me 기능

---

## 📞 추가 도움이 필요하면

1. Supabase 공식 문서: https://supabase.com/docs/guides/auth
2. GitHub Issues에 질문 등록
3. 개발자에게 문의

---

## ✅ 해결 완료 후 확인사항

- [ ] 이메일/비밀번호 회원가입 성공
- [ ] 로그인 성공
- [ ] 로그아웃 성공
- [ ] 경험 기록 추가 가능
- [ ] 데이터가 정상적으로 저장됨
