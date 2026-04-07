'use client';

import Link from 'next/link';
import type { Restaurant } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantDetail({ restaurant }: Props): React.ReactElement {
  const isClosed = restaurant.operating_status === 'CLOSED';

  return (
    <main className="app-shell motion-enter">
      <section className="surface-card overflow-hidden p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <StatusBadge status={restaurant.operating_status} />
          <p className="text-xs font-semibold uppercase tracking-[0.09em] text-[var(--text-muted)]">
            평균 체류 {restaurant.avg_dining_minutes}분
          </p>
        </div>

        <h1 className="page-title">{restaurant.name}</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{restaurant.city} · {restaurant.address}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="surface-soft rounded-xl px-4 py-3 text-sm text-[var(--text-default)]">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">문의 전화</p>
            <p className="mt-1 font-semibold text-[var(--text-strong)]">{restaurant.phone}</p>
          </div>
          <div className="surface-soft rounded-xl px-4 py-3 text-sm text-[var(--text-default)]">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">서비스 상태</p>
            <p className="mt-1 font-semibold text-[var(--text-strong)]">
              예약 {restaurant.reservation_enabled ? '가능' : '불가'} · 웨이팅 {restaurant.waiting_enabled ? '가능' : '불가'}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[var(--text-default)]">{restaurant.description}</p>
      </section>

      <section className="surface-card motion-enter motion-enter-delay-1 mt-4 p-5 sm:p-6">
        <p className="mb-4 text-sm font-semibold text-[var(--text-strong)]">바로 진행하기</p>
        <div className="flex flex-col gap-2.5">
          {restaurant.reservation_enabled ? (
            <Link href={`/restaurants/${restaurant.id}/reservation/new`}>
              <Button fullWidth disabled={isClosed}>
                예약하기
              </Button>
            </Link>
          ) : (
            <Button fullWidth disabled aria-label="예약 불가">
              예약 불가
            </Button>
          )}

          {restaurant.waiting_enabled && (
            <>
              <Link href={`/restaurants/${restaurant.id}/waiting`}>
                <Button variant="secondary" fullWidth>
                  대기 현황 보기
                </Button>
              </Link>
              {restaurant.remote_waiting_enabled && !isClosed && (
                <Link href={`/restaurants/${restaurant.id}/waiting/new`}>
                  <Button variant="ghost" fullWidth>
                    웨이팅 등록
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
