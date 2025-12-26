# 재무 데이터 시각화 분석 서비스

React 기반의 재무 데이터 시각화 및 AI 분석 서비스입니다. OpenDart API를 통해 실제 재무 데이터를 조회하고, 차트로 시각화하며, OpenAI API를 활용하여 일반인도 쉽게 이해할 수 있는 재무 분석을 제공합니다.

## 주요 기능

### 1. 회사 검색
- corp.xml 데이터베이스를 활용한 회사명 검색
- 실시간 검색 결과 표시
- 종목코드 및 고유번호 확인

### 2. 재무 데이터 조회
- OpenDart API를 통한 실제 재무 데이터 조회
- 사업연도 및 보고서 유형 선택 (1분기/반기/3분기/사업보고서)
- 재무상태표 및 손익계산서 데이터 제공

### 3. 데이터 시각화
- recharts를 활용한 아름다운 차트
- 재무상태표 주요 항목 시각화 (자산, 부채, 자본)
- 손익계산서 주요 항목 시각화 (매출액, 영업이익, 당기순이익)
- 연도별 비교 (당기/전기/전전기)

### 4. AI 분석
- OpenAI API를 활용한 재무 데이터 분석
- 일반인도 이해하기 쉬운 재무 분석 제공
- 재무 건전성, 수익성, 주요 변화점 분석

### 5. AI 윤리 교육 랜딩 페이지
- 기존 AI 윤리 교육 자료 Repository 소개 페이지
- 모바일 최적화 반응형 디자인

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- OpenDart API 키 (https://opendart.fss.or.kr/)
- OpenAI API 키 (https://platform.openai.com/)

### 설치

```bash
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_OPENDART_API_KEY=your_opendart_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 회사 데이터 변환 (최초 1회)

corp.xml 파일을 JSON으로 변환합니다:

```bash
node scripts/convertCorpXml.js
```

변환된 데이터는 `public/data/corp.json`에 저장됩니다.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 구글폼 연동

구글폼을 생성한 후, `src/App.jsx` 파일의 `googleFormUrl` 변수를 업데이트하세요:

```jsx
const googleFormUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform';
```

구글폼 URL이 설정되면 문의폼이 자동으로 iframe으로 임베드됩니다.

## 기술 스택

### 프론트엔드
- React 18
- Vite
- recharts (차트 라이브러리)
- axios (HTTP 클라이언트)
- CSS3 (모바일 퍼스트 반응형 디자인)

### 백엔드
- Vercel Serverless Functions
- OpenDart API
- OpenAI API

### 데이터
- fast-xml-parser (XML 파싱)
- JSON 형식 회사 데이터베이스

## 디자인 특징

- 밝은 톤의 현대적인 UI
- 모바일 우선 반응형 디자인
- 부드러운 애니메이션 효과
- 터치 친화적인 인터페이스
- 단계별 사용자 가이드
- 직관적인 차트 시각화

## 배포

Vercel에 배포하는 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

## 주의사항

- API 키는 절대 클라이언트 코드에 하드코딩하지 마세요
- `.env.local` 파일은 Git에 커밋되지 않도록 `.gitignore`에 포함되어 있습니다
- 프로덕션 환경에서는 서버리스 함수를 통해 API 키를 안전하게 관리하세요
- OpenDart API는 일일 요청 제한이 있을 수 있으니 주의하세요

