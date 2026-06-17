export const VEHICLE_TYPES = [
  'Ciągnik siodłowy',
  'Ciągnik BDF',
  'Naczepa',
  'Naczepa chłodnia',
  'Naczepa Kontenerowa BDF',
  'Bus',
];

const LEGACY_VEHICLE_TYPE_MAP = {
  Ciężarówka: 'Ciągnik siodłowy',
  Dostawczak: 'Ciągnik BDF',
  'Naczepa chłodnicza': 'Naczepa chłodnia',
  'Naczepa standardowa': 'Naczepa',
  'Naczepa firanka': 'Naczepa',
  'Naczepa niskopodwoziowa': 'Naczepa',
  'Naczepa kontenerowa': 'Naczepa Kontenerowa BDF',
  'Naczepa cysterna': 'Naczepa',
};

export function isValidVehicleType(type) {
  return VEHICLE_TYPES.includes(type);
}

export function normalizeVehicleType(type) {
  if (isValidVehicleType(type)) {
    return type;
  }
  return LEGACY_VEHICLE_TYPE_MAP[type] ?? VEHICLE_TYPES[0];
}
