'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [shop, setShop] = useState(null);
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('random'); // 初期値はランダム
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(1500); // 初期値は1.5km

  const fetchRandomShop = async (location, radius, type, keyword) => {
    try {
      let url;
      if (keyword === 'random') {
        url = `/api/places?location=${location}&radius=${radius}&type=${type}&keyword=`;
      } else {
        url = `/api/places?location=${location}&radius=${radius}&type=${type}&keyword=${keyword}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      console.log('Fetched data:', data); // デバッグ用にAPIレスポンスをログに出力

      if (data.length > 0) {
        const randomShop = data[Math.floor(Math.random() * data.length)];
        console.log('Random shop selected:', randomShop);
        setShop(randomShop);

        // userLocationが正しく設定されているかを確認
        console.log('Current user location in fetchRandomShop:', userLocation);
        if (userLocation && randomShop.geometry && randomShop.geometry.location) {
          calculateDistanceAndBearing(userLocation, randomShop.geometry.location);
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
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = `${latitude},${longitude}`;
          console.log('Current user location:', latitude, longitude); // デバッグ用に現在位置をログに出力
          setUserLocation({ latitude, longitude });
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
  };

  const calculateDistanceAndBearing = (userLoc, shopLoc) => {
    try {
      if (!userLoc || !shopLoc) {
        throw new Error('User location or shop location is undefined');
      }
      const { latitude: lat1, longitude: lon1 } = userLoc;
      const { lat: lat2, lng: lon2 } = shopLoc;

      console.log('Calculating distance and bearing');
      console.log('User location:', lat1, lon1);
      console.log('Shop location:', lat2, lon2);

      const R = 6371; // 地球の半径 (km)
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // 距離 (km)

      let bearing = Math.atan2(Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180),
                               Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
                               Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon));
      bearing = (bearing * 180 / Math.PI + 360) % 360; // 方位 (度)

      console.log('Calculated distance:', distance);
      console.log('Calculated bearing:', bearing);

      setDistance(distance.toFixed(2)); // 距離を小数点以下2桁に丸める
      setBearing(bearing.toFixed(2)); // 方位を小数点以下2桁に丸める
    } catch (error) {
      console.error('Error calculating distance and bearing:', error);
      setError('Failed to calculate distance and bearing');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const location = `${userLocation.latitude},${userLocation.longitude}`;
      fetchRandomShop(location, selectedDistance, 'restaurant|cafe|bar', selectedGenre);
    }
  }, [userLocation, selectedGenre, selectedDistance]);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleDistanceChange = (event) => {
    setSelectedDistance(event.target.value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Random Nearby Shop</h1>
      <div>
        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="random">Random</option>
          <option value="restaurant">Japanese (和食)</option>
          <option value="chinese">Chinese (中華)</option>
          <option value="western">Western (洋食)</option>
        </select>
      </div>
      <div>
        <label htmlFor="distance">Distance (meters):</label>
        <input type="number" id="distance" value={selectedDistance} onChange={handleDistanceChange} />
      </div>
      {shop ? (
        <div key={shop.place_id}>
          <h2>{shop.name}</h2>
          <p>{shop.vicinity}</p>
          {userLocation ? (
            <p>
              Distance: {distance} km, Bearing: {bearing}° from your location
            </p>
          ) : (
            <p>Loading user location...</p>
          )}
        </div>
      ) : (
        <p>No shop found</p>
      )}
    </div>
  );
}
