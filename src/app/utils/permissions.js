export const ROLES = {
  DRIVER: 'Kierowca',
  MECHANIC: 'Mechanik',
  MANAGER: 'Manager',
};

export function canAddPost(role) {
  return role === ROLES.DRIVER;
}

export function canModeratePosts(role) {
  return role === ROLES.MECHANIC || role === ROLES.MANAGER;
}

export function canManageVehicles(role) {
  return role === ROLES.MANAGER;
}

export function canManageUsers(role) {
  return role === ROLES.MANAGER;
}
