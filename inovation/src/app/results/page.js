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

  const fetchRandomShop = useCallback(async (location, radius, type, keyword) => {
    try {
      const url = `/api/places?location=${location}&radius=${radius}&type=${type}&keyword=${keyword === 'random' ? '' : keyword}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const randomShop = data[Math.floor(Math.random() * data.length)];
        console.log(`Randomly selected shop: ${randomShop.name}`); // 店の名前を出力
        console.log(`Randomly selected shop location: ${randomShop.geometry.location.lat}, ${randomShop.geometry.location.lng}`);
        console.log(`Current location: ${location}`);
        setShop(randomShop);

        if (userLocation && randomShop.geometry && randomShop.geometry.location) {
          const { distance, bearing } = calculateDistanceAndBearing(userLocation, randomShop.geometry.location);
          setCalculatedDistance(distance);
          setBearing(bearing);
        } else {
          setError('Failed to calculate distance and bearing: Location data missing');
        }
      } else {
        setError('No shops found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setError('Failed to fetch shops');
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
          console.error('Error getting current location:', error);
          setError('Failed to get current location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
    }
  }, []);

  const calculateDistanceAndBearing = (userLoc, shopLoc) => {
    try {
      if (!userLoc || !shopLoc) {
        throw new Error('User location or shop location is undefined');
      }
      const { latitude: lat1, longitude: lon1 } = userLoc;
      const { lat: lat2, lng: lon2 } = shopLoc;

      const R = 6371; // Radius of the Earth in kilometers
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
      console.error('Error calculating distance and bearing:', error);
      setError('Failed to calculate distance and bearing');
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Nomad Eats - Results</title>
        <meta name="description" content="Find the best nomad-friendly food around you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <Play distance={calculatedDistance} angle={bearing} shop={shop} />
        </div>
        <button onClick={handleGoToResult}>この店に行く</button>
        <button className={styles.button} onClick={getCurrentLocation}>Update Location</button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://yourcompany.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            invation teamF
          </span>
        </a>
      </footer>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}
