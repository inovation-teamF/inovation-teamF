import axios from 'axios';

const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

export const getNearbyPlaces = async (latitude, longitude) => {
  const radius = 1000; // 1km
  const type = 'store'; // 店舗
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    throw new Error('Error fetching nearby places');
  }
};
