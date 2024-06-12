import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
  const radius = searchParams.get('radius');
  const type = searchParams.get('type');
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return new Response(JSON.stringify(response.data.results), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch places data' }), { status: 500 });
  }
}

