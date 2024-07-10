// app/api/store-location/route.js

export async function GET(request) {
    const storeLocation = {
      latitude: 35.1814,  // 例: 名古屋駅の緯度
      longitude: 136.9066 // 例: 名古屋駅の経度
    };
    
    return new Response(JSON.stringify(storeLocation), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  