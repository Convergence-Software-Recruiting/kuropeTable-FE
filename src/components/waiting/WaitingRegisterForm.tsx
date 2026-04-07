'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreateWaitingInput } from '@/lib/types';
import { useCreateWaiting } from '@/hooks/useWaiting';
import Button from '@/components/ui/Button';

interface Props {
  restaurantId: string;
}

export default function WaitingRegisterForm({ restaurantId }: Props): React.ReactElement {
  const router = useRouter();
  const { loading, error, submit } = useCreateWaiting();

  const [form, setForm] = useState<CreateWaitingInput>({
    guest_name: '',
    guest_phone: '',
    party_size: 2,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'party_size' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guest_name.trim() || !form.guest_phone.trim() || form.party_size < 1) return;
    const waiting = await submit(restaurantId, form);
    if (waiting) {
      router.push(`/waiting/${waiting.id}`);
    }
  };

  return (
    <main className="app-shell motion-enter">
      <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-7">
        <p className="page-eyebrow">waiting</p>
        <h1 className="page-title mt-2">웨이팅 등록</h1>
        <p className="page-description">매장 도착 전에 미리 순번을 등록해 빠르게 입장하세요.</p>

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

          <Button type="submit" fullWidth disabled={loading} className="mt-1">
            {loading ? '등록 중...' : '웨이팅 등록'}
          </Button>
        </div>
      </form>
    </main>
  );
}
