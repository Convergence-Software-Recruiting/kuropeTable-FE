import type { AxiosInstance } from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import type { CreateReservationInput, CreateWaitingInput, Reservation, Waiting } from '@/lib/types';
import { mockRestaurant, mockReservations, mockWaitings } from '@/lib/mocks/data';

type MockState = {
  reservations: Reservation[];
  waitings: Waiting[];
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const makeInitialState = (): MockState => ({
  reservations: clone(mockReservations),
  waitings: clone(mockWaitings),
});

const now = (): string => new Date().toISOString();
const parseBody = <T>(raw: unknown): T => {
  if (typeof raw === 'string') {
    return (raw ? JSON.parse(raw) : {}) as T;
  }

  return (raw ?? {}) as T;
};

let state: MockState = makeInitialState();
let mock: AxiosMockAdapter | null = null;

export function resetMockApiState(): void {
  state = makeInitialState();
}

export function installMockApi(client: AxiosInstance): void {
  if (mock) return;

  mock = new AxiosMockAdapter(client, { delayResponse: 180 });

  mock.onGet(/\/api\/restaurants\/([^/]+)$/).reply((config) => {
    const match = config.url?.match(/\/api\/restaurants\/([^/]+)$/);
    const restaurantId = match?.[1];

    if (!restaurantId || restaurantId !== mockRestaurant.id) {
      return [404, { message: 'Not found' }];
    }

    return [200, clone(mockRestaurant)];
  });

  mock.onPost(/\/api\/restaurants\/([^/]+)\/reservations$/).reply((config) => {
    const match = config.url?.match(/\/api\/restaurants\/([^/]+)\/reservations$/);
    const restaurantId = match?.[1];

    if (!restaurantId || restaurantId !== mockRestaurant.id) {
      return [404, { message: 'Not found' }];
    }

    const body = parseBody<CreateReservationInput>(config.data);
    const createdAt = now();
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
      created_at: createdAt,
      updated_at: createdAt,
      canceled_at: null,
    };

    state.reservations = [...state.reservations, newReservation];
    return [201, clone(newReservation)];
  });

  mock.onGet(/\/api\/admin\/restaurants\/([^/]+)\/reservations$/).reply((config) => {
    const match = config.url?.match(/\/api\/admin\/restaurants\/([^/]+)\/reservations$/);
    const restaurantId = match?.[1];

    if (!restaurantId || restaurantId !== mockRestaurant.id) {
      return [404, { message: 'Not found' }];
    }

    return [200, { reservations: clone(state.reservations) }];
  });

  mock.onPatch(/\/api\/admin\/reservations\/([^/]+)\/status$/).reply((config) => {
    const match = config.url?.match(/\/api\/admin\/reservations\/([^/]+)\/status$/);
    const reservationId = match?.[1];
    const body = parseBody<{ status: Reservation['status'] }>(config.data);

    if (!reservationId) {
      return [404, { message: 'Not found' }];
    }

    const index = state.reservations.findIndex((item) => item.id === reservationId);
    if (index === -1) {
      return [404, { message: 'Not found' }];
    }

    const updatedAt = now();
    const existing = state.reservations[index];
    const updated: Reservation = {
      ...existing,
      status: body.status,
      updated_at: updatedAt,
      canceled_at: body.status === 'CANCELED' ? updatedAt : existing.canceled_at,
    };

    state.reservations[index] = updated;
    return [200, clone(updated)];
  });

  mock.onGet(/\/api\/restaurants\/([^/]+)\/waiting$/).reply((config) => {
    const match = config.url?.match(/\/api\/restaurants\/([^/]+)\/waiting$/);
    const restaurantId = match?.[1];

    if (!restaurantId || restaurantId !== mockRestaurant.id) {
      return [404, { message: 'Not found' }];
    }

    const active = state.waitings.filter((item) => item.status === 'WAITING' || item.status === 'CALLED');
    return [200, { waitings: clone(active), total_count: active.length }];
  });

  mock.onPost(/\/api\/restaurants\/([^/]+)\/waiting$/).reply((config) => {
    const match = config.url?.match(/\/api\/restaurants\/([^/]+)\/waiting$/);
    const restaurantId = match?.[1];

    if (!restaurantId || restaurantId !== mockRestaurant.id) {
      return [404, { message: 'Not found' }];
    }

    const body = parseBody<CreateWaitingInput>(config.data);
    const nextNumber = state.waitings.reduce((max, item) => Math.max(max, item.waiting_number), 0) + 1;
    const createdAt = now();

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
      registered_at: createdAt,
      onsite_verified_at: null,
      called_at: null,
      seated_at: null,
      canceled_at: null,
      created_at: createdAt,
      updated_at: createdAt,
    };

    state.waitings = [...state.waitings, newWaiting];
    return [201, clone(newWaiting)];
  });

  mock.onGet(/\/api\/waiting\/([^/]+)$/).reply((config) => {
    const match = config.url?.match(/\/api\/waiting\/([^/]+)$/);
    const waitingId = match?.[1];

    if (!waitingId) {
      return [404, { message: 'Not found' }];
    }

    const waiting = state.waitings.find((item) => item.id === waitingId);
    if (!waiting) {
      return [404, { message: 'Not found' }];
    }

    const aheadCount = state.waitings.filter(
      (item) => item.status === 'WAITING' && item.waiting_number < waiting.waiting_number,
    ).length;

    return [200, { waiting: clone(waiting), ahead_count: aheadCount }];
  });

  mock.onPatch(/\/api\/waiting\/([^/]+)\/cancel$/).reply((config) => {
    const match = config.url?.match(/\/api\/waiting\/([^/]+)\/cancel$/);
    const waitingId = match?.[1];

    if (!waitingId) {
      return [404, { message: 'Not found' }];
    }

    const index = state.waitings.findIndex((item) => item.id === waitingId);
    if (index === -1) {
      return [404, { message: 'Not found' }];
    }

    const updatedAt = now();
    const existing = state.waitings[index];
    const updated: Waiting = {
      ...existing,
      status: 'CANCELED',
      canceled_at: updatedAt,
      updated_at: updatedAt,
    };

    state.waitings[index] = updated;
    return [200, clone(updated)];
  });

  mock.onPatch(/\/api\/waiting\/([^/]+)\/call$/).reply((config) => {
    const match = config.url?.match(/\/api\/waiting\/([^/]+)\/call$/);
    const waitingId = match?.[1];

    if (!waitingId) {
      return [404, { message: 'Not found' }];
    }

    const index = state.waitings.findIndex((item) => item.id === waitingId);
    if (index === -1) {
      return [404, { message: 'Not found' }];
    }

    const updatedAt = now();
    const existing = state.waitings[index];
    const updated: Waiting = {
      ...existing,
      status: 'CALLED',
      called_at: updatedAt,
      updated_at: updatedAt,
    };

    state.waitings[index] = updated;
    return [200, clone(updated)];
  });

  mock.onPatch(/\/api\/waiting\/([^/]+)\/seat$/).reply((config) => {
    const match = config.url?.match(/\/api\/waiting\/([^/]+)\/seat$/);
    const waitingId = match?.[1];

    if (!waitingId) {
      return [404, { message: 'Not found' }];
    }

    const index = state.waitings.findIndex((item) => item.id === waitingId);
    if (index === -1) {
      return [404, { message: 'Not found' }];
    }

    const updatedAt = now();
    const existing = state.waitings[index];
    const updated: Waiting = {
      ...existing,
      status: 'SEATED',
      seated_at: updatedAt,
      updated_at: updatedAt,
    };

    state.waitings[index] = updated;
    return [200, clone(updated)];
  });
}
