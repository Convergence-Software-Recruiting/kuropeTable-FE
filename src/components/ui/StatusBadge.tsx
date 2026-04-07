import Badge from './Badge';
import type { OperatingStatus, ReservationStatus, WaitingStatus } from '@/lib/types';

type Status = OperatingStatus | ReservationStatus | WaitingStatus;

const labelMap: Record<Status, string> = {
  OPEN: '영업중',
  CLOSED: '영업종료',
  BREAK: '브레이크타임',
  PENDING: '대기중',
  CONFIRMED: '확정',
  VISITED: '방문완료',
  CANCELED: '취소',
  WAITING: '대기',
  CALLED: '호출됨',
  SEATED: '입장완료',
};

const colorMap: Record<Status, 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'orange'> = {
  OPEN: 'green',
  CLOSED: 'red',
  BREAK: 'yellow',
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  VISITED: 'green',
  CANCELED: 'gray',
  WAITING: 'orange',
  CALLED: 'blue',
  SEATED: 'green',
};

interface Props {
  status: Status;
}

export default function StatusBadge({ status }: Props): React.ReactElement {
  return <Badge color={colorMap[status]}>{labelMap[status]}</Badge>;
}
