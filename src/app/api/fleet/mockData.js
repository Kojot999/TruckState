import { normalizeVehicleType } from "@app/utils/vehicleTypes";

const STORAGE_KEYS = {
  users: "truckstate_users",
  vehicles: "truckstate_vehicles",
  posts: "truckstate_posts",
  vehicleGroups: "truckstate_vehicle_groups",
  session: "truckstate_session",
  token: "truckstate_token",
};

const MOCK_DATA_VERSION = 8;

const initialVehicleGroups = [
  { id: "g1", name: "Oddział Wrocław" },
  { id: "g2", name: "Oddział Legnica" },
  { id: "g3", name: "Oddział Dzierżoniów" },
];

const initialUsers = [
  {
    id: "u1",
    username: "manager",
    password: "manager123",
    role: "Manager",
    name: "Jan Kowalski",
  },
  {
    id: "u2",
    username: "mechanik1",
    password: "mech123",
    role: "Mechanik",
    name: "Piotr Nowak",
  },
  {
    id: "u3",
    username: "mechanik2",
    password: "mech456",
    role: "Mechanik",
    name: "Adam Wiśniewski",
  },
  {
    id: "u4",
    username: "kierowca1",
    password: "drive123",
    role: "Kierowca",
    name: "Marek Zieliński",
  },
  {
    id: "u5",
    username: "kierowca2",
    password: "drive456",
    role: "Kierowca",
    name: "Tomasz Lewandowski",
  },
];

const initialVehicles = [
  {
    id: "v1",
    registrationNumber: "WA 12345",
    type: "Ciągnik siodłowy",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v2",
    registrationNumber: "KR 98765",
    type: "Bus",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v3",
    registrationNumber: "GD 55555",
    type: "Ciągnik siodłowy",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v4",
    registrationNumber: "PO 11223",
    type: "Ciągnik BDF",
    notificationCount: 0,
    groupId: "g3",
  },
  {
    id: "v5",
    registrationNumber: "WZ 77889",
    type: "Ciągnik siodłowy",
    notificationCount: 0,
    groupId: "g1",
  },
  {
    id: "v6",
    registrationNumber: "LB 33441",
    type: "Ciągnik BDF",
    notificationCount: 0,
    groupId: "g2",
  },
  {
    id: "v7",
    registrationNumber: "SZ 99001",
    type: "Naczepa chłodnia",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v8",
    registrationNumber: "BI 22110",
    type: "Naczepa chłodnia",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v9",
    registrationNumber: "RZ 44556",
    type: "Naczepa",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v10",
    registrationNumber: "LU 66778",
    type: "Naczepa",
    notificationCount: 0,
    groupId: "g1",
  },
  {
    id: "v11",
    registrationNumber: "KT 88990",
    type: "Naczepa",
    notificationCount: 0,
    groupId: "g2",
  },
  {
    id: "v12",
    registrationNumber: "OP 12398",
    type: "Naczepa Kontenerowa BDF",
    notificationCount: 0,
    groupId: "g3",
  },
  {
    id: "v13",
    registrationNumber: "WR 55667",
    type: "Ciągnik BDF",
    notificationCount: 0,
    groupId: "g1",
  },
  {
    id: "v14",
    registrationNumber: "LD 88901",
    type: "Ciągnik BDF",
    notificationCount: 0,
    groupId: "g3",
  },
  {
    id: "v15",
    registrationNumber: "BY 11234",
    type: "Bus",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v16",
    registrationNumber: "ZG 55678",
    type: "Ciągnik siodłowy",
    notificationCount: 0,
    groupId: "g1",
  },
  {
    id: "v17",
    registrationNumber: "EL 33445",
    type: "Naczepa chłodnia",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v18",
    registrationNumber: "TM 77889",
    type: "Naczepa",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v19",
    registrationNumber: "KS 99112",
    type: "Naczepa",
    notificationCount: 0,
    groupId: "g3",
  },
  {
    id: "v20",
    registrationNumber: "PI 22334",
    type: "Naczepa",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v21",
    registrationNumber: "OL 66789",
    type: "Ciągnik siodłowy",
    notificationCount: 0,
    groupId: null,
  },
  {
    id: "v22",
    registrationNumber: "NS 44123",
    type: "Naczepa",
    notificationCount: 0,
    groupId: "g2",
  },
];

