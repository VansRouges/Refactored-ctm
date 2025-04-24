// app/api/live-crypto/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
  const headers = {
    'X-CMC_PRO_API_KEY': 'a8e86a57-c8a7-4fe3-9c18-d2f9c5ca1f67',
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from CoinMarketCap' }, { status: res.status });
    }

    const data = await res.json();

    // Extract only name and USD price
    const extracted = data.data.map((crypto: any) => ({
      name: crypto.name,
      price: crypto.quote.USD.price,
    }));

    return NextResponse.json(extracted);
  } catch (error) {
    console.error("Server error fetching cryptos:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
