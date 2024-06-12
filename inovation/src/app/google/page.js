'use client';  // この行をファイルの先頭に追加

import { useEffect, useState } from 'react';
import { getCurrentLocation } from '../utils/geolocation';
import { getNearbyPlaces } from '../utils/googlePlace';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentLocation()
      .then((loc) => {
        setLocation(loc);
        return getNearbyPlaces(loc.latitude, loc.longitude);
      })
      .then((places) => {
        setPlaces(places);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h1>Nearby Places within 1km</h1>
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
      {error && <p>Error: {error}</p>}
      <ul>
        {places.map((place) => (
          <li key={place.place_id}>
            <h2>{place.name}</h2>
            <p>{place.vicinity}</p>
            <p>Rating: {place.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
