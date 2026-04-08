import { getRestaurant } from '@/lib/api/restaurant';
import WaitingRegisterForm from '@/components/waiting/WaitingRegisterForm';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WaitingNewPage({ params }: Props): Promise<React.ReactElement> {
  const { id } = await params;
  const restaurant = await getRestaurant(id).catch(() => null);
  if (!restaurant) return <ErrorFallback message="페이지를 불러올 수 없습니다." />;
  if (!restaurant.remote_waiting_enabled) return <ErrorFallback message="이 식당은 원격 웨이팅 등록을 지원하지 않습니다." />;
  return <WaitingRegisterForm restaurantId={id} />;
}
