# Image Drop Guide

이미지는 아래 규칙대로만 넣으면 화면에 자동 반영됩니다.

## 1) 도시 카드 이미지
- 경로: `public/images/cities/<cityId>/cover.jpg`
- 사용 화면: 메인 > 국가별 분류 > 도시 카드 상단
- 권장 비율/해상도: 16:9, 최소 1200x675

도시 ID 목록:
- `heidelberg`
- `berlin`
- `dresden`
- `prague`
- `cesky-krumlov`
- `salzburg`
- `salzkammergut`
- `vienna`
- `budapest`

## 2) 장소 카드 썸네일 이미지
- 경로: `public/images/spots/<spotId>/thumb.jpg`
- 사용 화면: 메인 > 유명 장소 목데이터 리스트 카드
- 권장 비율/해상도: 1:1, 최소 800x800

## 3) 장소 상세 히어로 이미지
- 경로: `public/images/spots/<spotId>/hero.jpg`
- 사용 화면: 장소 상세(레스토랑 진입) 상단 히어로
- 권장 비율/해상도: 16:9, 최소 1600x900

spot ID 목록:
- `spot-prg-oldtown`
- `spot-prg-lokal`
- `spot-bud-gozsdu`
- `spot-szg-stpeter`
- `spot-hdb-europcar`
- `spot-drs-sixt`
- `spot-ckr-jelenka`
- `spot-skg-badischl`
- `spot-ber-maybachufer`
- `spot-ber-rewe-hackescher`
- `spot-vie-naschmarkt`
- `spot-vie-brunnenmarkt`

## 4) 없을 때 동작
이미지가 없는 경우에도 기존 그라디언트 배경으로 자동 fallback 됩니다.
즉, 모든 이미지를 한 번에 넣지 않아도 서비스는 깨지지 않습니다.
