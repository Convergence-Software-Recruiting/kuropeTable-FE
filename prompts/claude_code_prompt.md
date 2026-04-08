# 🍽️ Restaurant Reservation & Waiting System — Frontend Dev Prompt

## 📌 Context

You are helping build a **Next.js frontend** for a restaurant reservation and waiting system.
This is a **frontend-only task** — APIs are mocked or provided by the backend team.
Focus on component architecture, type safety, and test harness setup.

---

## 🗄️ Domain Model (from ERD)

### RESTAURANT
```ts
type Restaurant = {
  id: bigint;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  operating_status: 'OPEN' | 'CLOSED' | 'BREAK'; // enum
  reservation_enabled: boolean;
  waiting_enabled: boolean;
  remote_waiting_enabled: boolean;
  onsite_check_threshold: number; // 현장 웨이팅 인증 시작 번호
  avg_dining_minutes: number;
  created_at: string;
  updated_at: string;
};
```

### RESERVATION
```ts
type Reservation = {
  id: bigint;
  restaurant_id: bigint;
  reservation_code: string;
  guest_name: string;
  guest_phone: string;
  reservation_date: string; // date
  reservation_time: string; // time
  party_size: number;
  request_note: string;
  status: 'PENDING' | 'CONFIRMED' | 'VISITED' | 'CANCELED'; // enum
  created_at: string;
  updated_at: string;
  canceled_at: string | null;
};
```

### WAITING
```ts
type Waiting = {
  id: bigint;
  restaurant_id: bigint;
  waiting_code: string;
  guest_name: string;
  guest_phone: string;
  party_size: number;
  waiting_number: number;
  registered_channel: 'REMOTE' | 'ONSITE'; // enum
  status: 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELED'; // enum
  onsite_verified: boolean;
  registered_at: string;
  onsite_verified_at: string | null;
  called_at: string | null;
  seated_at: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
};
```

---

## 🎯 Business Rules

1. 식당은 **예약** 또는 **웨이팅** 중 하나 또는 둘 다 선택 가능.
2. **예약** = 날짜/시간 지정 방문. 웨이팅 불필요.
3. **웨이팅** = 도착 순서 기반.
   - `remote_waiting_enabled=true` → 사용자가 원격(웹)으로 웨이팅 등록 가능.
   - `waiting_enabled=true` → 현재 대기 현황 조회 가능.
   - `onsite_check_threshold` → 내 웨이팅 번호가 이 숫자 이하로 내려오면 현장 인증 필요 (`onsite_verified`).

---

## 🖥️ Pages & Features to Implement

### Client (사용자)

| Route | Description |
|---|---|
| `/restaurants/[id]` | 식당 상세 조회 (기본 정보 + 예약/웨이팅 가능 여부) |
| `/restaurants/[id]/reservation/new` | 예약 신청 폼 |
| `/restaurants/[id]/waiting` | 현재 대기 현황 조회 |
| `/restaurants/[id]/waiting/new` | 웨이팅 등록 |
| `/waiting/[waitingId]` | 내 웨이팅 상태 조회 (순번, 앞 팀 수) |
| `/waiting/[waitingId]/cancel` | 웨이팅 취소 |

### Admin (식당 관리자)

| Route | Description |
|---|---|
| `/admin/restaurants/[id]/reservations` | 예약 목록 조회 |
| `/admin/restaurants/[id]/reservations/[resId]` | 예약 상태 변경 (확정/취소/방문완료) |
| `/admin/restaurants/[id]/waiting` | 현재 대기 현황 + 전체 웨이팅 목록 |
| `/admin/restaurants/[id]/waiting/[waitingId]/call` | 웨이팅 호출 |
| `/admin/restaurants/[id]/waiting/[waitingId]/seat` | 웨이팅 입장 처리 |
| `/admin/restaurants/[id]/waiting/[waitingId]/cancel` | 웨이팅 취소 처리 |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library (harness 구성 포함)

---

## 📁 Recommended Project Structure

