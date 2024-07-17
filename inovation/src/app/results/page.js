'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';
import Play from './play';
import Head from 'next/head';
import styles from './results.module.css'; // モジュールCSSとしてインポート

function ResultsComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const distanceParam = searchParams.get('distance');
  const genreParam = searchParams.get('genre');

  const getDistanceValue = (param) => {
    if (param == 1) return 1500;
    if (param == 2) return 3000;
    if (param == 3) return 5000;
    return 1500; // デフォルト値
  };

  const getGenreValue = (param) => {
    if (param == 4) return 'wasyoku';
    if (param == 5) return 'western';
    if (param == 6) return 'chinese';
    if (param == 7) return 'random';
    return 'random'; // デフォルト値
  };

  const initialDistance = getDistanceValue(distanceParam);
  const genre = getGenreValue(genreParam);

  const [shop, setShop] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showCoordinates, setShowCoordinates] = useState(false); // プルダウン表示の状態

  const fetchRandomShop = useCallback(async (location, radius, type, keyword) => {
    try {
      const url = `/api/places?location=${location}&radius=${radius}&type=${type}&keyword=${keyword === 'random' ? '' : keyword}&opennow=true`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const randomShop = data[Math.floor(Math.random() * data.length)];
        console.log(`ランダムに選ばれた店: ${randomShop.name}`); // 店の名前を出力
        console.log(`ランダムに選ばれた店の位置: ${randomShop.geometry.location.lat}, ${randomShop.geometry.location.lng}`);
        console.log(`現在の位置: ${location}`);
        setShop(randomShop);

        if (userLocation && randomShop.geometry && randomShop.geometry.location) {
          const { distance, bearing } = calculateDistanceAndBearing(userLocation, randomShop.geometry.location);
          setCalculatedDistance(distance);
          setBearing(bearing);
        } else {
          setError('距離と方位の計算に失敗しました：位置情報が不足しています');
        }
      } else {
        setError('店が見つかりませんでした');
      }
      setLoading(false);
    } catch (error) {
      console.error('店の取得エラー:', error);
      setError('店の取得に失敗しました');
      setLoading(false);
    }
  }, [userLocation]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLoading(false);
        },
        (error) => {
          console.error('現在位置の取得エラー:', error);
          setError('現在位置の取得に失敗しました');
          setLoading(false);
        }
      );
    } else {
      setError('このブラウザではジオロケーションがサポートされていません');
      setLoading(false);
    }
  }, []);

  const calculateDistanceAndBearing = (userLoc, shopLoc) => {
    try {
      if (!userLoc || !shopLoc) {
        throw new Error('ユーザーの位置または店の位置が未定義です');
      }
      const { latitude: lat1, longitude: lon1 } = userLoc;
      const { lat: lat2, lng: lon2 } = shopLoc;

      const R = 6371; // 地球の半径（キロメートル）
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      let bearing = Math.atan2(Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180),
                               Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
                               Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon));
      bearing = (bearing * 180 / Math.PI + 360) % 360;

      return { distance: distance.toFixed(2), bearing: bearing.toFixed(2) };
    } catch (error) {
      console.error('距離と方位の計算エラー:', error);
      setError('距離と方位の計算に失敗しました');
      return { distance: null, bearing: null };
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    if (userLocation && shop) {
      const { distance, bearing } = calculateDistanceAndBearing(userLocation, shop.geometry.location);
      setCalculatedDistance(distance);
      setBearing(bearing);
    }
  }, [userLocation, shop]);

  useEffect(() => {
    if (userLocation && !shop) {
      const location = `${userLocation.latitude},${userLocation.longitude}`;
      fetchRandomShop(location, initialDistance, 'restaurant|cafe|bar', genre);
    }
  }, [userLocation, genre, initialDistance, fetchRandomShop]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // モダンブラウザのために必要
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleGoToResult = () => {
    if (shop) {
      router.push(`/result?shopName=${encodeURIComponent(shop.name)}`);
    }
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleChangeShop = () => {
    window.location.href = '/';
  };

  const handleGoal = () => {
    if (shop) {
      router.push(`/result?shopName=${encodeURIComponent(shop.name)}`);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nomad Eats - 結果</title>
        <meta name="description" content="あなたの周りのノマドに優しい食べ物を見つけましょう" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <Play distance={calculatedDistance} angle={bearing} shop={shop} />
        </div>
        <a
          href="https://compass.onl.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="button_web"
        >
          webコンパス
        </a>
        <button className={styles.button} onClick={getCurrentLocation}>更新</button>
        
        <div className="buttons">
          <button className="button" onClick={handleChangeShop}>他の店にする</button>
          <button className="button" onClick={handleGoal}>ゴール！</button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://creator.cplaza.engg.nagoya-u.ac.jp/creative/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            inovation teamF
          </span>
        </a>
      </footer>
      
      {shop && shop.geometry && shop.geometry.location && (
        <div className={styles.coordinates}>
          <button 
            className={styles.toggleButton} 
            onClick={() => setShowCoordinates(!showCoordinates)}
          >
            {showCoordinates ? '緯度・経度を隠す' : '緯度・経度を表示'}
          </button>
          {showCoordinates && (
            <div>
              <p>緯度: {shop.geometry.location.lat}</p>
              <p>経度: {shop.geometry.location.lng}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}
