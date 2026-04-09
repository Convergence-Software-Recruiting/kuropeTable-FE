const CITY_COVER_EXTENSION: Record<string, 'jpg' | 'jpeg' | 'webp'> = {
  berlin: 'jpeg',
  budapest: 'webp',
  'cesky-krumlov': 'jpeg',
  dresden: 'jpeg',
  heidelberg: 'jpeg',
  prague: 'jpeg',
  salzburg: 'jpeg',
  salzkammergut: 'jpeg',
  vienna: 'jpeg',
};

const SPOT_IMAGE_EXTENSION: Record<string, 'jpg' | 'jpeg' | 'webp'> = {
  'spot-prg-oldtown': 'jpg',
  'spot-prg-lokal': 'jpeg',
  'spot-bud-gozsdu': 'jpeg',
  'spot-szg-stpeter': 'jpeg',
  'spot-hdb-europcar': 'webp',
  'spot-drs-sixt': 'webp',
  'spot-ckr-jelenka': 'jpg',
  'spot-skg-badischl': 'jpeg',
  'spot-ber-maybachufer': 'jpeg',
  'spot-ber-rewe-hackescher': 'webp',
  'spot-vie-naschmarkt': 'jpeg',
  'spot-vie-brunnenmarkt': 'jpeg',
};

export function getCityCoverImagePath(cityId: string): string {
  const ext = CITY_COVER_EXTENSION[cityId] ?? 'jpg';
  return `/images/cities/${cityId}/cover.${ext}`;
}

export function getSpotThumbImagePath(spotId: string): string {
  const ext = SPOT_IMAGE_EXTENSION[spotId] ?? 'jpg';
  return `/images/spots/${spotId}/thumb.${ext}`;
}

export function getSpotHeroImagePath(spotId: string): string {
  const ext = SPOT_IMAGE_EXTENSION[spotId] ?? 'jpg';
  return `/images/spots/${spotId}/hero.${ext}`;
}
