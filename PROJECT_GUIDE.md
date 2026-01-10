# ValueLog 프로젝트 완전 가이드 (비개발자용)

> 💡 **이 문서는 개발 지식이 전혀 없는 분들도 이해할 수 있도록 작성되었습니다.**

---

## 📚 목차
1. [프로젝트 소개](#프로젝트-소개)
2. [사용된 기술 설명](#사용된-기술-설명)
3. [개발 과정 전체 흐름](#개발-과정-전체-흐름)
4. [배포 과정 설명](#배포-과정-설명)
5. [수정 및 업데이트 방법](#수정-및-업데이트-방법)
6. [자주 묻는 질문](#자주-묻는-질문)

---

## 프로젝트 소개

### ValueLog란?
**ValueLog**는 아이의 성장 경험을 체계적으로 기록하고, 자동으로 포트폴리오 텍스트를 생성해주는 웹 애플리케이션입니다.

### 주요 기능
- 📝 **경험 기록**: STARR 회고 템플릿으로 체계적 기록
- 📊 **통계 분석**: 아이의 성장 패턴을 차트로 시각화
- 📄 **자동 텍스트 생성**: 체험학습 보고서, 자기소개서용 문장 자동 생성
- 🔐 **개인 계정**: 각 가정의 데이터를 안전하게 분리 보관

---

## 사용된 기술 설명

### 1. 프론트엔드 (사용자가 보는 화면)
**기술:** React + TypeScript + Vite

**쉬운 설명:**
- **React**: 웹 페이지를 만드는 도구 (레고 블록처럼 화면을 조립)
- **TypeScript**: 오류를 미리 잡아주는 안전장치가 있는 프로그래밍 언어
- **Vite**: 개발할 때 빠르게 화면을 확인할 수 있게 해주는 도구

**비유:** 집을 짓는다면, React는 벽돌, TypeScript는 설계도, Vite는 빠른 시공 도구

---

### 2. 백엔드 (데이터 저장 및 관리)
**기술:** Supabase

**쉬운 설명:**
- **데이터베이스**: 사용자 정보, 경험 기록 등을 저장하는 창고
- **인증 시스템**: 로그인/회원가입 기능
- **파일 저장소**: 사진을 업로드하면 저장되는 공간

**비유:** 은행 금고처럼 데이터를 안전하게 보관하고 관리

---

### 3. 배포 (인터넷에 공개)
**기술:** Vercel + GitHub

**쉬운 설명:**
- **GitHub**: 코드를 저장하는 클라우드 저장소 (구글 드라이브 같은 것)
- **Vercel**: 웹사이트를 인터넷에 올려주는 서비스 (웹 호스팅)

**비유:** GitHub는 원고 보관함, Vercel은 출판사

---

## 개발 과정 전체 흐름

### Phase 1-6: 기초 작업 (완료 ✅)
**무엇을 했나요?**
- 프로젝트 기본 구조 만들기
- 로그인/회원가입 기능 추가
- 화면이 안 나오는 버그 수정

**비유:** 집의 기초 공사 및 골조 세우기

---

### Phase 7-12: 핵심 기능 구현 (완료 ✅)
**무엇을 했나요?**
- 경험 기록 추가/수정/삭제 기능
- 역량 태그, 활동 분야 태그 시스템
- 과거에 사용한 태그 자동으로 보여주기

**비유:** 집에 방, 화장실, 주방 만들기

---

### Phase 13-16: 통계 및 시각화 (완료 ✅)
**무엇을 했나요?**
- 월별 활동 추이 그래프
- 역량 레이더 차트
- 분야별 만족도 분석

**비유:** 집에 인테리어 하고 가구 배치하기

---

### Phase 17-22: 포트폴리오 텍스트 고도화 (완료 ✅)
**무엇을 했나요?**
- 자동 생성되는 문장을 더 전문적으로 개선
- 체험학습 보고서, 자기소개서에 바로 쓸 수 있는 수준으로 업그레이드

**예시:**
- **이전**: "학교 축구대회 결승전 경험 활동에서 끈기·협동심 역량을 발휘했고, 의미 있는 경험을 쌓았음."
- **개선 후**: "학교 축구대회 결승전 활동에서 포기하지 않고 끝까지 팀을 응원하고 뛰며 끈기, 협동심, 리더십 역량을 집중적으로 키운 성취임."

**비유:** 집을 더 멋지게 꾸미고 편리한 기능 추가하기

---

### Phase 23: 배포 준비 (완료 ✅)
**무엇을 했나요?**
- GitHub에 코드 업로드
- Vercel에서 배포 설정
- 환경 변수 설정 (Supabase 연결)

**비유:** 집을 완성하고 입주 준비 완료

---

## 배포 과정 설명

### 1단계: 코드를 GitHub에 업로드
**왜 필요한가요?**
- 코드를 안전하게 백업
- 여러 사람이 협업 가능
- Vercel이 코드를 가져갈 수 있는 장소

**실제 작업:**
```bash
git init                    # Git 시작
git add .                   # 모든 파일 준비
git commit -m "메시지"      # 변경사항 기록
git push                    # GitHub에 업로드
```

**비유:** 원고를 출판사에 보내는 것

---

### 2단계: Vercel에서 배포
**왜 Vercel을 사용하나요?**
- 무료로 사용 가능 (개인 프로젝트)
- GitHub와 자동 연동
- 코드를 수정하면 자동으로 업데이트

**실제 작업:**
1. Vercel 웹사이트 접속
2. GitHub 계정으로 로그인
3. `valuelog-app` 레포지토리 Import
4. 환경 변수 설정 (Supabase URL, Key)
5. Deploy 버튼 클릭

**비유:** 출판사가 책을 인쇄해서 서점에 배포

---

### 3단계: 환경 변수 설정
**환경 변수란?**
- 비밀번호처럼 외부에 공개하면 안 되는 정보
- Supabase 데이터베이스 주소와 접근 키

**설정한 값:**
```
VITE_SUPABASE_URL = https://fetmsdbwgocthkqfnmbh.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGci... (긴 문자열)
```

**비유:** 은행 계좌번호와 비밀번호

---

## 수정 및 업데이트 방법

### 시나리오: 포트폴리오 텍스트 문구를 수정하고 싶어요

#### 1단계: 로컬에서 코드 수정
```
파일 위치: src/pages/experiences/ExperienceDetailPage.tsx
수정 내용: generateSummary 함수의 문장 구조 변경
```

#### 2단계: Git으로 변경사항 저장
```bash
git add src/pages/experiences/ExperienceDetailPage.tsx
git commit -m "포트폴리오 텍스트 문구 수정"
```

#### 3단계: GitHub에 업로드
```bash
git push
```

#### 4단계: 자동 배포 (아무것도 안 해도 됨!)
- Vercel이 자동으로 감지
- 2-3분 후 자동으로 배포 완료
- 사용자가 새로고침하면 바로 반영

**소요 시간:** 전체 5분 이내

---

## 프로젝트 구조 설명

### 폴더 구조
```
valuelog-app/
├── src/                          # 소스 코드
│   ├── pages/                    # 화면 페이지들
│   │   ├── auth/                 # 로그인/회원가입
│   │   ├── children/             # 아이 관리
│   │   ├── experiences/          # 경험 기록
│   │   └── stats/                # 통계 페이지
│   ├── components/               # 재사용 가능한 UI 조각
│   ├── hooks/                    # 데이터 가져오기 로직
│   ├── lib/                      # Supabase 연결 설정
│   └── types/                    # TypeScript 타입 정의
├── public/                       # 이미지, 아이콘 등
├── supabase/                     # 데이터베이스 설정
│   └── migrations/               # 데이터베이스 구조
├── vercel.json                   # Vercel 배포 설정
├── package.json                  # 프로젝트 정보 및 의존성
└── README.md                     # 프로젝트 설명서
```

---

## 주요 파일 설명

### 1. ExperienceDetailPage.tsx
**역할:** 경험 상세 페이지 (포트폴리오 텍스트 생성)

**주요 함수:**
- `generateNarrative()`: 포트폴리오·일기용 서술형 텍스트 생성
- `generateSummary()`: 체험학습·자소서용 요약 텍스트 생성

**수정 시 영향:** 자동 생성되는 문장 형태가 바뀜

---

### 2. supabaseClient.ts
**역할:** Supabase 데이터베이스 연결

**주요 내용:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**수정 시 영향:** 데이터베이스 연결이 끊어질 수 있음 (주의!)

---

### 3. vercel.json
**역할:** Vercel 배포 설정

**주요 내용:**
- SPA 라우팅 설정 (페이지 새로고침 시 404 방지)
- 정적 파일 캐싱 설정 (빠른 로딩)

**수정 시 영향:** 배포 방식이 바뀜

---

## 데이터베이스 구조

### 테이블 설명

#### 1. children (아이 정보)
```
id: 고유 번호
user_id: 부모 계정 ID
name: 아이 이름
birth_date: 생년월일
```

#### 2. experiences (경험 기록)
```
id: 고유 번호
user_id: 부모 계정 ID
child_id: 아이 ID
title: 활동 제목
date: 활동 날짜
responses: STARR 답변 (JSON)
tags_competency: 역량 태그 배열
tags_category: 활동 분야 태그 배열
satisfaction_score: 만족도 (1-5)
image_url: 사진 URL
```

#### 3. frameworks (템플릿)
```
id: 고유 번호
name: 템플릿 이름 (예: STARR 회고)
schema: 질문 구조 (JSON)
```

---

## 자주 묻는 질문

### Q1. 코드를 수정했는데 배포가 안 돼요
**A.** 다음을 확인하세요:
1. `git push`를 했나요?
2. Vercel Dashboard에서 배포 상태 확인
3. 빌드 로그에 에러가 있나요?

---

### Q2. 환경 변수를 바꾸고 싶어요
**A.** Vercel Dashboard에서:
1. 프로젝트 선택
2. Settings → Environment Variables
3. 값 수정 후 Redeploy

---

### Q3. 데이터베이스 구조를 바꾸고 싶어요
**A.** Supabase Dashboard에서:
1. Table Editor에서 직접 수정
2. 또는 SQL Editor에서 마이그레이션 실행

---

### Q4. 배포 URL을 커스텀 도메인으로 바꾸고 싶어요
**A.** 
1. 도메인 구매 (Namecheap, GoDaddy 등)
2. Vercel → Settings → Domains
3. 도메인 추가 및 DNS 설정

---

### Q5. 비용이 얼마나 드나요?
**A.** 현재 설정:
- **Vercel**: 무료 (Hobby 플랜)
- **Supabase**: 무료 (Free 플랜)
- **GitHub**: 무료 (Public 레포지토리)

**총 비용: 0원** (트래픽이 많아지면 유료 전환 필요)

---

## 문제 해결 가이드

### 문제 1: 화면이 하얗게 나와요
**원인:** JavaScript 오류

**해결:**
1. 브라우저 F12 → Console 탭 확인
2. 빨간색 에러 메시지 복사
3. 해당 파일 확인 및 수정

---

### 문제 2: 로그인이 안 돼요
**원인:** Supabase 인증 설정 문제

**해결:**
1. Supabase Dashboard → Authentication
2. Email Provider 활성화 확인
3. Redirect URLs에 Vercel URL 추가

---

### 문제 3: 이미지 업로드가 안 돼요
**원인:** Storage Bucket 설정 문제

**해결:**
1. Supabase Dashboard → Storage
2. `experience-images` 버킷 생성
3. Public 권한 설정

---

## 유지보수 체크리스트

### 매주 확인
- [ ] Vercel 배포 상태 확인
- [ ] Supabase 사용량 확인 (무료 한도)
- [ ] 사용자 피드백 수집

### 매월 확인
- [ ] 보안 업데이트 (npm audit)
- [ ] 의존성 업데이트 (npm outdated)
- [ ] 백업 확인

### 필요 시
- [ ] 새 기능 추가
- [ ] 버그 수정
- [ ] 성능 최적화

---

## 추가 학습 자료

### 초보자용
- [React 공식 튜토리얼](https://react.dev/learn)
- [Git 기초 가이드](https://git-scm.com/book/ko/v2)
- [Supabase 시작하기](https://supabase.com/docs)

### 중급자용
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Vercel 문서](https://vercel.com/docs)
- [React 성능 최적화](https://react.dev/learn/render-and-commit)

---

## 연락처 및 지원

**문제가 발생하면:**
1. 이 문서의 "문제 해결 가이드" 확인
2. GitHub Issues에 질문 등록
3. 개발자에게 문의

**프로젝트 정보:**
- GitHub: https://github.com/Hyuk623/valuelog-app
- 배포 URL: https://valuelog-app-xxxxx.vercel.app

---

## 마치며

이 프로젝트는 **23개의 개발 단계**를 거쳐 완성되었습니다. 

각 단계마다 기능을 추가하고, 버그를 수정하고, 사용자 경험을 개선했습니다.

**핵심 철학:**
- 사용자 중심 설계
- 자동화를 통한 편의성
- 안전한 데이터 관리

앞으로도 지속적으로 개선하고 발전시켜 나갈 예정입니다! 🚀
