export type OperatingStatus = 'OPEN' | 'CLOSED' | 'BREAK';

export type Restaurant = {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  operating_status: OperatingStatus;
  reservation_enabled: boolean;
  waiting_enabled: boolean;
  remote_waiting_enabled: boolean;
  onsite_check_threshold: number;
  avg_dining_minutes: number;
  created_at: string;
  updated_at: string;
};

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'VISITED' | 'CANCELED';

export type Reservation = {
  id: string;
  restaurant_id: string;
  reservation_code: string;
  guest_name: string;
  guest_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  request_note: string;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
  canceled_at: string | null;
};

export type WaitingStatus = 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELED';
export type RegisteredChannel = 'REMOTE' | 'ONSITE';

export type Waiting = {
  id: string;
  restaurant_id: string;
  waiting_code: string;
  guest_name: string;
  guest_phone: string;
  party_size: number;
  waiting_number: number;
  registered_channel: RegisteredChannel;
  status: WaitingStatus;
  onsite_verified: boolean;
  registered_at: string;
  onsite_verified_at: string | null;
  called_at: string | null;
  seated_at: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WaitingStatusResponse = {
  waiting: Waiting;
  ahead_count: number;
};

export type CreateReservationInput = {
  guest_name: string;
  guest_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  request_note?: string;
};

export type CreateWaitingInput = {
  guest_name: string;
  guest_phone: string;
  party_size: number;
};
