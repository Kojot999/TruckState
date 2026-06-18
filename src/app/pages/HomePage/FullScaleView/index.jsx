import { useMemo, useState } from 'react';
import { getAllPosts, updatePostStatus, deletePost } from '@api/fleet';
import { VEHICLE_TYPES } from '@app/utils/vehicleTypes';
import {
  formatPostDateShort,
  getStatusLabel,
  getTypeLabel,
  POST_FILTERS,
} from '../utils';

const UNGROUPED_VALUE = '__ungrouped__';
const ALL_VALUE = '';

const SORT_KEYS = {
  registration: 'registrationNumber',
  group: 'groupName',
  vehicleType: 'vehicleType',
  date: 'createdAt',
  author: 'authorName',
  type: 'type',
  status: 'status',
  mileage: 'mileage',
  text: 'text',
};

const INITIAL_FILTERS = {
  groupId: ALL_VALUE,
  status: ALL_VALUE,
  postType: ALL_VALUE,
  vehicleType: ALL_VALUE,
  dateFrom: '',
  dateTo: '',
  search: '',
};

function SortIcon({ direction }) {
  if (!direction) {
    return (
      <svg className="home-page__table-sort-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M5 7h10l-5 5-5-5z" opacity="0.35" />
        <path d="M5 13h10l-5-5-5 5z" opacity="0.35" />
      </svg>
    );
  }

  return (
    <svg className="home-page__table-sort-icon home-page__table-sort-icon--active" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      {direction === 'asc' ? (
        <path fillRule="evenodd" d="M10 5.23l4.24 4.5a.75.75 0 11-1.08 1.04L10 7.31 6.84 10.77a.75.75 0 11-1.08-1.04L10 5.23z" clipRule="evenodd" />
      ) : (
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      )}
    </svg>
  );
}

function compareValues(a, b, key) {
  if (key === 'createdAt') {
    return new Date(a).getTime() - new Date(b).getTime();
  }

  if (key === 'mileage') {
    return (a ?? 0) - (b ?? 0);
  }

  return String(a ?? '').localeCompare(String(b ?? ''), 'pl', { sensitivity: 'base' });
}

