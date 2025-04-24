// app/api/live-crypto/route.ts
import { NextResponse } from 'next/server';

// Extract only name and USD price
interface CryptoQuote {
  USD: {
  price: number;
  };
}

interface CryptoData {
  name: string;
  quote: CryptoQuote;
}

interface ApiResponse {
  data: CryptoData[];
}

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

    const extracted = (data as ApiResponse).data.map((crypto: CryptoData) => ({
      name: crypto.name,
      price: crypto.quote.USD.price,
    }));

    return NextResponse.json(extracted);
  } catch (error) {
    console.error("Server error fetching cryptos:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
