# Vercel 배포 가이드

## 환경 변수 설정

Vercel에 배포하기 전에 다음 환경 변수를 설정해야 합니다:

### Vercel 대시보드에서 설정

1. Vercel 프로젝트 설정 페이지로 이동
2. Settings > Environment Variables 메뉴 선택
3. 다음 환경 변수 추가:

```
VITE_OPENDART_API_KEY=your_opendart_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

또는 서버리스 함수에서 사용할 경우:

```
OPENDART_API_KEY=your_opendart_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 환경별 설정

- **Production**: 프로덕션 환경에 적용
- **Preview**: 프리뷰 환경에 적용
- **Development**: 개발 환경에 적용

모든 환경에 동일하게 적용하려면 세 가지 모두 선택하세요.

## 배포 단계

1. GitHub 저장소에 코드 푸시
2. Vercel 프로젝트 생성 및 연결
3. 환경 변수 설정 (위 참조)
4. 빌드 및 배포 자동 실행

## 주의사항

- API 키는 절대 클라이언트 코드에 하드코딩하지 마세요
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- 프로덕션 환경에서는 서버리스 함수를 통해 API 키를 안전하게 관리하세요
- OpenDart API는 일일 요청 제한이 있을 수 있으니 주의하세요

## 로컬 개발 환경 설정

로컬에서 개발할 때는 프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```
VITE_OPENDART_API_KEY=your_opendart_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

파일을 생성한 후 개발 서버를 재시작하세요:

```bash
npm run dev
```