```
src/
├── app/
│   ├── restaurants/[id]/
│   │   ├── page.tsx                    # 식당 상세
│   │   ├── reservation/new/page.tsx    # 예약 신청
│   │   └── waiting/
│   │       ├── page.tsx                # 대기 현황
│   │       └── new/page.tsx            # 웨이팅 등록
│   ├── waiting/[waitingId]/
│   │   ├── page.tsx                    # 내 웨이팅 상태
│   │   └── cancel/page.tsx
│   └── admin/restaurants/[id]/
│       ├── reservations/page.tsx
│       └── waiting/page.tsx
├── components/
│   ├── restaurant/
│   ├── reservation/
│   ├── waiting/
│   └── ui/                             # 공통 UI (Button, Badge, Modal 등)
├── hooks/
│   ├── useRestaurant.ts
│   ├── useReservation.ts
│   └── useWaiting.ts
├── lib/
│   ├── api/                            # API 호출 함수
│   ├── mocks/                          # MSW mock handlers
│   └── types/                          # 도메인 타입 정의
└── __tests__/
    ├── components/
    └── hooks/
```

---

## ✅ Test Harness Setup Requirements

### 1. Vitest + React Testing Library 설정
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

`vitest.config.ts` 생성:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom';
```

### 2. MSW (Mock Service Worker) 로 API 모킹
```bash
npm install -D msw
```

`src/lib/mocks/handlers.ts` 에 아래 엔드포인트에 대한 mock 작성:
- `GET /api/restaurants/:id`
- `POST /api/restaurants/:id/reservations`
- `GET /api/restaurants/:id/waiting`
- `POST /api/restaurants/:id/waiting`
- `GET /api/waiting/:waitingId`
- `PATCH /api/waiting/:waitingId/cancel`
- `PATCH /api/waiting/:waitingId/call` (admin)
- `PATCH /api/waiting/:waitingId/seat` (admin)
- `GET /api/admin/restaurants/:id/reservations`
- `PATCH /api/admin/reservations/:id/status`

---

## 🧪 Test Requirements

각 주요 컴포넌트/훅에 대해 아래 테스트 작성:

### 식당 상세 페이지 (`RestaurantDetail`)
- [ ] 식당 정보가 올바르게 렌더링되는지
- [ ] `reservation_enabled=false`일 때 예약 버튼이 비활성화되는지
- [ ] `waiting_enabled=false`일 때 웨이팅 섹션이 숨겨지는지
- [ ] `operating_status='CLOSED'`일 때 적절한 상태 표시

### 웨이팅 등록 (`WaitingRegisterForm`)
- [ ] 폼 유효성 검사 (이름, 전화번호, 인원수 필수)
- [ ] 등록 성공 시 웨이팅 상태 페이지로 이동
- [ ] `remote_waiting_enabled=false`일 때 접근 차단

### 내 웨이팅 상태 (`MyWaitingStatus`)
- [ ] 현재 순번과 앞 팀 수가 표시되는지
- [ ] `onsite_check_threshold` 이하일 때 현장 인증 안내 표시
- [ ] `status='CALLED'`일 때 호출 알림 UI 표시

### Admin 웨이팅 관리 (`AdminWaitingList`)
- [ ] 웨이팅 목록이 순서대로 렌더링되는지
- [ ] 호출 버튼 클릭 시 상태가 CALLED로 변경되는지
- [ ] 입장 처리 버튼이 CALLED 상태에서만 활성화되는지

---

## 📋 Implementation Steps (이 순서로 진행)

1. **타입 정의** — `src/lib/types/` 에 도메인 타입 전부 작성
2. **MSW 핸들러** — mock API 응답 데이터와 함께 작성
3. **Vitest 설정** — 테스트 환경 구성
4. **공통 UI 컴포넌트** — Button, Badge, StatusBadge, Modal, LoadingSpinner
5. **Client 페이지 구현** — 식당 상세 → 예약 → 웨이팅 순
6. **Admin 페이지 구현**
7. **테스트 작성** — 각 컴포넌트/훅 단위 테스트
8. **통합 확인** — 전체 플로우 수동 검증

---

## ⚠️ Notes & Constraints

- API 베이스 URL은 환경 변수 `NEXT_PUBLIC_API_BASE_URL` 로 관리
- 모든 `bigint` ID는 API 통신 시 `string` 으로 직렬화
- 웨이팅 상태 polling은 5초 간격 (SWR 또는 React Query의 `refreshInterval` 활용)
- 에러 상태 (404, 500) 에 대한 fallback UI 필수
- 반응형 대응 필수 (모바일 우선)
- 컴포넌트는 테스트 가능하도록 props 기반으로 설계 (전역 상태 최소화)
