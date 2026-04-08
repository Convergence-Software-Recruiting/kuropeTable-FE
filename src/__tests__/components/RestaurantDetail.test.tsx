import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RestaurantDetail from '@/components/restaurant/RestaurantDetail';
import { mockRestaurant } from '@/lib/mocks/data';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('RestaurantDetail', () => {
  it('식당 기본 정보가 렌더링된다', () => {
    render(<RestaurantDetail restaurant={mockRestaurant} />);
    expect(screen.getByText(mockRestaurant.name)).toBeInTheDocument();
    expect(screen.getByText(mockRestaurant.description)).toBeInTheDocument();
    expect(screen.getByText(/영업중/)).toBeInTheDocument();
  });

  it('reservation_enabled=false이면 예약 버튼이 비활성화된다', () => {
    const restaurant = { ...mockRestaurant, reservation_enabled: false };
    render(<RestaurantDetail restaurant={restaurant} />);
    const btn = screen.getByRole('button', { name: '예약 불가' });
    expect(btn).toBeDisabled();
  });

  it('waiting_enabled=false이면 대기 현황 버튼이 없다', () => {
    const restaurant = { ...mockRestaurant, waiting_enabled: false };
    render(<RestaurantDetail restaurant={restaurant} />);
    expect(screen.queryByText('대기 현황 보기')).not.toBeInTheDocument();
  });

  it('operating_status=CLOSED이면 예약 버튼이 비활성화된다', () => {
    const restaurant = { ...mockRestaurant, operating_status: 'CLOSED' as const };
    render(<RestaurantDetail restaurant={restaurant} />);
    expect(screen.getByText(/영업종료/)).toBeInTheDocument();
    const reservationLink = screen.queryByRole('link', { name: '예약하기' });
    if (reservationLink) {
      const btn = reservationLink.querySelector('button');
      expect(btn).toBeDisabled();
    }
  });
});
