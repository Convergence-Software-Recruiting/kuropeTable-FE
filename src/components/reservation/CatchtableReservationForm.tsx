'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateReservationInput } from '@/lib/types';
import type { CatchtableVenueUiData } from '@/lib/types/listing';
import { useReservation } from '@/hooks/useReservation';

interface Props {
  restaurantId: string;
  restaurantName: string;
  ui: CatchtableVenueUiData;
}

function to24Hour(slotLabel: string): string {
  const isAfternoon = slotLabel.includes('오후');
  const isMorning = slotLabel.includes('오전');
  const timePart = slotLabel.replace('오전', '').replace('오후', '').trim();
  const [hourRaw, minuteRaw] = timePart.split(':');
  let hour = Number(hourRaw);
  const minute = Number(minuteRaw ?? '0');

  if (isAfternoon && hour < 12) hour += 12;
  if (isMorning && hour === 12) hour = 0;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export default function CatchtableReservationForm({ restaurantId, restaurantName, ui }: Props): React.ReactElement {
  const router = useRouter();
  const { loading, error, submit } = useReservation();

  const defaultDay = useMemo(() => ui.calendarDays.find((day) => day.enabled)?.date ?? '', [ui.calendarDays]);
  const [selectedDate, setSelectedDate] = useState<string>(defaultDay);
  const [selectedPartySize, setSelectedPartySize] = useState<number>(ui.partySchedules[0]?.partySize ?? 2);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  const selectedPartySchedule = useMemo(
    () =>
      ui.partySchedules.find((schedule) => schedule.partySize === selectedPartySize) ?? ui.partySchedules[0] ?? null,
    [selectedPartySize, ui.partySchedules],
  );

  const availableSlots = selectedPartySchedule?.slots ?? [];
  const selectedDateLabel =
    ui.calendarDays.find((day) => day.date === selectedDate)?.date ?? ui.weeklyStatus[0]?.date ?? selectedDate;

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setLocalMessage(null);

    if (!selectedDate) {
      setLocalMessage('날짜를 선택해 주세요.');
      return;
    }

    if (!selectedTime) {
      setLocalMessage('시간을 선택해 주세요.');
      return;
    }

    const payload: CreateReservationInput = {
      guest_name: '현장 검증 테스터',
      guest_phone: '010-0000-0000',
      reservation_date: selectedDate,
      reservation_time: to24Hour(selectedTime),
      party_size: selectedPartySize,
      request_note: `mock-schedule:${restaurantName}:${selectedDate}:${selectedTime}`,
    };

    const reservation = await submit(restaurantId, payload);
    if (reservation) {
      router.push(`/restaurants/${restaurantId}`);
    }
  };

  return (
    <main className="app-shell motion-enter">
      <form onSubmit={handleSubmit} className="surface-card overflow-hidden p-0">
        <section className="border-b border-[#e6eaf0] px-5 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-3">
            <button type="button" className="text-[1.55rem] font-black text-[#ff4d15]">
              오늘
            </button>
            <h1 className="text-[2rem] font-black tracking-[-0.025em] text-[#1b2330]">{ui.calendarMonthLabel}</h1>
            <p className="text-[1.28rem] font-bold text-[#1f2b37]">전체 ⌄</p>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-y-3 text-center">
            {['일', '월', '화', '수', '목', '금', '토'].map((label) => (
              <p key={label} className="text-[1.15rem] font-semibold text-[#7d8794]">
                {label}
              </p>
            ))}

            {ui.calendarDays.map((day) => {
              const isSelected = day.date === selectedDate;
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => day.enabled && setSelectedDate(day.date)}
                  disabled={!day.enabled}
                  className={[
                    'mx-auto h-12 w-12 rounded-full text-[2rem] font-medium',
                    day.inMonth ? 'text-[#303741]' : 'text-[#a5adb8]',
                    day.enabled ? 'cursor-pointer' : 'cursor-not-allowed',
                    isSelected ? 'bg-[#ff4d15] text-white' : '',
                  ].join(' ')}
                >
                  {day.dayNumber}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4 px-5 py-5 sm:px-7">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ui.partySchedules.map((schedule) => {
              const active = selectedPartySize === schedule.partySize;
              return (
                <button
                  key={schedule.partySize}
                  type="button"
                  onClick={() => {
                    setSelectedPartySize(schedule.partySize);
                    setSelectedTime('');
                  }}
                  className={[
                    'flex-shrink-0 rounded-full border px-5 py-2.5 text-[2rem] font-bold',
                    active ? 'border-[#ff4d15] bg-[#ff4d15] text-white' : 'border-[#b4bcc8] bg-white text-[#2e3742]',
                  ].join(' ')}
                >
                  {schedule.partySize}명
                </button>
              );
            })}
          </div>

          {selectedPartySchedule?.phoneOnlyNotice && availableSlots.length === 0 && (
            <p className="rounded-2xl border border-[#d4dbe6] bg-[#f7f9fc] px-4 py-3 text-[1.15rem] font-semibold text-[#465467]">
              {selectedPartySchedule.phoneOnlyNotice}
            </p>
          )}

          {availableSlots.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {availableSlots.map((slot) => {
                const active = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={[
                      'rounded-xl px-4 py-2.5 text-[1.25rem] font-extrabold transition-colors',
                      active ? 'bg-[#ff4d15] text-white' : 'bg-[#f3f5f8] text-[#2a3440] hover:bg-[#e9edf3]',
                    ].join(' ')}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}

          <div className="rounded-2xl border border-[#d4dbe6] bg-[#f8fafc] px-4 py-3 text-[1.05rem] font-semibold text-[#4d5a6b]">
            선택 일정: {selectedDateLabel || '날짜 미선택'} · {selectedPartySize}명 · {selectedTime || '시간 미선택'}
          </div>

          {(localMessage || error) && (
            <p className="rounded-xl bg-[#ffeef0] px-4 py-3 text-sm text-[#b42329]">{localMessage ?? error}</p>
          )}

          <button
            type="submit"
            disabled={loading || availableSlots.length === 0}
            className="w-full rounded-2xl border border-[#ff4d15] bg-[#ff4d15] px-4 py-3.5 text-[1.45rem] font-black text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? '예약 중...' : '예약 확정'}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/restaurants/${restaurantId}`)}
            className="w-full rounded-2xl border border-[#d0d8e4] bg-white px-4 py-3.5 text-[1.35rem] font-black text-[#1d2936]"
          >
            닫기
          </button>
        </section>
      </form>
    </main>
  );
}