const initialPosts = [
  {
    id: "p1",
    vehicleId: "v1",
    text: "Wymiana oleju wykonana zgodnie z harmonogramem.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u2",
    authorName: "Piotr Nowak",
    mileage: 512200,
    createdAt: "2025-05-10T09:30:00.000Z",
  },
  {
    id: "p2",
    vehicleId: "v1",
    text: "Nierówna praca silnika przy obrotach powyżej 2000 RPM – naprawa wykonana.",
    status: "rozwiązane",
    type: "problem",
    authorId: "u4",
    authorName: "Marek Zieliński",
    mileage: 512850,
    createdAt: "2025-05-28T14:15:00.000Z",
  },
  {
    id: "p3",
    vehicleId: "v2",
    text: "Przegląd techniczny ważny do grudnia 2025.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u1",
    authorName: "Jan Kowalski",
    mileage: 289200,
    createdAt: "2025-04-02T11:00:00.000Z",
  },
  {
    id: "p4",
    vehicleId: "v4",
    text: "Uszkodzone światło cofania – wymaga naprawy.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u5",
    authorName: "Tomasz Lewandowski",
    mileage: 167800,
    createdAt: "2025-06-01T08:45:00.000Z",
  },
  {
    id: "p5",
    vehicleId: "v4",
    text: "Niskie ciśnienie w oponie przedniej lewej.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u4",
    authorName: "Marek Zieliński",
    mileage: 168100,
    createdAt: "2025-06-08T16:20:00.000Z",
  },
  {
    id: "p6",
    vehicleId: "v4",
    text: "Tankowanie pełnym bakiem – 85 litrów ON.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u5",
    authorName: "Tomasz Lewandowski",
    mileage: 167500,
    createdAt: "2025-05-30T07:10:00.000Z",
  },
  {
    id: "p7",
    vehicleId: "v3",
    text: "Wymiana klocków hamulcowych na osi przedniej.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u2",
    authorName: "Piotr Nowak",
    mileage: 498400,
    createdAt: "2025-05-15T10:00:00.000Z",
  },
  {
    id: "p8",
    vehicleId: "v5",
    text: "Awaria ABS – kontrolka świeci ciągle.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u4",
    authorName: "Marek Zieliński",
    mileage: 621000,
    createdAt: "2025-06-05T07:30:00.000Z",
  },
  {
    id: "p9",
    vehicleId: "v7",
    text: "Temperatura w komorze chłodniczej utrzymuje się prawidłowo (-18°C).",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u5",
    authorName: "Tomasz Lewandowski",
    mileage: 0,
    createdAt: "2025-06-02T12:00:00.000Z",
  },
  {
    id: "p10",
    vehicleId: "v7",
    text: "Uszkodzona uszczelka drzwi bocznych – ucieka chłód.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u4",
    authorName: "Marek Zieliński",
    mileage: 0,
    createdAt: "2025-06-09T09:15:00.000Z",
  },
  {
    id: "p11",
    vehicleId: "v8",
    text: "Przegląd agregatu chłodniczego zaplanowany na lipiec.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u3",
    authorName: "Adam Wiśniewski",
    mileage: 0,
    createdAt: "2025-05-20T14:00:00.000Z",
  },
  {
    id: "p12",
    vehicleId: "v9",
    text: "Przetarcie na plandece po stronie lewej – do obserwacji.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u5",
    authorName: "Tomasz Lewandowski",
    mileage: 0,
    createdAt: "2025-06-07T11:45:00.000Z",
  },
  {
    id: "p13",
    vehicleId: "v10",
    text: "Zabezpieczenie ładunku sprawdzone przed wyjazdem.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u4",
    authorName: "Marek Zieliński",
    mileage: 0,
    createdAt: "2025-06-03T06:20:00.000Z",
  },
  {
    id: "p14",
    vehicleId: "v11",
    text: "Nieszczelność układu pneumatycznego – spadek ciśnienia.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u2",
    authorName: "Piotr Nowak",
    mileage: 0,
    createdAt: "2025-06-10T08:00:00.000Z",
  },
  {
    id: "p15",
    vehicleId: "v13",
    text: "Wymiana filtra powietrza wykonana.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u2",
    authorName: "Piotr Nowak",
    mileage: 98400,
    createdAt: "2025-05-25T13:30:00.000Z",
  },
  {
    id: "p16",
    vehicleId: "v15",
    text: "Klimatyzacja pasażerska słabo chłodzi.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u5",
    authorName: "Tomasz Lewandowski",
    mileage: 312500,
    createdAt: "2025-06-04T15:10:00.000Z",
  },
  {
    id: "p17",
    vehicleId: "v16",
    text: "AdBlue uzupełniony do pełna.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u4",
    authorName: "Marek Zieliński",
    mileage: 445600,
    createdAt: "2025-05-18T07:45:00.000Z",
  },
  {
    id: "p18",
    vehicleId: "v18",
    text: "Wyciek z zaworu bezpieczeństwa – wymaga naprawy.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u3",
    authorName: "Adam Wiśniewski",
    mileage: 0,
    createdAt: "2025-06-11T10:30:00.000Z",
  },
  {
    id: "p19",
    vehicleId: "v20",
    text: "Cysterna oczyszczona po transporcie – gotowa do załadunku.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u1",
    authorName: "Jan Kowalski",
    mileage: 0,
    createdAt: "2025-06-06T16:00:00.000Z",
  },
  {
    id: "p20",
    vehicleId: "v21",
    text: "Opóźnienie w dostawie części – naprawa wstrzymana.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u2",
    authorName: "Piotr Nowak",
    mileage: 278900,
    createdAt: "2025-06-12T09:00:00.000Z",
  },
  {
    id: "p21",
    vehicleId: "v6",
    text: "Przekroczenie normy spalania na trasie A2 – do analizy.",
    status: "nierozwiązane",
    type: "problem",
    authorId: "u4",
    authorName: "Marek Zieliński",
    mileage: 356700,
    createdAt: "2025-06-13T11:20:00.000Z",
  },
  {
    id: "p22",
    vehicleId: "v14",
    text: "Dowóz paczek zakończony – 47 punktów obsłużonych.",
    status: "rozwiązane",
    type: "informacja",
    authorId: "u5",
    authorName: "Tomasz Lewandowski",
    mileage: 112300,
    createdAt: "2025-06-13T17:00:00.000Z",
  },
  {
    id: "p23",
    vehicleId: "v1",
    text: "Karta paliwowa przedłużona do końca roku – bez zmian limitów.",
    status: "nierozwiązane",
    type: "informacja",
    authorId: "u1",
    authorName: "Jan Kowalski",
    mileage: 513100,
    createdAt: "2025-06-14T08:00:00.000Z",
  },
  {
    id: "p24",
    vehicleId: "v8",
    text: "Przypomnienie: badanie techniczne naczepy ważne do sierpnia 2025.",
    status: "nierozwiązane",
    type: "informacja",
    authorId: "u3",
    authorName: "Adam Wiśniewski",
    mileage: 0,
    createdAt: "2025-06-14T09:30:00.000Z",
  },
  {
    id: "p25",
    vehicleId: "v17",
    text: "Sezonowa wymiana opon zimowych zaplanowana na październik.",
    status: "nierozwiązane",
    type: "informacja",
    authorId: "u2",
    authorName: "Piotr Nowak",
    mileage: 0,
    createdAt: "2025-06-14T10:15:00.000Z",
  },
  {
    id: "p26",
    vehicleId: "v14",
    text: "Nowy harmonogram tras obowiązuje od poniedziałku – proszę o zapoznanie się.",
    status: "nierozwiązane",
    type: "informacja",
    authorId: "u5",
    authorName: "Tomasz Lewandowski",
    mileage: 112800,
    createdAt: "2025-06-14T11:00:00.000Z",
  },
  {
    id: "p27",
    vehicleId: "v3",
    text: "Ubezpieczenie OC/AC przedłużone – potwierdzenie w biurze oddziału.",
    status: "nierozwiązane",
    type: "informacja",
    authorId: "u1",
    authorName: "Jan Kowalski",
    mileage: 499100,
    createdAt: "2025-06-14T12:45:00.000Z",
  },
  {
    id: "p28",
    vehicleId: "v2",
    text: "Planowany przegląd serwisowy busa w terminie 20–22 czerwca.",
    status: "nierozwiązane",
    type: "informacja",
    authorId: "u4",
    authorName: "Marek Zieliński",
    mileage: 290500,
    createdAt: "2025-06-14T13:20:00.000Z",
  },
];

