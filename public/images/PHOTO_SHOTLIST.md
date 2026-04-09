# Photo Shotlist (2026-04-09)

내일 구글링해서 바로 가져올 수 있게, **현재 코드에서 실제로 쓰는 경로 기준**으로 정리한 리스트입니다.

## 0) 먼저 이 규칙만 지키면 됨
- 도시: `public/images/cities/<cityId>/cover.<확장자>`
- 스팟 카드 썸네일: `public/images/spots/<spotId>/thumb.<확장자>`
- 스팟 상세 히어로: `public/images/spots/<spotId>/hero.<확장자>`
- 포맷: `jpg/jpeg/webp` (파일별 적용)
- 권장 해상도:
  - `cover.jpg`: 1600x900 이상
  - `thumb.jpg`: 1200x1200 이상 (정사각형)
  - `hero.jpg`: 1920x1080 이상

## 1) 도시 커버 (9장)

1. `public/images/cities/heidelberg/cover.jpg`
   - 검색어: `Heidelberg old town aerial river bridge`
2. `public/images/cities/berlin/cover.jpg`
   - 검색어: `Berlin street market neighborhood lifestyle`
3. `public/images/cities/dresden/cover.jpg`
   - 검색어: `Dresden city skyline Elbe river`
4. `public/images/cities/prague/cover.jpg`
   - 검색어: `Prague old town square evening`
5. `public/images/cities/cesky-krumlov/cover.jpg`
   - 검색어: `Cesky Krumlov castle town panorama`
6. `public/images/cities/salzburg/cover.jpg`
   - 검색어: `Salzburg old town night street`
7. `public/images/cities/salzkammergut/cover.jpg`
   - 검색어: `Salzkammergut lake village scenic road`
8. `public/images/cities/vienna/cover.jpg`
   - 검색어: `Vienna market street food district`
9. `public/images/cities/budapest/cover.jpg`
   - 검색어: `Budapest nightlife district restaurant street`

## 2) 스팟 이미지 (총 24장 = thumb 12 + hero 12)

### A. Catchtable 트랙
1. `spot-prg-oldtown`
   - `public/images/spots/spot-prg-oldtown/thumb.jpg`
   - `public/images/spots/spot-prg-oldtown/hero.jpg`
   - 검색어: `Prague Old Town Square restaurant terrace`
2. `spot-prg-lokal`
   - `public/images/spots/spot-prg-lokal/thumb.jpg`
   - `public/images/spots/spot-prg-lokal/hero.jpg`
   - 검색어: `Lokál Dlouháá Prague interior`
3. `spot-bud-gozsdu`
   - `public/images/spots/spot-bud-gozsdu/thumb.jpg`
   - `public/images/spots/spot-bud-gozsdu/hero.jpg`
   - 검색어: `Gozsdu Court Budapest restaurant alley night`
4. `spot-szg-stpeter`
   - `public/images/spots/spot-szg-stpeter/thumb.jpg`
   - `public/images/spots/spot-szg-stpeter/hero.jpg`
   - 검색어: `St. Peter Stiftskulinarium Salzburg interior`

### B. Rentcar 트랙
5. `spot-hdb-europcar`
   - `public/images/spots/spot-hdb-europcar/thumb.jpg`
   - `public/images/spots/spot-hdb-europcar/hero.jpg`
   - 검색어: `Europcar Heidelberg station office`
6. `spot-drs-sixt`
   - `public/images/spots/spot-drs-sixt/thumb.jpg`
   - `public/images/spots/spot-drs-sixt/hero.jpg`
   - 검색어: `Sixt Dresden rental counter`
7. `spot-ckr-jelenka`
   - `public/images/spots/spot-ckr-jelenka/thumb.jpg`
   - `public/images/spots/spot-ckr-jelenka/hero.jpg`
   - 검색어: `Cesky Krumlov P1 Jelenka parking lot`
8. `spot-skg-badischl`
   - `public/images/spots/spot-skg-badischl/thumb.jpg`
   - `public/images/spots/spot-skg-badischl/hero.jpg`
   - 검색어: `Bad Ischl Bahnhof transport hub`

### C. Grocery 트랙
9. `spot-ber-maybachufer`
   - `public/images/spots/spot-ber-maybachufer/thumb.jpg`
   - `public/images/spots/spot-ber-maybachufer/hero.jpg`
   - 검색어: `Maybachufer market Berlin stalls`
10. `spot-ber-rewe-hackescher`
   - `public/images/spots/spot-ber-rewe-hackescher/thumb.jpg`
   - `public/images/spots/spot-ber-rewe-hackescher/hero.jpg`
   - 검색어: `REWE Hackescher Markt Berlin supermarket`
11. `spot-vie-naschmarkt`
   - `public/images/spots/spot-vie-naschmarkt/thumb.jpg`
   - `public/images/spots/spot-vie-naschmarkt/hero.jpg`
   - 검색어: `Naschmarkt Vienna market food`
12. `spot-vie-brunnenmarkt`
   - `public/images/spots/spot-vie-brunnenmarkt/thumb.jpg`
   - `public/images/spots/spot-vie-brunnenmarkt/hero.jpg`
   - 검색어: `Brunnenmarkt Vienna street market`

## 3) 우선순위 (내일 시간 부족하면)
1. 캐치테이블 4개 스팟의 `thumb.jpg`, `hero.jpg` 먼저 (총 8장)
2. 도시 커버 9장
3. 나머지 8개 스팟 `thumb.jpg`, `hero.jpg` (총 16장)

## 4) 체크리스트
- [ ] 도시 9장 완료
- [ ] 캐치테이블 스팟 8장 완료
- [ ] 나머지 스팟 16장 완료
- [ ] 전체 파일명/경로 규칙 재확인

## 5) 현재 업로드 확장자 참고
- 도시: `berlin/prague/vienna/...`는 `cover.jpeg`, `budapest`는 `cover.webp`
- 스팟: 파일별로 `thumb/hero` 확장자가 `jpg/jpeg/webp`로 혼합되어 있음