function FullScaleView({ vehicles, groups, usersById, isModerator, refreshKey, onRefresh }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortKey, setSortKey] = useState(SORT_KEYS.date);
  const [sortDirection, setSortDirection] = useState('desc');

  const rows = useMemo(() => {
    const vehiclesById = Object.fromEntries(vehicles.map((vehicle) => [vehicle.id, vehicle]));
    const groupsById = Object.fromEntries(groups.map((group) => [group.id, group]));
    const posts = getAllPosts();

    return posts.map((post) => {
      const vehicle = vehiclesById[post.vehicleId];
      const group = vehicle?.groupId ? groupsById[vehicle.groupId] : null;
      const author = usersById[post.authorId];

      return {
        ...post,
        registrationNumber: vehicle?.registrationNumber ?? '—',
        vehicleType: vehicle?.type ?? '—',
        groupName: group?.name ?? 'Bez oddziału',
        groupId: vehicle?.groupId ?? null,
        authorRole: author?.role ?? '—',
      };
    });
  }, [vehicles, groups, usersById, refreshKey]);

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([, value]) => value !== ALL_VALUE && value !== ''),
    [filters]
  );

  const filteredRows = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();

    return rows.filter((row) => {
      if (filters.groupId === UNGROUPED_VALUE && row.groupId !== null) return false;
      if (filters.groupId && filters.groupId !== UNGROUPED_VALUE && row.groupId !== filters.groupId) {
        return false;
      }
      if (filters.status && row.status !== filters.status) return false;
      if (filters.postType && row.type !== filters.postType) return false;
      if (filters.vehicleType && row.vehicleType !== filters.vehicleType) return false;

      if (filters.dateFrom) {
        const from = new Date(`${filters.dateFrom}T00:00:00`);
        if (new Date(row.createdAt) < from) return false;
      }

      if (filters.dateTo) {
        const to = new Date(`${filters.dateTo}T23:59:59.999`);
        if (new Date(row.createdAt) > to) return false;
      }

      if (searchLower) {
        const haystack = [
          row.registrationNumber,
          row.groupName,
          row.vehicleType,
          row.authorName,
          row.authorRole,
          row.text,
          getTypeLabel(row.type),
          getStatusLabel(row.status),
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(searchLower)) return false;
      }

      return true;
    });
  }, [rows, filters]);

  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows];
    sorted.sort((a, b) => {
      const result = compareValues(a[sortKey], b[sortKey], sortKey);
      return sortDirection === 'asc' ? result : -result;
    });
    return sorted;
  }, [filteredRows, sortKey, sortDirection]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection(key === SORT_KEYS.date ? 'desc' : 'asc');
  };

  const clearFilters = () => setFilters(INITIAL_FILTERS);

  const handleToggleStatus = (post) => {
    const newStatus =
      post.status === POST_FILTERS.unresolved
        ? POST_FILTERS.resolved
        : POST_FILTERS.unresolved;
    updatePostStatus(post.id, newStatus);
    onRefresh();
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm('Czy na pewno usunąć to zgłoszenie?')) return;
    deletePost(postId);
    onRefresh();
  };

  const columns = [
    { key: SORT_KEYS.registration, label: 'Rejestracja' },
    { key: SORT_KEYS.group, label: 'Oddział' },
    { key: SORT_KEYS.vehicleType, label: 'Typ pojazdu' },
    { key: SORT_KEYS.date, label: 'Data' },
    { key: SORT_KEYS.author, label: 'Kto zgłosił' },
    { key: SORT_KEYS.type, label: 'Typ' },
    { key: SORT_KEYS.status, label: 'Status' },
    { key: SORT_KEYS.mileage, label: 'Przebieg' },
    { key: SORT_KEYS.text, label: 'Treść' },
  ];

  return (
    <div className="home-page__fullscale">
      <div className="home-page__fullscale-toolbar">
        <div className="home-page__fullscale-filters">
          <label className="home-page__fullscale-filter">
            <span>Oddział</span>
            <select
              value={filters.groupId}
              onChange={(e) => setFilters((prev) => ({ ...prev, groupId: e.target.value }))}
            >
              <option value={ALL_VALUE}>Wszystkie oddziały</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
              <option value={UNGROUPED_VALUE}>Bez oddziału</option>
            </select>
          </label>

          <label className="home-page__fullscale-filter">
            <span>Status</span>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value={ALL_VALUE}>Wszystkie</option>
              <option value={POST_FILTERS.unresolved}>Nierozwiązane</option>
              <option value={POST_FILTERS.resolved}>Rozwiązane</option>
            </select>
          </label>

          <label className="home-page__fullscale-filter">
            <span>Typ zgłoszenia</span>
            <select
              value={filters.postType}
              onChange={(e) => setFilters((prev) => ({ ...prev, postType: e.target.value }))}
            >
              <option value={ALL_VALUE}>Wszystkie</option>
              <option value="problem">Problem</option>
              <option value="informacja">Informacja</option>
            </select>
          </label>

          <label className="home-page__fullscale-filter">
            <span>Typ pojazdu</span>
            <select
              value={filters.vehicleType}
              onChange={(e) => setFilters((prev) => ({ ...prev, vehicleType: e.target.value }))}
            >
              <option value={ALL_VALUE}>Wszystkie typy</option>
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="home-page__fullscale-filter">
            <span>Data od</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
            />
          </label>

          <label className="home-page__fullscale-filter">
            <span>Data do</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
            />
          </label>

          <label className="home-page__fullscale-filter home-page__fullscale-filter--search">
            <span>Szukaj</span>
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Rejestracja, autor, treść…"
            />
          </label>
        </div>

        <div className="home-page__fullscale-toolbar-footer">
          <p className="home-page__fullscale-count">
            Wyświetlono <strong>{sortedRows.length}</strong> z <strong>{rows.length}</strong> zgłoszeń
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              className="home-page__btn home-page__btn--secondary home-page__btn--sm"
              onClick={clearFilters}
            >
              Wyczyść filtry
            </button>
          )}
        </div>
      </div>

      <div className="home-page__table-wrap">
        <table className="home-page__table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  <button
                    type="button"
                    className={`home-page__table-sort${sortKey === column.key ? ' home-page__table-sort--active' : ''}`}
                    onClick={() => handleSort(column.key)}
                  >
                    <span>{column.label}</span>
                    <SortIcon direction={sortKey === column.key ? sortDirection : null} />
                  </button>
                </th>
              ))}
              {isModerator && <th scope="col">Akcje</th>}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={isModerator ? columns.length + 1 : columns.length} className="home-page__table-empty">
                  Brak zgłoszeń spełniających wybrane filtry
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => (
                <tr
                  key={row.id}
                  className={`home-page__table-row${row.type === 'problem' ? ' home-page__table-row--problem' : ''}${row.status === POST_FILTERS.unresolved ? ' home-page__table-row--unresolved' : ''}`}
                >
                  <td className="home-page__table-cell home-page__table-cell--plate">{row.registrationNumber}</td>
                  <td>{row.groupName}</td>
                  <td>{row.vehicleType}</td>
                  <td className="home-page__table-cell home-page__table-cell--date">{formatPostDateShort(row.createdAt)}</td>
                  <td>
                    <span className="home-page__table-author">{row.authorName}</span>
                    <span className="home-page__table-author-role">{row.authorRole}</span>
                  </td>
                  <td>
                    <span className={`home-page__table-badge home-page__table-badge--${row.type}`}>
                      {getTypeLabel(row.type)}
                    </span>
                  </td>
                  <td>
                    <span className={`home-page__table-badge home-page__table-badge--${row.status === POST_FILTERS.resolved ? 'resolved' : 'unresolved'}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="home-page__table-cell home-page__table-cell--mileage">
                    {row.mileage.toLocaleString('pl-PL')} km
                  </td>
                  <td className="home-page__table-cell home-page__table-cell--text">{row.text}</td>
                  {isModerator && (
                    <td className="home-page__table-cell home-page__table-cell--actions">
                      <button
                        type="button"
                        className="home-page__btn home-page__btn--secondary home-page__btn--sm"
                        onClick={() => handleToggleStatus(row)}
                      >
                        {row.status === POST_FILTERS.unresolved ? 'Rozwiąż' : 'Przywróć'}
                      </button>
                      <button
                        type="button"
                        className="home-page__btn home-page__btn--danger home-page__btn--sm"
                        onClick={() => handleDeletePost(row.id)}
                      >
                        Usuń
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FullScaleView;