const BULK_CITY_CODES = [
  "CZ",
  "RA",
  "KN",
  "GL",
  "SL",
  "TC",
  "PL",
  "GN",
  "KA",
  "CI",
  "SW",
  "NE",
  "SU",
  "SK",
  "PK",
  "OS",
  "ZG",
  "LE",
  "RZ",
  "TO",
  "BB",
  "ZG",
  "KI",
  "GD",
  "WA",
  "KR",
  "PO",
  "WR",
  "LD",
  "BY",
];

const BULK_VEHICLE_TYPES = [
  "Ciągnik siodłowy",
  "Ciągnik BDF",
  "Naczepa",
  "Naczepa chłodnia",
  "Naczepa Kontenerowa BDF",
  "Bus",
];

const BULK_GROUP_IDS = ["g1", "g2", "g3", null];

const BULK_AUTHORS = [
  { id: "u1", name: "Jan Kowalski" },
  { id: "u2", name: "Piotr Nowak" },
  { id: "u3", name: "Adam Wiśniewski" },
  { id: "u4", name: "Marek Zieliński" },
  { id: "u5", name: "Tomasz Lewandowski" },
];

const BULK_PROBLEM_TEXTS = [
  "Uszkodzone światło cofania – wymaga naprawy.",
  "Niskie ciśnienie w oponie przedniej lewej.",
  "Awaria ABS – kontrolka świeci ciągle.",
  "Uszkodzona uszczelka drzwi bocznych – ucieka chłód.",
  "Przetarcie na plandece po stronie lewej – do obserwacji.",
  "Nieszczelność układu pneumatycznego – spadek ciśnienia.",
  "Klimatyzacja pasażerska słabo chłodzi.",
  "Wyciek z zaworu bezpieczeństwa – wymaga naprawy.",
  "Opóźnienie w dostawie części – naprawa wstrzymana.",
  "Przekroczenie normy spalania – do analizy.",
  "Nierówna praca silnika przy obrotach powyżej 2000 RPM.",
  "Pęknięta szyba przednia – wymiana konieczna.",
  "Hałas z przedniej osi przy hamowaniu.",
  "Uszkodzony lusterko boczne po stronie prawej.",
  "Awaria agregatu chłodniczego – temperatura rośnie.",
  "Zablokowany zawór EGR – spadek mocy silnika.",
  "Wyciek oleju z miski karteru.",
  "Uszkodzony pas bezpieczeństwa kierowcy.",
  "Niesprawna winda hydrauliczna na naczepie.",
  "Pęknięcie w wężu powietrza – spadek ciśnienia w zawieszeniu.",
];

