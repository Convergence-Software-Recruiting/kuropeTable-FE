'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateReservationInput } from '@/lib/types';
import { useReservation } from '@/hooks/useReservation';
import Button from '@/components/ui/Button';
import { mockRestaurantListingMap } from '@/lib/mocks/listingData';
import { getCatchtableVenueUiData } from '@/lib/mocks/catchtableUiData';
import CatchtableReservationForm from '@/components/reservation/CatchtableReservationForm';

interface Props {
  restaurantId: string;
}

function LegacyReservationForm({ restaurantId }: Props): React.ReactElement {
  const router = useRouter();
  const { loading, error, submit } = useReservation();

  const [form, setForm] = useState<CreateReservationInput>({
    guest_name: '',
    guest_phone: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    request_note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'party_size' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reservation = await submit(restaurantId, form);
    if (reservation) {
      router.push(`/restaurants/${restaurantId}`);
    }
  };

  return (
    <main className="app-shell motion-enter">
      <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-7">
        <p className="page-eyebrow">reservation</p>
        <h1 className="page-title mt-2">예약 신청</h1>
        <p className="page-description">원하는 날짜와 시간으로 방문 일정을 등록하세요.</p>

        {error && <p className="mt-5 rounded-xl bg-[#ffeef0] px-4 py-3 text-sm text-[#b42329]">{error}</p>}

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="label-text">이름 *</span>
            <input
              name="guest_name"
              value={form.guest_name}
              onChange={handleChange}
              required
              placeholder="홍길동"
              className="input-field"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="label-text">전화번호 *</span>
            <input
              name="guest_phone"
              value={form.guest_phone}
              onChange={handleChange}
              required
              placeholder="010-1234-5678"
              className="input-field"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="label-text">예약 날짜 *</span>
              <input
                type="date"
                name="reservation_date"
                value={form.reservation_date}
                onChange={handleChange}
                required
                className="input-field"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="label-text">예약 시간 *</span>
              <input
                type="time"
                name="reservation_time"
                value={form.reservation_time}
                onChange={handleChange}
                required
                className="input-field"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="label-text">인원수 *</span>
            <input
              type="number"
              name="party_size"
              value={form.party_size}
              onChange={handleChange}
              min={1}
              max={20}
              required
              className="input-field"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="label-text">요청 사항</span>
            <textarea
              name="request_note"
              value={form.request_note}
              onChange={handleChange}
              rows={3}
              placeholder="특별 요청 사항을 입력해주세요"
              className="input-field"
            />
          </label>

          <Button type="submit" fullWidth disabled={loading} className="mt-1">
            {loading ? '예약 중...' : '예약 신청'}
          </Button>
        </div>
      </form>
    </main>
  );
}

export default function ReservationForm({ restaurantId }: Props): React.ReactElement {
  const listing = mockRestaurantListingMap.get(restaurantId);
  const catchtableUi = listing?.serviceTrack === 'catchtable' ? getCatchtableVenueUiData(restaurantId) : null;

  if (listing && catchtableUi) {
    return <CatchtableReservationForm restaurantId={restaurantId} restaurantName={listing.name} ui={catchtableUi} />;
  }

  return <LegacyReservationForm restaurantId={restaurantId} />;
}
