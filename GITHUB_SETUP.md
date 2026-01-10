# GitHub 레포지토리 생성 및 푸시 가이드

## ✅ 완료된 작업
- [x] Git 저장소 초기화 (`git init`)
- [x] 모든 파일 스테이징 (`git add .`)
- [x] 첫 커밋 생성 (`git commit`)
- [x] 메인 브랜치로 변경 (`git branch -M main`)

---

## 📝 다음 단계: GitHub 레포지토리 생성

### 방법 1: GitHub 웹사이트에서 생성 (추천)

#### Step 1: GitHub에서 새 레포지토리 생성
1. [GitHub](https://github.com) 로그인
2. 우측 상단 **"+"** 클릭 → **"New repository"** 선택
3. 레포지토리 정보 입력:
   ```
   Repository name: valuelog-app
   Description: 아이의 성장을 기록하는 포트폴리오 웹 애플리케이션
   Visibility: Public (또는 Private)
   
   ⚠️ 중요: 다음 옵션은 체크하지 마세요!
   [ ] Add a README file
   [ ] Add .gitignore
   [ ] Choose a license
   ```
4. **"Create repository"** 클릭

#### Step 2: 생성된 레포지토리 URL 확인
GitHub에서 다음과 같은 URL이 표시됩니다:
```
https://github.com/your-username/valuelog-app.git
```

#### Step 3: 로컬 저장소와 연결 (아래 명령어 실행)
```bash
# GitHub 레포지토리 URL로 변경하세요
git remote add origin https://github.com/your-username/valuelog-app.git

# 푸시
git push -u origin main
```

---

### 방법 2: GitHub CLI 사용 (선택사항)

GitHub CLI가 설치되어 있다면:

```bash
# GitHub CLI 설치 확인
gh --version

# 로그인
gh auth login

# 레포지토리 생성 및 푸시
gh repo create valuelog-app --public --source=. --remote=origin --push
```

---

## 🚀 푸시 후 확인

### 1. GitHub 웹사이트에서 확인
```
https://github.com/your-username/valuelog-app
```
- 모든 파일이 업로드되었는지 확인
- README.md, package.json 등이 보이는지 확인

### 2. 브랜치 확인
- 기본 브랜치가 `main`인지 확인

---

## 🔗 Vercel 연동

GitHub 푸시가 완료되면:

### Step 1: Vercel에서 Import
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **"Add New..."** → **"Project"** 클릭
3. **"Import Git Repository"** 선택
4. GitHub 계정 연결 (처음이라면)
5. `valuelog-app` 레포지토리 선택
6. **"Import"** 클릭

### Step 2: 프로젝트 설정
```
Framework Preset: Vite (자동 감지됨)
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 3: 환경 변수 설정
```
Name: VITE_SUPABASE_URL
Value: [Supabase 프로젝트 URL]

Name: VITE_SUPABASE_ANON_KEY
Value: [Supabase Anon Key]
```

### Step 4: Deploy
**"Deploy"** 버튼 클릭!

---

## 📋 명령어 요약

```bash
# 1. GitHub에서 레포지토리 생성 후 URL 복사
# 2. 터미널에서 실행:

cd c:\Users\한찬혁\projects\valuelog-app

# Remote 추가 (your-username을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/your-username/valuelog-app.git

# 푸시
git push -u origin main

# 3. Vercel에서 Import
```

---

## ❓ 문제 해결

### 문제 1: "remote origin already exists"
```bash
# 기존 remote 제거 후 다시 추가
git remote remove origin
git remote add origin https://github.com/your-username/valuelog-app.git
```

### 문제 2: 인증 오류
```bash
# GitHub Personal Access Token 사용
# Settings → Developer settings → Personal access tokens → Generate new token
# repo 권한 체크 후 생성
# 비밀번호 대신 토큰 입력
```

### 문제 3: 푸시 거부 (rejected)
```bash
# 강제 푸시 (주의: 처음 푸시할 때만 사용)
git push -u origin main --force
```

---

## 🎉 완료!

GitHub 푸시가 완료되면:
1. ✅ GitHub에서 코드 확인
2. ✅ Vercel에서 Import
3. ✅ 환경 변수 설정
4. ✅ Deploy 클릭
5. ✅ 배포 URL 확인

---

## 📞 도움이 필요하시면

- GitHub 사용자명을 알려주시면 정확한 명령어를 제공해드립니다
- 에러 메시지가 나오면 복사해서 알려주세요
