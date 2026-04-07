# kurope Table FE — Claude Code Guide

## Project Overview
Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 프론트엔드 프로젝트.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Package Manager**: npm

## Commands
```bash
npm run dev          # 개발 서버 실행 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 타입 체크 (빌드 없이)
```

## Project Structure
```
src/
├── app/             # Next.js App Router (라우트, layout, page)
│   ├── layout.tsx   # 루트 레이아웃
│   ├── page.tsx     # 홈 페이지
│   └── globals.css  # 전역 스타일 (Tailwind import)
├── components/      # 재사용 가능한 UI 컴포넌트
├── hooks/           # 커스텀 React hooks
├── lib/             # 유틸리티 함수, API 클라이언트
└── types/           # TypeScript 타입 정의
```

## Conventions

### Components
- 파일명: PascalCase (e.g., `UserTable.tsx`)
- 함수형 컴포넌트만 사용
- props 타입은 컴포넌트 파일 내 `interface Props` 로 정의
- 서버 컴포넌트가 기본, 클라이언트 컴포넌트는 `"use client"` 명시

### Naming
- 컴포넌트: PascalCase
- 함수/변수: camelCase
- 상수: UPPER_SNAKE_CASE
- 타입/인터페이스: PascalCase

### Path Aliases
- `@/*` → `src/*` (e.g., `import { Button } from "@/components/Button"`)

### Styling
- Tailwind 유틸리티 클래스 우선 사용
- 복잡한 스타일은 `globals.css`에 `@layer` 사용
- 인라인 style 속성 사용 지양

### TypeScript
- `any` 타입 사용 금지
- 모든 함수 반환 타입 명시 권장
- `interface` 사용 (type alias는 union/intersection에만)

## Before Committing
1. `npm run type-check` — 타입 에러 없어야 함
2. `npm run lint` — ESLint 에러 없어야 함
3. `npm run build` — 빌드 성공해야 함
