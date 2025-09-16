# JARVIS MVP - AI 미팅 분석 플랫폼

JARVIS(Just A Revolutionary Virtual Intelligence System)는 AI를 활용하여 미팅을 분석하고 핵심 포인트를 추출하는 혁신적인 플랫폼입니다.

## 🚀 주요 기능

### 📊 미팅 분석
- **파일 업로드**: 텍스트, SRT, 마크다운 파일 업로드 및 분석
- **AI 분석**: OpenAI GPT를 활용한 자동 미팅 분석
- **핵심 포인트 추출**: 주요 논의사항과 액션 아이템 자동 정리
- **감정 분석**: 미팅 분위기 및 참석자 반응 분석

### 🎯 개인화 기능
- **사용자 인증**: 로그인/회원가입 시스템
- **미팅 기록 관리**: 개인별 미팅 히스토리 저장 및 검색
- **개인 인사이트**: 미팅 패턴 분석 및 맞춤형 추천
- **생산성 지표**: 개인별 미팅 효율성 측정

### 📈 대시보드
- **통계 현황**: 미팅 수, 참석자, 프로젝트별 현황
- **키워드 분석**: 자주 언급되는 주제 및 트렌드
- **AI 인사이트**: 데이터 기반 분석 결과 및 개선사항

### 🔗 공유 시스템
- **공개 링크**: 미팅 분석 결과 공유
- **SNS 연동**: 소셜미디어 직접 공유
- **바이럴 기능**: 자동 링크 생성 및 확산

## 🛠 기술 스택

- **Frontend**: Next.js 15.5.3, TypeScript, Tailwind CSS
- **UI Components**: Custom UI components (shadcn/ui 스타일)
- **AI Integration**: OpenAI GPT-3.5-turbo API
- **File Upload**: react-dropzone
- **State Management**: React Hooks, Local Storage
- **Icons**: Lucide React

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── analyze/           # 미팅 분석 페이지
│   ├── dashboard/         # 대시보드
│   ├── login/            # 로그인 페이지
│   ├── share/[token]/    # 공유 페이지
│   └── api/analyze/      # 분석 API 엔드포인트
├── components/
│   ├── auth/             # 인증 관련 컴포넌트
│   ├── meeting/          # 미팅 관련 컴포넌트
│   ├── analytics/        # 분석 관련 컴포넌트
│   └── ui/              # 기본 UI 컴포넌트
└── hooks/               # React Hooks
    └── useAuth.ts       # 인증 훅
```

## 🏃‍♂️ 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

### 4. 빌드 및 배포
```bash
npm run build
npm start
```

## 📋 사용 가이드

### 미팅 분석하기
1. **홈페이지**에서 "시작하기" 또는 "첫 미팅 분석하기" 클릭
2. **파일 업로드** 또는 **직접 텍스트 입력**
3. **분석 시작** 버튼 클릭
4. **AI 분석 결과** 확인 (요약, 핵심 포인트, 액션 아이템 등)
5. **공유** 또는 **저장** (로그인 시에만 저장 가능)

### 개인 대시보드 활용
1. **로그인** 후 대시보드 접속
2. **미팅 통계** 및 **키워드 트렌드** 확인
3. **미팅 기록** 탭에서 과거 분석 결과 검색 및 관리
4. **개인 인사이트** 탭에서 맞춤형 분석 결과 확인

## 🎨 주요 특징

### 사용자 친화적 디자인
- 직관적인 드래그 앤 드롭 파일 업로드
- 반응형 디자인으로 모든 기기에서 최적화
- 깔끔한 카드 기반 레이아웃

### AI 기반 분석
- OpenAI GPT를 활용한 정확한 분석
- 한국어 최적화된 프롬프트
- 구조화된 JSON 결과로 일관성 보장

### 개인화 및 기록 관리
- 로컬스토리지 기반 사용자별 데이터 관리
- 미팅 검색 및 필터링 기능
- 개인 맞춤형 인사이트 및 추천

## 🔧 개발 정보

### 개발 단계별 진행사항

#### Week 1: 프로젝트 초기 설정 ✅
- Next.js 프로젝트 생성
- 기본 UI 컴포넌트 구축
- 홈페이지 레이아웃 완성

#### Week 2: 미팅 분석 엔진 ✅
- OpenAI API 연동
- 파일 업로드 시스템
- 분석 결과 표시 컴포넌트

#### Week 3: 공유 시스템 및 대시보드 ✅
- 공유 페이지 구현
- 대시보드 통계 및 시각화
- 미팅 기록 관리

#### Week 4: 개인화 기능 ✅
- 사용자 인증 시스템
- 개인 미팅 히스토리
- 맞춤형 인사이트 분석

## 🚀 배포 준비

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### 환경변수 설정 (Vercel)
- `OPENAI_API_KEY`: OpenAI API 키

## 📄 라이센스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이나 개선 제안이 있으시면 이슈를 등록해주세요.

---

**JARVIS MVP** - AI로 미팅을 혁신하세요! 🚀
