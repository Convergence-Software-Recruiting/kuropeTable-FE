export function getCityCoverImagePath(cityId: string): string {
  return `/images/cities/${cityId}/cover.jpg`;
}

export function getSpotThumbImagePath(spotId: string): string {
  return `/images/spots/${spotId}/thumb.jpg`;
}

export function getSpotHeroImagePath(spotId: string): string {
  return `/images/spots/${spotId}/hero.jpg`;
}
