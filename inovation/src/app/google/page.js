'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async (location) => {
      const radius = 1500; // 1.5 km
      const type = 'store';

      try {
        const res = await fetch(`/api/places?location=${location}&radius=${radius}&type=${type}`);
        const data = await res.json();
        setShops(data);
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
            fetchShops(location);
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

    getCurrentLocation();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Nearby Shops</h1>
      <ul>
        {shops.map(shop => (
          <li key={shop.place_id}>
            <h2>{shop.name}</h2>
            <p>{shop.vicinity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
