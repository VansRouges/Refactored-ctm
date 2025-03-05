export const fetchCryptocurrencies = async () => {
    try {
      const response = await fetch("/api/fetch-crypto", {
        method: "GET",
        cache: "no-store", // Ensures fresh data (optional)
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch cryptocurrency data");
      }
  
      const data = await response.json();
      return data.data; // Extract array of cryptocurrencies
    } catch (error) {
      console.error("Error fetching cryptocurrencies:", error);
      throw error;
    }
  };
  