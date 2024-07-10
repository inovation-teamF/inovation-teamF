import fetch from 'node-fetch';

// 地球の半径 (km)
const EARTH_RADIUS = 6371;

// 度からラジアンへの変換関数
const toRadians = (degrees) => degrees * Math.PI / 180;

// 距離と方位を計算する関数
const calculateDistanceAndBearing = (userLoc, shopLoc) => {
  const { latitude: lat1, longitude: lon1 } = userLoc;
  const { lat: lat2, lng: lon2 } = shopLoc;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS * c;

  let bearing = Math.atan2(Math.sin(dLon) * Math.cos(toRadians(lat2)),
                           Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
                           Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon));
  bearing = (bearing * 180 / Math.PI + 360) % 360;

  return { distance: distance.toFixed(2), bearing: bearing.toFixed(2) };
};

// 環境変数からAPIキーを取得
const fetchRandomShop = async (location, radius, type, keyword) => {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&keyword=${keyword}&key=${API_KEY}`;
    console.log(`Fetching URL: ${url}`); // リクエストURLをログに出力
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2)); // APIレスポンスをログに出力

    if (data.results && data.results.length > 0) {
      const randomShop = data.results[Math.floor(Math.random() * data.results.length)];
      return randomShop;
    } else {
      throw new Error('No shops found');
    }
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};

// GETリクエストのハンドラー
export async function GET(request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  
  const userLocation = {
    latitude: params.get('latitude') || 35.1814, // デフォルト値: 名古屋駅の緯度
    longitude: params.get('longitude') || 136.9066 // デフォルト値: 名古屋駅の経度
  };
  const location = `${userLocation.latitude},${userLocation.longitude}`;
  const radius = params.get('radius') || 1500;
  const type = params.get('type') || 'cafe';
  const keyword = params.get('keyword') || 'wasyoku';

  try {
    const shop = await fetchRandomShop(location, radius, type, keyword);
    const { distance, bearing } = calculateDistanceAndBearing(userLocation, shop.geometry.location);

    const response = {
      shop,
      distance,
      bearing
    };

    console.log('Response:', JSON.stringify(response, null, 2)); // 完全なレスポンスをログに出力

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
