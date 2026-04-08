import { getRestaurant } from '@/lib/api/restaurant';
import ReservationForm from '@/components/reservation/ReservationForm';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReservationNewPage({ params }: Props): Promise<React.ReactElement> {
  const { id } = await params;
  const restaurant = await getRestaurant(id).catch(() => null);
  if (!restaurant) return <ErrorFallback message="페이지를 불러올 수 없습니다." />;
  if (!restaurant.reservation_enabled) return <ErrorFallback message="이 식당은 예약을 받지 않습니다." />;
  return <ReservationForm restaurantId={id} />;
}
