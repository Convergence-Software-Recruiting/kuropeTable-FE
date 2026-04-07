import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WaitingRegisterForm from '@/components/waiting/WaitingRegisterForm';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('WaitingRegisterForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });
  it('이름, 전화번호, 인원수 필드가 렌더링된다', () => {
    render(<WaitingRegisterForm restaurantId="1" />);
    expect(screen.getByPlaceholderText('홍길동')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('010-1234-5678')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('폼을 작성하고 제출하면 웨이팅 상태 페이지로 이동한다', async () => {
    const user = userEvent.setup();
    render(<WaitingRegisterForm restaurantId="1" />);

    await user.type(screen.getByPlaceholderText('홍길동'), '테스트유저');
    await user.type(screen.getByPlaceholderText('010-1234-5678'), '010-9999-8888');
    await user.click(screen.getByRole('button', { name: '웨이팅 등록' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/waiting/'));
    });
  });

  it('이름 없이 제출하면 HTML 유효성 검사로 막힌다', async () => {
    const user = userEvent.setup();
    render(<WaitingRegisterForm restaurantId="1" />);

    await user.click(screen.getByRole('button', { name: '웨이팅 등록' }));
    expect(mockPush).not.toHaveBeenCalled();
  });
});
