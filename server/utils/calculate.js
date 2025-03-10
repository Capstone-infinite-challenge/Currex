// 거리 계산 함수 (위도, 경도로 거리 계산)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리 반환 (km)
}

//중간 위도, 경도 계산
function calculateMiddlePlace(lat1, lon1, lat2, lon2) {
  console.log('받은 위도 경도', lat1, lat2, lon1, lon2);

  // parseFloat을 사용하여 값이 문자열이라면 숫자로 변환
  lat1 = parseFloat(lat1);
  lon1 = parseFloat(lon1);
  lat2 = parseFloat(lat2);
  lon2 = parseFloat(lon2);

  const mLat = (lat1 + lat2) / 2;
  const mLon = (lon1 + lon2) / 2; 
  console.log('중간 위도 경도 계산 결과', mLat, mLon);
  return { middleLatitude: mLat, middleLongitude: mLon };
}

export default {
  calculateDistance,
  calculateMiddlePlace
};