const BULK_INFO_TEXTS = [
  "Wymiana oleju wykonana zgodnie z harmonogramem.",
  "Przegląd techniczny ważny do końca roku.",
  "Tankowanie pełnym bakiem – 85 litrów ON.",
  "Wymiana klocków hamulcowych na osi przedniej.",
  "Temperatura w komorze chłodniczej utrzymuje się prawidłowo (-18°C).",
  "Przegląd agregatu chłodniczego zaplanowany na lipiec.",
  "Zabezpieczenie ładunku sprawdzone przed wyjazdem.",
  "Wymiana filtra powietrza wykonana.",
  "AdBlue uzupełniony do pełna.",
  "Dowóz paczek zakończony – trasa obsłużona w całości.",
  "Karta paliwowa przedłużona – bez zmian limitów.",
  "Przypomnienie: badanie techniczne ważne do sierpnia.",
  "Sezonowa wymiana opon zaplanowana na październik.",
  "Nowy harmonogram tras obowiązuje od poniedziałku.",
  "Ubezpieczenie OC/AC przedłużone – potwierdzenie w biurze.",
  "Planowany przegląd serwisowy w terminie 20–22 czerwca.",
  "Kalibracja tachografu wykonana w autoryzowanym serwisie.",
  "Mycie i dezynfekcja kabiny po trasie międzynarodowej.",
  "Kontrola stanu opon – głębokość bieżnika w normie.",
  "Aktualizacja oprogramowania ECU – wykonana w serwisie.",
];

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function generateBulkFleetData(startVehicleNum, vehicleCount, startPostNum) {
  const vehicles = [];
  const posts = [];
  let postCounter = startPostNum;

  for (let i = 0; i < vehicleCount; i++) {
    const vehicleNum = startVehicleNum + i;
    const vehicleId = `v${vehicleNum}`;
    const rand = createSeededRandom(vehicleNum * 7919);

    const cityCode = BULK_CITY_CODES[i % BULK_CITY_CODES.length];
    const regSuffix = String(20000 + i * 173).slice(-5);
    const vehicleType =
      BULK_VEHICLE_TYPES[Math.floor(rand() * BULK_VEHICLE_TYPES.length)];
    const groupId = BULK_GROUP_IDS[Math.floor(rand() * BULK_GROUP_IDS.length)];

    vehicles.push({
      id: vehicleId,
      registrationNumber: `${cityCode} ${regSuffix}`,
      type: vehicleType,
      notificationCount: 0,
      groupId,
    });

    const postCount = 3 + Math.floor(rand() * 28);
    const isTrailer = vehicleType.startsWith("Naczepa");
    let mileage = isTrailer ? 0 : 80000 + Math.floor(rand() * 550000);
    let createdAtMs = Date.parse("2024-03-01T07:00:00.000Z");

    for (let j = 0; j < postCount; j++) {
      postCounter += 1;
      const isProblem = rand() > 0.42;
      const postType = isProblem ? "problem" : "informacja";
      const texts = isProblem ? BULK_PROBLEM_TEXTS : BULK_INFO_TEXTS;
      const text = texts[Math.floor(rand() * texts.length)];
      const author = BULK_AUTHORS[Math.floor(rand() * BULK_AUTHORS.length)];
      const status = rand() > 0.52 ? "rozwiązane" : "nierozwiązane";

      mileage += Math.floor(rand() * 1200);
      createdAtMs += Math.floor(rand() * 5 * 24 * 60 * 60 * 1000) + 86400000;

      posts.push({
        id: `p${postCounter}`,
        vehicleId,
        text,
        status,
        type: postType,
        authorId: author.id,
        authorName: author.name,
        mileage,
        createdAt: new Date(createdAtMs).toISOString(),
      });
    }
  }

  return { vehicles, posts };
}

