'use client';

import { useState, useEffect, useCallback } from 'react';
import Play from './play';

export default function Home() {
  const [shop, setShop] = useState(null);
  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('random');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(1500);

  const fetchRandomShop = useCallback(async (location, radius, type, keyword) => {
    try {
      const url = `/api/places?location=${location}&radius=${radius}&type=${type}&keyword=${keyword === 'random' ? '' : keyword}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const randomShop = data[Math.floor(Math.random() * data.length)];
        setShop(randomShop);

        if (userLocation && randomShop.geometry && randomShop.geometry.location) {
          const { distance, bearing } = calculateDistanceAndBearing(userLocation, randomShop.geometry.location);
          setDistance(distance);
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
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
    if (userLocation) {
      const location = `${userLocation.latitude},${userLocation.longitude}`;
      fetchRandomShop(location, selectedDistance, 'restaurant|cafe|bar', selectedGenre);
    }
  }, [userLocation, selectedGenre, selectedDistance, fetchRandomShop]);

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
      <div>
        <label>
          Genre:
          <select value={selectedGenre} onChange={handleGenreChange}>
            <option value="random">Random</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="bar">Bar</option>
          </select>
        </label>
        <label>
          Distance:
          <input
            type="number"
            value={selectedDistance}
            onChange={handleDistanceChange}
          />
        </label>
        <div>
          <Play distance={distance} angle={bearing}/>
        </div>
      </div>
    </div>
  );
}

