import type { AxiosInstance } from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import type { CreateReservationInput, CreateWaitingInput, Reservation, Restaurant, Waiting } from '@/lib/types';
import { mockRestaurant, mockReservations, mockWaitings } from '@/lib/mocks/data';
import { mockRestaurants } from '@/lib/mocks/listingData';

type ReservationsByRestaurant = Record<string, Reservation[]>;
type WaitingsByRestaurant = Record<string, Waiting[]>;

type MockState = {
  reservationsByRestaurant: ReservationsByRestaurant;
  waitingsByRestaurant: WaitingsByRestaurant;
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const restaurantDirectory: Record<string, Restaurant> = (() => {
  const directory = Object.fromEntries(mockRestaurants.map((restaurant) => [restaurant.id, restaurant]));

  if (!directory[mockRestaurant.id]) {
    directory[mockRestaurant.id] = clone(mockRestaurant);
  }

  return directory;
})();

const makeBucket = <T>(): Record<string, T[]> => {
  const bucket: Record<string, T[]> = {};
  Object.keys(restaurantDirectory).forEach((restaurantId) => {
    bucket[restaurantId] = [];
  });
  return bucket;
};

const makeInitialState = (): MockState => {
  const reservationsByRestaurant = makeBucket<Reservation>();
  const waitingsByRestaurant = makeBucket<Waiting>();

  mockReservations.forEach((reservation) => {
    if (!reservationsByRestaurant[reservation.restaurant_id]) {
      reservationsByRestaurant[reservation.restaurant_id] = [];
    }
    reservationsByRestaurant[reservation.restaurant_id].push(clone(reservation));
  });

  mockWaitings.forEach((waiting) => {
    if (!waitingsByRestaurant[waiting.restaurant_id]) {
      waitingsByRestaurant[waiting.restaurant_id] = [];
    }
    waitingsByRestaurant[waiting.restaurant_id].push(clone(waiting));
  });

  return {
    reservationsByRestaurant,
    waitingsByRestaurant,
  };
};

const now = (): string => new Date().toISOString();
const parseBody = <T>(raw: unknown): T => {
  if (typeof raw === 'string') {
    return (raw ? JSON.parse(raw) : {}) as T;
  }

  return (raw ?? {}) as T;
};

const ensureReservationBucket = (restaurantId: string): Reservation[] => {
  if (!state.reservationsByRestaurant[restaurantId]) {
    state.reservationsByRestaurant[restaurantId] = [];
  }
  return state.reservationsByRestaurant[restaurantId];
};

const ensureWaitingBucket = (restaurantId: string): Waiting[] => {
  if (!state.waitingsByRestaurant[restaurantId]) {
    state.waitingsByRestaurant[restaurantId] = [];
  }
  return state.waitingsByRestaurant[restaurantId];
};

const findReservationLocation = (reservationId: string): { restaurantId: string; index: number } | null => {
  for (const [restaurantId, reservations] of Object.entries(state.reservationsByRestaurant)) {
    const index = reservations.findIndex((item) => item.id === reservationId);
    if (index !== -1) {
      return { restaurantId, index };
    }
  }

  return null;
};

const findWaitingLocation = (waitingId: string): { restaurantId: string; index: number } | null => {
  for (const [restaurantId, waitings] of Object.entries(state.waitingsByRestaurant)) {
    const index = waitings.findIndex((item) => item.id === waitingId);
    if (index !== -1) {
      return { restaurantId, index };
    }
  }

  return null;
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

    if (!restaurantId || !restaurantDirectory[restaurantId]) {
      return [404, { message: 'Not found' }];
    }

    return [200, clone(restaurantDirectory[restaurantId])];
  });

  mock.onPost(/\/api\/restaurants\/([^/]+)\/reservations$/).reply((config) => {
    const match = config.url?.match(/\/api\/restaurants\/([^/]+)\/reservations$/);
    const restaurantId = match?.[1];

    if (!restaurantId || !restaurantDirectory[restaurantId]) {
      return [404, { message: 'Not found' }];
    }

    const restaurant = restaurantDirectory[restaurantId];
    if (!restaurant.reservation_enabled) {
      return [400, { message: 'Reservation disabled' }];
    }

    const body = parseBody<CreateReservationInput>(config.data);
    const createdAt = now();
    const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const newReservation: Reservation = {
      id: uniqueId,
      restaurant_id: restaurant.id,
      reservation_code: `RES-${uniqueId}`,
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

    const reservations = ensureReservationBucket(restaurant.id);
    state.reservationsByRestaurant[restaurant.id] = [...reservations, newReservation];

    return [201, clone(newReservation)];
  });

  mock.onGet(/\/api\/admin\/restaurants\/([^/]+)\/reservations$/).reply((config) => {
    const match = config.url?.match(/\/api\/admin\/restaurants\/([^/]+)\/reservations$/);
    const restaurantId = match?.[1];

    if (!restaurantId || !restaurantDirectory[restaurantId]) {
      return [404, { message: 'Not found' }];
    }

    const reservations = ensureReservationBucket(restaurantId);
    return [200, { reservations: clone(reservations) }];
  });

  mock.onPatch(/\/api\/admin\/reservations\/([^/]+)\/status$/).reply((config) => {
    const match = config.url?.match(/\/api\/admin\/reservations\/([^/]+)\/status$/);
    const reservationId = match?.[1];
    const body = parseBody<{ status: Reservation['status'] }>(config.data);

    if (!reservationId) {
      return [404, { message: 'Not found' }];
    }

    const found = findReservationLocation(reservationId);
    if (!found) {
      return [404, { message: 'Not found' }];
    }

    const updatedAt = now();
    const existing = state.reservationsByRestaurant[found.restaurantId][found.index];
    const updated: Reservation = {
      ...existing,
      status: body.status,
      updated_at: updatedAt,
      canceled_at: body.status === 'CANCELED' ? updatedAt : existing.canceled_at,
    };

    state.reservationsByRestaurant[found.restaurantId][found.index] = updated;
    return [200, clone(updated)];
  });

  mock.onGet(/\/api\/restaurants\/([^/]+)\/waiting$/).reply((config) => {
    const match = config.url?.match(/\/api\/restaurants\/([^/]+)\/waiting$/);
    const restaurantId = match?.[1];

    if (!restaurantId || !restaurantDirectory[restaurantId]) {
      return [404, { message: 'Not found' }];
    }

    const waitings = ensureWaitingBucket(restaurantId);
    const active = waitings.filter((item) => item.status === 'WAITING' || item.status === 'CALLED');

    return [200, { waitings: clone(active), total_count: active.length }];
  });

  mock.onPost(/\/api\/restaurants\/([^/]+)\/waiting$/).reply((config) => {
    const match = config.url?.match(/\/api\/restaurants\/([^/]+)\/waiting$/);
    const restaurantId = match?.[1];

    if (!restaurantId || !restaurantDirectory[restaurantId]) {
      return [404, { message: 'Not found' }];
    }

    const restaurant = restaurantDirectory[restaurantId];
    if (!restaurant.remote_waiting_enabled) {
      return [400, { message: 'Remote waiting disabled' }];
    }

    const body = parseBody<CreateWaitingInput>(config.data);
    const waitings = ensureWaitingBucket(restaurant.id);

    const nextNumber = waitings.reduce((max, item) => Math.max(max, item.waiting_number), 0) + 1;
    const createdAt = now();
    const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const newWaiting: Waiting = {
      id: uniqueId,
      restaurant_id: restaurant.id,
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

    state.waitingsByRestaurant[restaurant.id] = [...waitings, newWaiting];
    return [201, clone(newWaiting)];
  });

  mock.onGet(/\/api\/waiting\/([^/]+)$/).reply((config) => {
    const match = config.url?.match(/\/api\/waiting\/([^/]+)$/);
    const waitingId = match?.[1];

    if (!waitingId) {
      return [404, { message: 'Not found' }];
    }

    const found = findWaitingLocation(waitingId);
    if (!found) {
      return [404, { message: 'Not found' }];
    }

    const waitings = ensureWaitingBucket(found.restaurantId);
    const waiting = waitings[found.index];

    const aheadCount = waitings.filter(
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

    const found = findWaitingLocation(waitingId);
    if (!found) {
      return [404, { message: 'Not found' }];
    }

    const updatedAt = now();
    const existing = state.waitingsByRestaurant[found.restaurantId][found.index];
    const updated: Waiting = {
      ...existing,
      status: 'CANCELED',
      canceled_at: updatedAt,
      updated_at: updatedAt,
    };

    state.waitingsByRestaurant[found.restaurantId][found.index] = updated;
    return [200, clone(updated)];
  });

  mock.onPatch(/\/api\/waiting\/([^/]+)\/call$/).reply((config) => {
    const match = config.url?.match(/\/api\/waiting\/([^/]+)\/call$/);
    const waitingId = match?.[1];

    if (!waitingId) {
      return [404, { message: 'Not found' }];
    }

    const found = findWaitingLocation(waitingId);
    if (!found) {
      return [404, { message: 'Not found' }];
    }

    const updatedAt = now();
    const existing = state.waitingsByRestaurant[found.restaurantId][found.index];
    const updated: Waiting = {
      ...existing,
      status: 'CALLED',
      called_at: updatedAt,
      updated_at: updatedAt,
    };

    state.waitingsByRestaurant[found.restaurantId][found.index] = updated;
    return [200, clone(updated)];
  });

  mock.onPatch(/\/api\/waiting\/([^/]+)\/seat$/).reply((config) => {
    const match = config.url?.match(/\/api\/waiting\/([^/]+)\/seat$/);
    const waitingId = match?.[1];

    if (!waitingId) {
      return [404, { message: 'Not found' }];
    }

    const found = findWaitingLocation(waitingId);
    if (!found) {
      return [404, { message: 'Not found' }];
    }

    const updatedAt = now();
    const existing = state.waitingsByRestaurant[found.restaurantId][found.index];
    const updated: Waiting = {
      ...existing,
      status: 'SEATED',
      seated_at: updatedAt,
      updated_at: updatedAt,
    };

    state.waitingsByRestaurant[found.restaurantId][found.index] = updated;
    return [200, clone(updated)];
  });
}
