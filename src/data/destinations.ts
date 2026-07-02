export type PopularDestination = {
  iata: string;
  city: string;
  country: string;
  countryCode: string;
  imageKeyword: string;
  avgPriceBRL: number;
  avgMilesLatam: number;
  tags: string[];
  highlight: string;
};

export const popularDestinations: PopularDestination[] = [
  {
    iata: "LIS",
    city: "Lisboa",
    country: "Portugal",
    countryCode: "PT",
    imageKeyword: "lisbon",
    avgPriceBRL: 3800,
    avgMilesLatam: 55000,
    tags: ["Europa", "Cultura", "Gastronomia"],
    highlight: "Voos diretos de GRU",
  },
  {
    iata: "MIA",
    city: "Miami",
    country: "EUA",
    countryCode: "US",
    imageKeyword: "miami",
    avgPriceBRL: 3200,
    avgMilesLatam: 45000,
    tags: ["América do Norte", "Praia", "Compras"],
    highlight: "Melhor custo com milhas",
  },
  {
    iata: "MAD",
    city: "Madrid",
    country: "Espanha",
    countryCode: "ES",
    imageKeyword: "madrid",
    avgPriceBRL: 4100,
    avgMilesLatam: 60000,
    tags: ["Europa", "Arte", "Gastronomia"],
    highlight: "Ótimo para usar LATAM Pass",
  },
  {
    iata: "EZE",
    city: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    imageKeyword: "buenos-aires",
    avgPriceBRL: 1400,
    avgMilesLatam: 20000,
    tags: ["América do Sul", "Cultura", "Gastronomia"],
    highlight: "Destino econômico",
  },
  {
    iata: "CUN",
    city: "Cancún",
    country: "México",
    countryCode: "MX",
    imageKeyword: "cancun",
    avgPriceBRL: 2800,
    avgMilesLatam: 40000,
    tags: ["América Central", "Praia", "Resort"],
    highlight: "Ideal para férias em família",
  },
  {
    iata: "CDG",
    city: "Paris",
    country: "França",
    countryCode: "FR",
    imageKeyword: "paris",
    avgPriceBRL: 4500,
    avgMilesLatam: 65000,
    tags: ["Europa", "Romance", "Cultura"],
    highlight: "Use Livelo para melhor resgate",
  },
  {
    iata: "DXB",
    city: "Dubai",
    country: "Emirados Árabes",
    countryCode: "AE",
    imageKeyword: "dubai",
    avgPriceBRL: 5200,
    avgMilesLatam: 75000,
    tags: ["Oriente Médio", "Luxo", "Compras"],
    highlight: "Vale muito a pena em executiva",
  },
  {
    iata: "SCL",
    city: "Santiago",
    country: "Chile",
    countryCode: "CL",
    imageKeyword: "santiago",
    avgPriceBRL: 1600,
    avgMilesLatam: 22000,
    tags: ["América do Sul", "Natureza", "Aventura"],
    highlight: "Destino próximo e acessível",
  },
];
