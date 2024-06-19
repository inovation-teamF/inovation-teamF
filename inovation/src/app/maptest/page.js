'use client';

import { useSearchParams } from 'next/navigation';

export default function ShopDetails() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const vicinity = searchParams.get('vicinity');
  const distance = searchParams.get('distance');
  const bearing = searchParams.get('bearing');

  if (!name) {
    return <p>No shop data available</p>;
  }

  return (
    <div>
      <h1>Shop Details</h1>
      <h2>{name}</h2>
      <p>{vicinity}</p>
      <p>Distance: {distance} km</p>
      <p>Bearing: {bearing}°</p>
    </div>
  );
}
