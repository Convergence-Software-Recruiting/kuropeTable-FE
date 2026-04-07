import { http, HttpResponse } from 'msw';
import { mockRestaurant, mockReservations, mockWaitings } from './data';
import type { Reservation, Waiting } from '@/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

let reservations = [...mockReservations];
let waitings = [...mockWaitings];

export const handlers = [
  // 식당 상세
  http.get(`${BASE}/api/restaurants/:id`, ({ params }) => {
    if (params.id !== mockRestaurant.id) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json(mockRestaurant);
  }),

  // 예약 생성
  http.post(`${BASE}/api/restaurants/:id/reservations`, async ({ request }) => {
    const body = await request.json() as Partial<Reservation>;
    const newReservation: Reservation = {
      id: String(Date.now()),
      restaurant_id: mockRestaurant.id,
      reservation_code: `RES-${Date.now()}`,
      guest_name: body.guest_name ?? '',
      guest_phone: body.guest_phone ?? '',
      reservation_date: body.reservation_date ?? '',
      reservation_time: body.reservation_time ?? '',
      party_size: body.party_size ?? 1,
      request_note: body.request_note ?? '',
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      canceled_at: null,
    };
    reservations = [...reservations, newReservation];
    return HttpResponse.json(newReservation, { status: 201 });
  }),

  // 대기 현황 조회
  http.get(`${BASE}/api/restaurants/:id/waiting`, () => {
    const active = waitings.filter((w) => w.status === 'WAITING' || w.status === 'CALLED');
    return HttpResponse.json({ waitings: active, total_count: active.length });
  }),

  // 웨이팅 등록
  http.post(`${BASE}/api/restaurants/:id/waiting`, async ({ request }) => {
    const body = await request.json() as Partial<Waiting>;
    const nextNumber = waitings.length + 1;
    const newWaiting: Waiting = {
      id: String(Date.now()),
      restaurant_id: mockRestaurant.id,
      waiting_code: `W-${String(nextNumber).padStart(3, '0')}`,
      guest_name: body.guest_name ?? '',
      guest_phone: body.guest_phone ?? '',
      party_size: body.party_size ?? 1,
      waiting_number: nextNumber,
      registered_channel: 'REMOTE',
      status: 'WAITING',
      onsite_verified: false,
      registered_at: new Date().toISOString(),
      onsite_verified_at: null,
      called_at: null,
      seated_at: null,
      canceled_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    waitings = [...waitings, newWaiting];
    return HttpResponse.json(newWaiting, { status: 201 });
  }),

  // 내 웨이팅 상태 조회
  http.get(`${BASE}/api/waiting/:waitingId`, ({ params }) => {
    const waiting = waitings.find((w) => w.id === params.waitingId);
    if (!waiting) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const ahead = waitings.filter(
      (w) => w.status === 'WAITING' && w.waiting_number < waiting.waiting_number,
    ).length;
    return HttpResponse.json({ waiting, ahead_count: ahead });
  }),

  // 웨이팅 취소
  http.patch(`${BASE}/api/waiting/:waitingId/cancel`, ({ params }) => {
    const idx = waitings.findIndex((w) => w.id === params.waitingId);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    waitings[idx] = { ...waitings[idx], status: 'CANCELED', canceled_at: new Date().toISOString() };
    return HttpResponse.json(waitings[idx]);
  }),

  // [Admin] 웨이팅 호출
  http.patch(`${BASE}/api/waiting/:waitingId/call`, ({ params }) => {
    const idx = waitings.findIndex((w) => w.id === params.waitingId);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    waitings[idx] = { ...waitings[idx], status: 'CALLED', called_at: new Date().toISOString() };
    return HttpResponse.json(waitings[idx]);
  }),

  // [Admin] 웨이팅 입장 처리
  http.patch(`${BASE}/api/waiting/:waitingId/seat`, ({ params }) => {
    const idx = waitings.findIndex((w) => w.id === params.waitingId);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    waitings[idx] = { ...waitings[idx], status: 'SEATED', seated_at: new Date().toISOString() };
    return HttpResponse.json(waitings[idx]);
  }),

  // [Admin] 예약 목록 조회
  http.get(`${BASE}/api/admin/restaurants/:id/reservations`, () => {
    return HttpResponse.json({ reservations });
  }),

  // [Admin] 예약 상태 변경
  http.patch(`${BASE}/api/admin/reservations/:id/status`, async ({ params, request }) => {
    const body = await request.json() as { status: Reservation['status'] };
    const idx = reservations.findIndex((r) => r.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    reservations[idx] = {
      ...reservations[idx],
      status: body.status,
      canceled_at: body.status === 'CANCELED' ? new Date().toISOString() : reservations[idx].canceled_at,
    };
    return HttpResponse.json(reservations[idx]);
  }),
];
