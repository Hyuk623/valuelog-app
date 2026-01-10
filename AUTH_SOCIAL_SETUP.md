# 🚀 소셜 로그인(구글/카카오) 활성화 가이드

현재 발생 중인 `Unsupported provider` 오류는 Supabase 대시보드에서 해당 기능을 활성화하지 않아 발생하는 문제입니다. 아래 단계를 따라 설정을 완료해 주세요.

## 1. Supabase에서 Provider 활성화

1. [Supabase Dashboard](https://app.supabase.com/)에 접속하여 프로젝트를 선택합니다.
2. 좌측 메뉴에서 **Authentication** (🔐 아이콘) -> **Providers**를 클릭합니다.
3. 리스트에서 **Google**을 찾아 설정을 진행합니다.

---

## 2. Google 로그인 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트를 생성/선택합니다.
2. **API 및 서비스** -> **OAuth 동의 화면**을 구성합니다.
3. **사용자 인증 정보**에서 **OAuth 2.0 클라이언트 ID**를 생성합니다. (웹 애플리케이션)
4. **승인된 리디렉션 URI**에 아래 주소를 입력합니다:
   `https://fetmsdbwgocthkqfnmbh.supabase.co/auth/v1/callback`
5. 생성된 **Client ID**와 **Client Secret**을 Supabase의 Google Provider 설정창에 입력하고 **Save**를 누릅니다.

---

## 3. Redirect URL(Vercel) 설정 (필수)

Supabase가 로그인을 마친 사용자를 다시 Vercel 앱으로 돌려보내기 위한 설정입니다.

1. **Authentication** -> **URL Configuration**으로 이동합니다.
2. **Site URL**에 현재 Vercel 배포 주소를 입력합니다:
   예: `https://valuelog-app-xxxxx.vercel.app`
3. **Redirect URLs**에 아래 형식을 추가합니다:
   `https://valuelog-app-xxxxx.vercel.app/**`

---

> [!TIP]
> 모든 설정을 마친 후 다시 로그인을 시도해 보세요! 만약 이메일 인증이 번거롭다면 **Providers** -> **Email** 설정에서 **Confirm email**을 잠깐 꺼두시는 것도 좋습니다.
