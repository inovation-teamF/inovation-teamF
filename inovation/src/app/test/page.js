'use client';  // この行をファイルの先頭に追加

import { useEffect, useState } from 'react';
import { getCurrentLocation } from '../utils/geolocation';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentLocation()
      .then((loc) => {
        setLocation(loc);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h1>Current Location</h1>
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
