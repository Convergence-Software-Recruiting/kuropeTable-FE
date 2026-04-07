import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyWaitingStatus from '@/components/waiting/MyWaitingStatus';
import type { WaitingStatusResponse } from '@/lib/types';
import { mockWaitings } from '@/lib/mocks/data';

const baseData: WaitingStatusResponse = {
  waiting: mockWaitings[0],
  ahead_count: 0,
};

describe('MyWaitingStatus', () => {
  it('현재 순번과 앞 팀 수가 표시된다', () => {
    const data: WaitingStatusResponse = { ...baseData, ahead_count: 3 };
    render(<MyWaitingStatus data={data} onCancel={vi.fn()} />);
    expect(screen.getByText(`#${data.waiting.waiting_number}`)).toBeInTheDocument();
    expect(screen.getByText(/3팀/)).toBeInTheDocument();
  });

  it('status=CALLED이면 호출 알림이 표시된다', () => {
    const data: WaitingStatusResponse = {
      waiting: { ...mockWaitings[0], status: 'CALLED' },
      ahead_count: 0,
    };
    render(<MyWaitingStatus data={data} onCancel={vi.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/입장 호출/)).toBeInTheDocument();
  });

  it('앞 팀이 threshold 이하이고 onsite_verified=false이면 현장 인증 안내가 표시된다', () => {
    const data: WaitingStatusResponse = {
      waiting: { ...mockWaitings[0], waiting_number: 5, onsite_verified: false, status: 'WAITING' },
      ahead_count: 2,
    };
    render(<MyWaitingStatus data={data} onCancel={vi.fn()} />);
    expect(screen.getByText(/현장 인증/)).toBeInTheDocument();
  });

  it('status=WAITING이면 취소 버튼이 표시된다', () => {
    render(<MyWaitingStatus data={baseData} onCancel={vi.fn()} />);
    expect(screen.getByRole('button', { name: '웨이팅 취소' })).toBeInTheDocument();
  });
});
