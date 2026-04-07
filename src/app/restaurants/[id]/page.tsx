import { getRestaurant } from '@/lib/api/restaurant';
import RestaurantDetail from '@/components/restaurant/RestaurantDetail';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: Props): Promise<React.ReactElement> {
  const { id } = await params;
  const restaurant = await getRestaurant(id).catch(() => null);
  if (!restaurant) return <ErrorFallback message="식당 정보를 불러올 수 없습니다." />;
  return <RestaurantDetail restaurant={restaurant} />;
}
