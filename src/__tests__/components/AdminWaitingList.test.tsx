import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminWaitingList from '@/components/waiting/AdminWaitingList';
import { mockWaitings } from '@/lib/mocks/data';

describe('AdminWaitingList', () => {
  it('웨이팅 목록이 순서대로 렌더링된다', () => {
    render(
      <AdminWaitingList
        waitings={mockWaitings}
        onCall={vi.fn()}
        onSeat={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('호출 버튼 클릭 시 onCall이 호출된다', async () => {
    const user = userEvent.setup();
    const onCall = vi.fn().mockResolvedValue(undefined);
    render(
      <AdminWaitingList
        waitings={mockWaitings}
        onCall={onCall}
        onSeat={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const callBtns = screen.getAllByRole('button', { name: '호출' });
    await user.click(callBtns[0]);
    expect(onCall).toHaveBeenCalledWith(mockWaitings[0].id);
  });

  it('입장 버튼은 CALLED 상태에서만 활성화된다', () => {
    const waitings = [
      { ...mockWaitings[0], status: 'WAITING' as const },
      { ...mockWaitings[1], status: 'CALLED' as const },
    ];
    render(
      <AdminWaitingList
        waitings={waitings}
        onCall={vi.fn()}
        onSeat={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const seatBtns = screen.getAllByRole('button', { name: '입장' });
    expect(seatBtns[0]).toBeDisabled();
    expect(seatBtns[1]).not.toBeDisabled();
  });
});
