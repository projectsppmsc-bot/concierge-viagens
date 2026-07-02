export type Airport = {
  iata: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
};

export const airports: Airport[] = [
  // Brasil
  { iata: "GRU", name: "Aeroporto Int. de Guarulhos", city: "São Paulo", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "CGH", name: "Aeroporto de Congonhas", city: "São Paulo", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "GIG", name: "Aeroporto Int. Tom Jobim (Galeão)", city: "Rio de Janeiro", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "SDU", name: "Aeroporto Santos Dumont", city: "Rio de Janeiro", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "BSB", name: "Aeroporto Int. de Brasília", city: "Brasília", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "SSA", name: "Aeroporto Int. Dep. Luís Eduardo Magalhães", city: "Salvador", country: "Brasil", countryCode: "BR", timezone: "America/Bahia" },
  { iata: "FOR", name: "Aeroporto Int. Pinto Martins", city: "Fortaleza", country: "Brasil", countryCode: "BR", timezone: "America/Fortaleza" },
  { iata: "REC", name: "Aeroporto Int. do Recife/Guararapes", city: "Recife", country: "Brasil", countryCode: "BR", timezone: "America/Recife" },
  { iata: "POA", name: "Aeroporto Int. Salgado Filho", city: "Porto Alegre", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "CWB", name: "Aeroporto Int. Afonso Pena", city: "Curitiba", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "BEL", name: "Aeroporto Int. Val-de-Cans", city: "Belém", country: "Brasil", countryCode: "BR", timezone: "America/Belem" },
  { iata: "MAO", name: "Aeroporto Int. Eduardo Gomes", city: "Manaus", country: "Brasil", countryCode: "BR", timezone: "America/Manaus" },
  { iata: "FLN", name: "Aeroporto Int. Hercílio Luz", city: "Florianópolis", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "VCP", name: "Aeroporto Int. de Viracopos", city: "Campinas", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "MCZ", name: "Aeroporto Int. Zumbi dos Palmares", city: "Maceió", country: "Brasil", countryCode: "BR", timezone: "America/Maceio" },
  { iata: "NAT", name: "Aeroporto Int. São Gonçalo do Amarante", city: "Natal", country: "Brasil", countryCode: "BR", timezone: "America/Fortaleza" },
  { iata: "GYN", name: "Aeroporto Santa Genoveva", city: "Goiânia", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "CNF", name: "Aeroporto Int. Tancredo Neves (Confins)", city: "Belo Horizonte", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "PLU", name: "Aeroporto da Pampulha", city: "Belo Horizonte", country: "Brasil", countryCode: "BR", timezone: "America/Sao_Paulo" },
  { iata: "THE", name: "Aeroporto Int. de Teresina", city: "Teresina", country: "Brasil", countryCode: "BR", timezone: "America/Fortaleza" },
  { iata: "CGB", name: "Aeroporto Int. Marechal Rondon", city: "Cuiabá", country: "Brasil", countryCode: "BR", timezone: "America/Cuiaba" },

  // América do Sul
  { iata: "EZE", name: "Aeroporto Int. Ministro Pistarini", city: "Buenos Aires", country: "Argentina", countryCode: "AR", timezone: "America/Argentina/Buenos_Aires" },
  { iata: "SCL", name: "Aeroporto Int. Arturo Merino Benítez", city: "Santiago", country: "Chile", countryCode: "CL", timezone: "America/Santiago" },
  { iata: "BOG", name: "Aeroporto Int. El Dorado", city: "Bogotá", country: "Colômbia", countryCode: "CO", timezone: "America/Bogota" },
  { iata: "LIM", name: "Aeroporto Int. Jorge Chávez", city: "Lima", country: "Peru", countryCode: "PE", timezone: "America/Lima" },

  // América do Norte
  { iata: "MIA", name: "Aeroporto Int. de Miami", city: "Miami", country: "EUA", countryCode: "US", timezone: "America/New_York" },
  { iata: "JFK", name: "Aeroporto Int. John F. Kennedy", city: "Nova York", country: "EUA", countryCode: "US", timezone: "America/New_York" },
  { iata: "ORD", name: "Aeroporto Int. O'Hare", city: "Chicago", country: "EUA", countryCode: "US", timezone: "America/Chicago" },
  { iata: "LAX", name: "Aeroporto Int. de Los Angeles", city: "Los Angeles", country: "EUA", countryCode: "US", timezone: "America/Los_Angeles" },

  // Europa
  { iata: "LIS", name: "Aeroporto Humberto Delgado", city: "Lisboa", country: "Portugal", countryCode: "PT", timezone: "Europe/Lisbon" },
  { iata: "MAD", name: "Aeroporto Adolfo Suárez Madrid-Barajas", city: "Madrid", country: "Espanha", countryCode: "ES", timezone: "Europe/Madrid" },
  { iata: "CDG", name: "Aeroporto Charles de Gaulle", city: "Paris", country: "França", countryCode: "FR", timezone: "Europe/Paris" },
  { iata: "LHR", name: "Aeroporto de Heathrow", city: "Londres", country: "Reino Unido", countryCode: "GB", timezone: "Europe/London" },
  { iata: "FCO", name: "Aeroporto Leonardo da Vinci (Fiumicino)", city: "Roma", country: "Itália", countryCode: "IT", timezone: "Europe/Rome" },
  { iata: "AMS", name: "Aeroporto de Schiphol", city: "Amsterdã", country: "Países Baixos", countryCode: "NL", timezone: "Europe/Amsterdam" },

  // Outros
  { iata: "DXB", name: "Aeroporto Int. de Dubai", city: "Dubai", country: "Emirados Árabes", countryCode: "AE", timezone: "Asia/Dubai" },
  { iata: "NRT", name: "Aeroporto Int. de Narita", city: "Tóquio", country: "Japão", countryCode: "JP", timezone: "Asia/Tokyo" },
  { iata: "CUN", name: "Aeroporto Int. de Cancún", city: "Cancún", country: "México", countryCode: "MX", timezone: "America/Cancun" },
];

export function findAirport(iata: string): Airport | undefined {
  return airports.find((a) => a.iata === iata);
}

export function searchAirports(query: string): Airport[] {
  const q = query.toLowerCase();
  return airports.filter(
    (a) =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  );
}