const bulkFleetData = generateBulkFleetData(23, 100, 28);
const fleetVehicles = [...initialVehicles, ...bulkFleetData.vehicles];
const fleetPosts = [...initialPosts, ...bulkFleetData.posts];

function readFromStorage(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function seedFleetData() {
  writeToStorage(STORAGE_KEYS.vehicles, fleetVehicles);
  writeToStorage(STORAGE_KEYS.posts, fleetPosts);
  writeToStorage(STORAGE_KEYS.vehicleGroups, initialVehicleGroups);
  localStorage.setItem("truckstate_data_version", String(MOCK_DATA_VERSION));
}

export function initMockData() {
  if (!readFromStorage(STORAGE_KEYS.users)) {
    writeToStorage(STORAGE_KEYS.users, initialUsers);
  }

  const storedVersion = localStorage.getItem("truckstate_data_version");
  const shouldSeedFleet =
    !readFromStorage(STORAGE_KEYS.vehicles) ||
    storedVersion !== String(MOCK_DATA_VERSION);

  if (shouldSeedFleet) {
    seedFleetData();
  } else if (!readFromStorage(STORAGE_KEYS.vehicleGroups)) {
    writeToStorage(STORAGE_KEYS.vehicleGroups, initialVehicleGroups);
  }

  const vehicles = readFromStorage(STORAGE_KEYS.vehicles) ?? [];
  const normalizedVehicles = vehicles.map((vehicle) => {
    const type = normalizeVehicleType(vehicle.type);
    return type === vehicle.type ? vehicle : { ...vehicle, type };
  });

  if (
    normalizedVehicles.some(
      (vehicle, index) => vehicle.type !== vehicles[index].type,
    )
  ) {
    writeToStorage(STORAGE_KEYS.vehicles, normalizedVehicles);
  } else if (vehicles.some((vehicle) => vehicle.groupId === undefined)) {
    writeToStorage(
      STORAGE_KEYS.vehicles,
      vehicles.map((vehicle) => ({
        ...vehicle,
        groupId: vehicle.groupId ?? null,
      })),
    );
  }
}

export function resetMockData() {
  writeToStorage(STORAGE_KEYS.users, initialUsers);
  seedFleetData();
  localStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.token);
}

export { STORAGE_KEYS, readFromStorage, writeToStorage };
