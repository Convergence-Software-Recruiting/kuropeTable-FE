import Link from 'next/link';

const quickLinks = [
  {
    title: '식당 상세 보기',
    description: '예약/웨이팅 가능한 정보를 한 번에 확인합니다.',
    href: '/restaurants/1',
    cta: '고객 화면 열기',
  },
  {
    title: '웨이팅 관리',
    description: '관리자 화면에서 호출/입장/취소를 처리합니다.',
    href: '/admin/restaurants/1/waiting',
    cta: '관리자 웨이팅',
  },
  {
    title: '예약 관리',
    description: '예약 상태를 확정, 방문완료, 취소로 관리합니다.',
    href: '/admin/restaurants/1/reservations',
    cta: '관리자 예약',
  },
];

export default function Home(): React.ReactElement {
  return (
    <main className="app-shell motion-enter">
      <section className="surface-card overflow-hidden p-7 sm:p-9">
        <p className="page-eyebrow">kurope table</p>
        <h1 className="page-title mt-2">예약과 웨이팅을 한 화면 흐름으로 정리한 매장 운영 UI</h1>
        <p className="page-description">
          토스 스타일의 정보 우선 구조로, 고객과 관리자 모두가 빠르게 다음 행동을 선택할 수 있게 구성했습니다.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {quickLinks.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`surface-soft motion-enter rounded-2xl p-4 transition-all hover:border-[#b6cdf3] hover:bg-[#eef4ff] ${
                index === 1 ? 'motion-enter-delay-1' : index === 2 ? 'motion-enter-delay-2' : ''
              }`}
            >
              <h2 className="text-sm font-bold text-[var(--text-strong)]">{item.title}</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{item.description}</p>
              <p className="mt-4 text-sm font-semibold text-[var(--primary-strong)]">{item.cta} →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
