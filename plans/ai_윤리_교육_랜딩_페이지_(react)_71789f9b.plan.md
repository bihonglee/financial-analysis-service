---
name: AI 윤리 교육 랜딩 페이지 (React)
overview: React 기반의 모바일 최적화 랜딩 페이지를 밝은 톤의 UI로 제작합니다. AI 윤리 교육 자료 Repository를 소개하고, 3가지 주제 섹션과 구글폼 연동을 위한 커피챗 문의폼을 포함합니다.
todos:
  - id: setup-react
    content: React 프로젝트 초기 설정 (Vite 또는 CRA)
    status: pending
  - id: hero-component
    content: Hero.jsx 컴포넌트 작성 - 히어로 섹션 구현
    status: pending
    dependencies:
      - setup-react
  - id: topic-card
    content: TopicCard.jsx 컴포넌트 작성 - 3개 주제 카드 구현
    status: pending
    dependencies:
      - setup-react
  - id: contact-form
    content: ContactForm.jsx 컴포넌트 작성 - 구글폼 연동 준비된 문의폼
    status: pending
    dependencies:
      - setup-react
  - id: main-app
    content: App.jsx에 모든 섹션 통합 및 라우팅 구성
    status: pending
    dependencies:
      - hero-component
      - topic-card
      - contact-form
  - id: styling
    content: App.css에 밝은 톤의 모바일 최적화 스타일 작성
    status: pending
    dependencies:
      - main-app
---

# AI

윤리 교육 랜딩 페이지 (React)

## 개요

React 기반의 모바일 우선 랜딩 페이지를 밝은 톤의 현대적인 UI로 구현합니다. AI 윤리 교육 자료 Repository를 소개하고, 3가지 주제 섹션과 구글폼 연동을 위한 커피챗 문의폼을 포함합니다.

## 파일 구조

```javascript
/
├── package.json          # React 프로젝트 설정 및 의존성
├── index.html           # HTML 엔트리 포인트
├── src/
│   ├── App.jsx          # 메인 앱 컴포넌트
│   ├── App.css          # 메인 스타일
│   ├── components/
│   │   ├── Hero.jsx     # 히어로 섹션
│   │   ├── TopicCard.jsx # 주제 카드 컴포넌트
│   │   └── ContactForm.jsx # 커피챗 문의폼
│   └── index.js         # React 엔트리 포인트
└── public/              # 정적 파일
```



## 주요 섹션 구성

### 1. 히어로 섹션 (`Hero.jsx`)

- 타이틀: "인공지능 윤리 교육을 위한 교육 자료 Repository"
- 간단한 소개 문구
- 밝은 그라데이션 배경

### 2. 주제 섹션 (`TopicCard.jsx`)

3개의 주제를 카드 형태로 표시:

- **주제1**: AI 교육 수업계획안 & 성공 사례
- **주제2**: 청소년과 AI 활용

- **주제3**: 인공지능 윤리 관련 웹사이트

각 카드는 나중에 링크를 추가할 수 있도록 플레이스홀더 구조로 제작

### 3. 커피챗 문의폼 (`ContactForm.jsx`)

- 성함 및 소속 (input)
- 연락받을 이메일 (input type="email")

- 문의 내용 (textarea)
- 제출 버튼

- 구글폼 URL을 props로 받아서 외부 구글폼으로 리다이렉트하거나 iframe으로 임베드할 수 있도록 구성

## 디자인 컨셉

- **색상**: 밝은 톤 (화이트, 연한 파스텔 계열, 그라데이션)

- **타이포그래피**: 깔끔한 한글 폰트 (시스템 폰트 또는 웹 폰트)

- **레이아웃**: 모바일 우선, 단일 컬럼, 반응형

- **애니메이션**: 부드러운 스크롤 효과, 호버 효과, 페이드인
- **카드 디자인**: 그림자와 둥근 모서리로 깔끔한 느낌

## 구현 세부사항

### React 설정

- Vite 또는 Create React App 사용
- 함수형 컴포넌트 및 Hooks 사용
- 반응형 메타 태그 포함

### CSS 스타일

- 모바일 퍼스트 반응형 디자인
- 밝은 그라데이션 배경
- 카드 기반 레이아웃

- 부드러운 트랜지션 효과
- 터치 친화적인 버튼 크기 (최소 44px)

### 구글폼 연동

- 구글폼 URL을 환경변수나 설정으로 관리

- 현재는 플레이스홀더로 준비 (나중에 구글폼 생성 후 URL만 추가하면 됨)

- 옵션 1: 구글폼으로 리다이렉트
- 옵션 2: 구글폼을 iframe으로 임베드

## 파일 변경 사항

- 새 프로젝트 생성: React 프로젝트 초기 설정
- `src/App.jsx`: 메인 앱 컴포넌트 작성

- `src/App.css`: 메인 스타일 작성
- `src/components/Hero.jsx`: 히어로 섹션 컴포넌트

- `src/components/TopicCard.jsx`: 주제 카드 컴포넌트

- `src/components/ContactForm.jsx`: 커피챗 문의폼 컴포넌트
- `package.json`: 프로젝트 의존성 설정