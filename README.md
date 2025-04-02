# 📝 Taska – 할 일 관리 웹앱

**Taska**는 Firebase 기반의 로그인 기능과 간단한 할 일(Todo) 관리 기능을 제공하는 웹 애플리케이션입니다.
Zustand를 활용한 전역 상태 관리와 React Router를 통한 라우팅 보호 기능까지 구현되어 있으며,
Tailwind CSS와 shadcn/ui를 활용하여 깔끔하고 현대적인 UI를 구성했습니다.

---

## ✨ 주요 기능

- 🔐 Firebase 이메일/비밀번호 로그인
- ✅ 할 일 추가, 삭제, 완료 체크 (CRUD)
- 🚫 로그인하지 않으면 접근할 수 없는 보호 라우트
- 🎨 다크 모드 지원 UI
- 💾 Zustand 기반 전역 상태 관리
- 🔄 자동 로그인 유지 (`onAuthStateChanged`)
- ⚙️ TypeScript + Zod 기반 폼 유효성 검사

---

## 🧰 기술 스택

| 기술 | 설명 |
|------|------|
| React | 프론트엔드 라이브러리 |
| Vite | 빠른 개발 서버 및 번들링 |
| TypeScript | 정적 타입 시스템 |
| Firebase | 인증 및 서버리스 백엔드 |
| Zustand | 가볍고 직관적인 전역 상태 관리 |
| Tailwind CSS | 유틸리티 퍼스트 CSS 프레임워크 |
| shadcn/ui | 커스터마이징 가능한 UI 컴포넌트 |
| React Router | 클라이언트 라우팅 관리 |
| Zod | 폼 입력 유효성 검사 라이브러리 |

## 📌 개발 목적
- 사이드 프로젝트를 통해 Firebase 인증 및 React 상태 관리 경험을 쌓기 위함
- 구조적 설계를 고려한 컴포넌트 분리
- 재사용성 높은 UI 구성 및 폴더 구조 실험
