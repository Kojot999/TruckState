export const POST_FILTERS = {
  unresolved: 'nierozwiązane',
  resolved: 'rozwiązane',
};

export const VIEW_MODES = {
  group: 'group',
  fullScale: 'fullScale',
};

export function formatPostDate(isoDate) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function formatPostDateShort(isoDate) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function getTypeLabel(type) {
  return type === 'problem' ? 'Problem' : 'Informacja';
}

export function getStatusLabel(status) {
  return status === POST_FILTERS.resolved ? 'Rozwiązane' : 'Nierozwiązane';
}
