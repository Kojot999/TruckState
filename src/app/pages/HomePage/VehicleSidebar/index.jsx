import { useEffect, useMemo, useState } from 'react';
import { assignVehicleToGroup, getAllPosts } from '@api/fleet';
import { VEHICLE_TYPES } from '@app/utils/vehicleTypes';

const UNGROUPED_ID = 'ungrouped';
const UNRESOLVED_STATUS = 'nierozwiązane';

function getGroupPostStats(vehicleIds, posts) {
  const unresolved = posts.filter(
    (post) => vehicleIds.includes(post.vehicleId) && post.status === UNRESOLVED_STATUS
  );

  if (unresolved.length === 0) {
    return { count: 0, variant: null };
  }

  const hasProblem = unresolved.some((post) => post.type === 'problem');

  return {
    count: unresolved.length,
    variant: hasProblem ? 'problem' : 'info',
  };
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06L7.98 14.5a.75.75 0 001.492.12l.33-6.88zm4.34.06a.75.75 0 10-1.5-.06l-.33 6.88a.75.75 0 101.492-.12l-.33-6.88z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      className={`home-page__group-chevron${expanded ? ' home-page__group-chevron--expanded' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function VehicleSidebar({
  vehicles,
  groups,
  isManager,
  activeVehicleId,
  onSelectVehicle,
  onDeleteVehicle,
  onRefresh,
  showAddVehicle,
  onToggleAddVehicle,
  showAddVehicleForm,
  onOpenCreateGroup,
}) {
  const [expandedGroups, setExpandedGroups] = useState(() => new Set());
  const [draggedVehicleId, setDraggedVehicleId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [filters, setFilters] = useState({
    withProblem: false,
    withInfo: false,
    type: '',
  });

  const hasActiveFilters = filters.withProblem || filters.withInfo || filters.type !== '';

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      if (filters.withProblem && vehicle.unresolvedProblemCount === 0) {
        return false;
      }
      if (filters.withInfo && vehicle.unresolvedInfoCount === 0) {
        return false;
      }
      if (filters.type && vehicle.type !== filters.type) {
        return false;
      }
      return true;
    });
  }, [vehicles, filters]);

  const clearFilters = () => {
    setFilters({ withProblem: false, withInfo: false, type: '' });
  };

  const useGroupedLayout = groups.length > 0;
  const canDrag = isManager && useGroupedLayout;

  useEffect(() => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      groups.forEach((group) => next.add(group.id));
      if (useGroupedLayout) {
        next.add(UNGROUPED_ID);
      }
      return next;
    });
  }, [groups, useGroupedLayout]);

  const vehiclesByGroup = useMemo(() => {
    const map = { [UNGROUPED_ID]: [] };
    groups.forEach((group) => {
      map[group.id] = [];
    });

    filteredVehicles.forEach((vehicle) => {
      const target =
        vehicle.groupId && map[vehicle.groupId] !== undefined
          ? vehicle.groupId
          : UNGROUPED_ID;
      map[target].push(vehicle);
    });

    return map;
  }, [filteredVehicles, groups]);

  const groupPostStats = useMemo(() => {
    const posts = getAllPosts();
    const stats = {};

    groups.forEach((group) => {
      const vehicleIds = (vehiclesByGroup[group.id] ?? []).map((vehicle) => vehicle.id);
      stats[group.id] = getGroupPostStats(vehicleIds, posts);
    });

    const ungroupedIds = (vehiclesByGroup[UNGROUPED_ID] ?? []).map((vehicle) => vehicle.id);
    stats[UNGROUPED_ID] = getGroupPostStats(ungroupedIds, posts);

    return stats;
  }, [vehiclesByGroup, groups]);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleDragStart = (vehicleId) => (e) => {
    e.dataTransfer.setData('text/vehicle-id', vehicleId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedVehicleId(vehicleId);
  };

  const handleDragEnd = () => {
    setDraggedVehicleId(null);
    setDropTargetId(null);
  };

  const handleDragOver = (targetId) => (e) => {
    if (!canDrag) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetId(targetId);
  };

  const handleDragLeave = (targetId) => () => {
    setDropTargetId((current) => (current === targetId ? null : current));
  };

  const handleDrop = (targetId) => (e) => {
    if (!canDrag) return;
    e.preventDefault();
    const vehicleId = e.dataTransfer.getData('text/vehicle-id');
    if (!vehicleId) return;

    const groupId = targetId === UNGROUPED_ID ? null : targetId;
    assignVehicleToGroup(vehicleId, groupId);
    setDraggedVehicleId(null);
    setDropTargetId(null);
    onRefresh();
  };

  const renderVehicle = (vehicle) => (
    <li
      key={vehicle.id}
      className={`home-page__vehicle-item${draggedVehicleId === vehicle.id ? ' home-page__vehicle-item--dragging' : ''}`}
      draggable={canDrag}
      onDragStart={canDrag ? handleDragStart(vehicle.id) : undefined}
      onDragEnd={canDrag ? handleDragEnd : undefined}
    >
      <button
        type="button"
        className={`home-page__vehicle${activeVehicleId === vehicle.id ? ' home-page__vehicle--active' : ''}`}
        onClick={() => onSelectVehicle(vehicle.id)}
      >
        <div className="home-page__vehicle-info">
          <span className="home-page__vehicle-plate">{vehicle.registrationNumber}</span>
          <span className="home-page__vehicle-type">{vehicle.type}</span>
        </div>
        {vehicle.notificationCount > 0 && (
          <div className="home-page__vehicle-badges">
            {vehicle.unresolvedProblemCount > 0 && (
              <span
                className="home-page__vehicle-badge home-page__vehicle-badge--problem"
                aria-label={`${vehicle.unresolvedProblemCount} nierozwiązanych problemów`}
                title="Nierozwiązane problemy"
              >
                {vehicle.unresolvedProblemCount}
              </span>
            )}
            {vehicle.unresolvedInfoCount > 0 && (
              <span
                className="home-page__vehicle-badge home-page__vehicle-badge--info"
                aria-label={`${vehicle.unresolvedInfoCount} nierozwiązanych informacji`}
                title="Nierozwiązane informacje"
              >
                {vehicle.unresolvedInfoCount}
              </span>
            )}
          </div>
        )}
      </button>
      {isManager && (
        <button
          type="button"
          className="home-page__vehicle-delete"
          onClick={(e) => onDeleteVehicle(vehicle.id, e)}
          aria-label={`Usuń pojazd ${vehicle.registrationNumber}`}
        >
          <TrashIcon />
        </button>
      )}
    </li>
  );

  const renderVehicleList = (items) => (
    <ul className="home-page__vehicle-list">{items.map(renderVehicle)}</ul>
  );

  const renderDropSection = ({ id, title, items, hint }) => {
    const isExpanded = expandedGroups.has(id);
    const isDropTarget = dropTargetId === id;
    const postStats = groupPostStats[id] ?? { count: 0, variant: null };

    return (
      <div
        key={id}
        className={`home-page__group${isDropTarget ? ' home-page__group--drop-target' : ''}${isExpanded ? ' home-page__group--expanded' : ''}`}
        onDragOver={handleDragOver(id)}
        onDragLeave={handleDragLeave(id)}
        onDrop={handleDrop(id)}
      >
        <button
          type="button"
          className="home-page__group-header"
          onClick={() => toggleGroup(id)}
          aria-expanded={isExpanded}
        >
          <ChevronIcon expanded={isExpanded} />
          <span className="home-page__group-name">{title}</span>
          <div className="home-page__group-stats">
            <span className="home-page__group-count" title="Liczba pojazdów">
              {items.length}
            </span>
            {postStats.count > 0 && (
              <span
                className={`home-page__group-post-count home-page__group-post-count--${postStats.variant}`}
                title={`${postStats.count} nierozwiązanych zgłoszeń`}
                aria-label={`${postStats.count} nierozwiązanych zgłoszeń`}
              >
                {postStats.count}
              </span>
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="home-page__group-body">
            {canDrag && hint && <p className="home-page__group-hint">{hint}</p>}
            {items.length === 0 ? (
              <p className="home-page__group-empty">Brak pojazdów w tym oddziale</p>
            ) : (
              renderVehicleList(items)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="home-page__vehicles">
      <div className="home-page__vehicles-header">
        <h2 className="home-page__section-title">Pojazdy</h2>
        {isManager && (
          <div className="home-page__vehicles-actions">
            <button
              type="button"
              className="home-page__btn home-page__btn--primary home-page__btn--sm"
              onClick={onToggleAddVehicle}
            >
              {showAddVehicle ? 'Anuluj' : 'Dodaj pojazd'}
            </button>
            <button
              type="button"
              className="home-page__btn home-page__btn--secondary home-page__btn--sm"
              onClick={onOpenCreateGroup}
            >
              Dodaj oddział
            </button>
          </div>
        )}
      </div>

      {isManager && showAddVehicleForm}

      <div className="home-page__vehicle-filters">
        <p className="home-page__vehicle-filters-title">Filtry</p>
        <label className="home-page__vehicle-filter">
          <input
            type="checkbox"
            checked={filters.withProblem}
            onChange={(e) => setFilters((prev) => ({ ...prev, withProblem: e.target.checked }))}
          />
          <span>Tylko z nierozwiązanym problemem</span>
        </label>
        <label className="home-page__vehicle-filter">
          <input
            type="checkbox"
            checked={filters.withInfo}
            onChange={(e) => setFilters((prev) => ({ ...prev, withInfo: e.target.checked }))}
          />
          <span>Tylko z nierozwiązaną informacją</span>
        </label>
        <label className="home-page__vehicle-filter home-page__vehicle-filter--select">
          <span>Typ pojazdu</span>
          <select
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="">Wszystkie typy</option>
            {VEHICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        {hasActiveFilters && (
          <button
            type="button"
            className="home-page__btn home-page__btn--secondary home-page__btn--sm home-page__vehicle-filters-clear"
            onClick={clearFilters}
          >
            Wyczyść filtry
          </button>
        )}
      </div>

      {canDrag && (
        <p className="home-page__drag-hint">Przeciągnij pojazd na oddział, aby go przypisać.</p>
      )}

      {useGroupedLayout ? (
        <div className="home-page__groups">
          {groups.map((group) =>
            renderDropSection({
              id: group.id,
              title: group.name,
              items: vehiclesByGroup[group.id] ?? [],
              hint: 'Upuść pojazd tutaj',
            })
          )}
          {renderDropSection({
            id: UNGROUPED_ID,
            title: 'Bez oddziału',
            items: vehiclesByGroup[UNGROUPED_ID] ?? [],
            hint: 'Upuść tutaj, aby usunąć z oddziału',
          })}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <p className="home-page__vehicle-list-empty">
          Brak pojazdów spełniających wybrane filtry
        </p>
      ) : (
        renderVehicleList(filteredVehicles)
      )}
    </aside>
  );
}

export default VehicleSidebar;
