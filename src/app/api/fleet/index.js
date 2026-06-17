import {
  STORAGE_KEYS,
  initMockData,
  readFromStorage,
  writeToStorage,
} from './mockData';
import { isValidVehicleType } from '@app/utils/vehicleTypes';

initMockData();

function generateId(prefix) {
  return `${prefix}${Date.now()}`;
}

function generateToken() {
  return `mock_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function recalculateNotificationCounts(vehicles, posts) {
  return vehicles.map((vehicle) => {
    const unresolved = posts.filter(
      (post) =>
        post.vehicleId === vehicle.id && post.status === 'nierozwiązane'
    );
    const unresolvedProblemCount = unresolved.filter(
      (post) => post.type === 'problem'
    ).length;
    const unresolvedInfoCount = unresolved.filter(
      (post) => post.type === 'informacja'
    ).length;

    return {
      ...vehicle,
      notificationCount: unresolved.length,
      unresolvedProblemCount,
      unresolvedInfoCount,
    };
  });
}

export function login(username, password) {
  const users = readFromStorage(STORAGE_KEYS.users) ?? [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Nieprawidłowy login lub hasło' };
  }

  const session = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
  };

  const token = generateToken();

  writeToStorage(STORAGE_KEYS.session, session);
  localStorage.setItem(STORAGE_KEYS.token, token);

  return { success: true, user: session, token };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.token);
}

export function getCurrentUser() {
  if (!isAuthenticated()) return null;
  return readFromStorage(STORAGE_KEYS.session);
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function isAuthenticated() {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const session = readFromStorage(STORAGE_KEYS.session);
  return Boolean(token && session);
}

export function getVehicles() {
  const vehicles = readFromStorage(STORAGE_KEYS.vehicles) ?? [];
  const posts = readFromStorage(STORAGE_KEYS.posts) ?? [];
  return recalculateNotificationCounts(vehicles, posts);
}

export function getUsers() {
  return readFromStorage(STORAGE_KEYS.users) ?? [];
}

export function getUserById(userId) {
  const users = getUsers();
  return users.find((u) => u.id === userId) ?? null;
}

export function getPosts(vehicleId) {
  const posts = readFromStorage(STORAGE_KEYS.posts) ?? [];
  return posts
    .filter((post) => post.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getAllPosts() {
  return readFromStorage(STORAGE_KEYS.posts) ?? [];
}

export function addPost(postData) {
  const posts = readFromStorage(STORAGE_KEYS.posts) ?? [];
  const vehicles = readFromStorage(STORAGE_KEYS.vehicles) ?? [];

  const vehicleExists = vehicles.some((v) => v.id === postData.vehicleId);
  if (!vehicleExists) {
    return { success: false, error: 'Pojazd nie istnieje' };
  }

  const newPost = {
    id: generateId('p'),
    vehicleId: postData.vehicleId,
    text: postData.text,
    status: postData.status ?? 'nierozwiązane',
    type: postData.type ?? 'informacja',
    authorId: postData.authorId,
    authorName: postData.authorName,
    mileage: postData.mileage,
    createdAt: new Date().toISOString(),
  };

  const updatedPosts = [...posts, newPost];
  writeToStorage(STORAGE_KEYS.posts, updatedPosts);

  const updatedVehicles = recalculateNotificationCounts(vehicles, updatedPosts);
  writeToStorage(STORAGE_KEYS.vehicles, updatedVehicles);

  return { success: true, post: newPost };
}

export function updatePostStatus(postId, status) {
  const validStatuses = ['rozwiązane', 'nierozwiązane'];
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Nieprawidłowy status' };
  }

  const posts = readFromStorage(STORAGE_KEYS.posts) ?? [];
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return { success: false, error: 'Zgłoszenie nie istnieje' };
  }

  const updatedPosts = [...posts];
  updatedPosts[postIndex] = { ...updatedPosts[postIndex], status };
  writeToStorage(STORAGE_KEYS.posts, updatedPosts);

  const vehicles = readFromStorage(STORAGE_KEYS.vehicles) ?? [];
  const updatedVehicles = recalculateNotificationCounts(vehicles, updatedPosts);
  writeToStorage(STORAGE_KEYS.vehicles, updatedVehicles);

  return { success: true, post: updatedPosts[postIndex] };
}

export function deletePost(postId) {
  const posts = readFromStorage(STORAGE_KEYS.posts) ?? [];
  const filtered = posts.filter((p) => p.id !== postId);

  if (filtered.length === posts.length) {
    return { success: false, error: 'Zgłoszenie nie istnieje' };
  }

  writeToStorage(STORAGE_KEYS.posts, filtered);

  const vehicles = readFromStorage(STORAGE_KEYS.vehicles) ?? [];
  const updatedVehicles = recalculateNotificationCounts(vehicles, filtered);
  writeToStorage(STORAGE_KEYS.vehicles, updatedVehicles);

  return { success: true };
}

export function addVehicle({ registrationNumber, type }) {
  if (!registrationNumber?.trim() || !type?.trim()) {
    return { success: false, error: 'Podaj numer rejestracyjny i typ pojazdu' };
  }

  if (!isValidVehicleType(type)) {
    return { success: false, error: 'Wybierz typ pojazdu z listy' };
  }

  const vehicles = readFromStorage(STORAGE_KEYS.vehicles) ?? [];
  const normalizedPlate = registrationNumber.trim().toUpperCase();

  if (vehicles.some((v) => v.registrationNumber.toUpperCase() === normalizedPlate)) {
    return { success: false, error: 'Pojazd o tym numerze już istnieje' };
  }

  const newVehicle = {
    id: generateId('v'),
    registrationNumber: registrationNumber.trim(),
    type,
    notificationCount: 0,
    groupId: null,
  };

  writeToStorage(STORAGE_KEYS.vehicles, [...vehicles, newVehicle]);
  return { success: true, vehicle: newVehicle };
}

export function deleteVehicle(vehicleId) {
  const vehicles = readFromStorage(STORAGE_KEYS.vehicles) ?? [];
  const filteredVehicles = vehicles.filter((v) => v.id !== vehicleId);

  if (filteredVehicles.length === vehicles.length) {
    return { success: false, error: 'Pojazd nie istnieje' };
  }

  const posts = readFromStorage(STORAGE_KEYS.posts) ?? [];
  const filteredPosts = posts.filter((p) => p.vehicleId !== vehicleId);

  writeToStorage(STORAGE_KEYS.vehicles, filteredVehicles);
  writeToStorage(STORAGE_KEYS.posts, filteredPosts);

  return { success: true };
}

export function addUser({ username, password, role, name }) {
  if (!username?.trim() || !password?.trim() || !role?.trim() || !name?.trim()) {
    return { success: false, error: 'Wypełnij wszystkie pola użytkownika' };
  }

  const validRoles = ['Manager', 'Mechanik', 'Kierowca'];
  if (!validRoles.includes(role)) {
    return { success: false, error: 'Nieprawidłowa rola' };
  }

  const users = getUsers();
  if (users.some((u) => u.username === username.trim())) {
    return { success: false, error: 'Login jest już zajęty' };
  }

  const newUser = {
    id: generateId('u'),
    username: username.trim(),
    password: password.trim(),
    role,
    name: name.trim(),
  };

  writeToStorage(STORAGE_KEYS.users, [...users, newUser]);
  return { success: true, user: newUser };
}

export function deleteUser(userId) {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== userId);

  if (filtered.length === users.length) {
    return { success: false, error: 'Użytkownik nie istnieje' };
  }

  writeToStorage(STORAGE_KEYS.users, filtered);
  return { success: true };
}

export function getVehicleGroups() {
  return readFromStorage(STORAGE_KEYS.vehicleGroups) ?? [];
}

export function createVehicleGroup(name) {
  if (!name?.trim()) {
    return { success: false, error: 'Podaj nazwę oddziału' };
  }

  const groups = getVehicleGroups();
  const normalizedName = name.trim();

  if (
    groups.some((group) => group.name.toLowerCase() === normalizedName.toLowerCase())
  ) {
    return { success: false, error: 'Oddział o tej nazwie już istnieje' };
  }

  const newGroup = {
    id: generateId('g'),
    name: normalizedName,
  };

  writeToStorage(STORAGE_KEYS.vehicleGroups, [...groups, newGroup]);
  return { success: true, group: newGroup };
}

export function assignVehicleToGroup(vehicleId, groupId) {
  const vehicles = readFromStorage(STORAGE_KEYS.vehicles) ?? [];
  const vehicleIndex = vehicles.findIndex((vehicle) => vehicle.id === vehicleId);

  if (vehicleIndex === -1) {
    return { success: false, error: 'Pojazd nie istnieje' };
  }

  if (groupId !== null) {
    const groups = getVehicleGroups();
    if (!groups.some((group) => group.id === groupId)) {
      return { success: false, error: 'Oddział nie istnieje' };
    }
  }

  const updatedVehicles = [...vehicles];
  updatedVehicles[vehicleIndex] = {
    ...updatedVehicles[vehicleIndex],
    groupId,
  };

  writeToStorage(STORAGE_KEYS.vehicles, updatedVehicles);
  return { success: true, vehicle: updatedVehicles[vehicleIndex] };
}
