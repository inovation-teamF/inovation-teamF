'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      const location = '35.6895,139.6917'; // Tokyo coordinates
      const radius = 1500; // 1.5 km
      const type = 'store';

      try {
        const res = await fetch(`/api/places?location=${location}&radius=${radius}&type=${type}`);
        const data = await res.json();
        setShops(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
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
