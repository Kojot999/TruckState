import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@app/context/AuthContext';
import {
  getVehicles,
  getVehicleGroups,
  getPosts,
  getUsers,
  updatePostStatus,
  deletePost,
  addVehicle,
  deleteVehicle,
} from '@api/fleet';
import AddPostForm from '@components/AddPostForm';
import UserManagementPanel from '@components/UserManagementPanel';
import CreateGroupModal from '@components/CreateGroupModal';
import VehicleSidebar from './VehicleSidebar';
import FullScaleView from './FullScaleView';
import { VEHICLE_TYPES } from '@app/utils/vehicleTypes';
import {
  canAddPost,
  canModeratePosts,
  canManageVehicles,
  canManageUsers,
} from '@app/utils/permissions';
import { formatPostDate, getTypeLabel, POST_FILTERS, VIEW_MODES } from './utils';
import './style.scss';

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function HomePage() {
  const { user, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeVehicleId, setActiveVehicleId] = useState(null);
  const [postFilter, setPostFilter] = useState(POST_FILTERS.unresolved);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState('');
  const [vehicleError, setVehicleError] = useState('');
  const [viewMode, setViewMode] = useState(VIEW_MODES.group);

  const refresh = () => setRefreshKey((k) => k + 1);

  const vehicles = useMemo(() => getVehicles(), [refreshKey]);
  const vehicleGroups = useMemo(() => getVehicleGroups(), [refreshKey]);
  const usersById = useMemo(
    () => Object.fromEntries(getUsers().map((u) => [u.id, u])),
    [refreshKey]
  );

  const isDriver = canAddPost(user.role);
  const isModerator = canModeratePosts(user.role);
  const isManager = canManageVehicles(user.role);

  useEffect(() => {
    setPostFilter(POST_FILTERS.unresolved);
  }, [activeVehicleId]);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) ?? null;
  const activePosts = useMemo(
    () => (activeVehicleId ? getPosts(activeVehicleId) : []),
    [activeVehicleId, refreshKey]
  );

  const filteredPosts = useMemo(
    () => activePosts.filter((post) => post.status === postFilter),
    [activePosts, postFilter]
  );

  const unresolvedCount = activePosts.filter(
    (p) => p.status === POST_FILTERS.unresolved
  ).length;
  const resolvedCount = activePosts.filter(
    (p) => p.status === POST_FILTERS.resolved
  ).length;

  const handleToggleStatus = (post) => {
    const newStatus =
      post.status === POST_FILTERS.unresolved
        ? POST_FILTERS.resolved
        : POST_FILTERS.unresolved;
    updatePostStatus(post.id, newStatus);
    refresh();
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm('Czy na pewno usunąć to zgłoszenie?')) return;
    deletePost(postId);
    refresh();
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    setVehicleError('');

    const result = addVehicle({ registrationNumber: newPlate, type: newType });
    if (result.success) {
      setNewPlate('');
      setNewType('');
      setShowAddVehicle(false);
      refresh();
    } else {
      setVehicleError(result.error);
    }
  };

  const handleDeleteVehicle = (vehicleId, e) => {
    e.stopPropagation();
    if (!window.confirm('Usunąć pojazd wraz ze wszystkimi zgłoszeniami?')) return;

    deleteVehicle(vehicleId);
    if (activeVehicleId === vehicleId) {
      setActiveVehicleId(null);
    }
    refresh();
  };

  return (
    <section className="home-page">
      <header className="home-page__header">
        <div className="home-page__brand">
          <h1>TruckState</h1>
          <p>Panel zarządzania flotą</p>
        </div>

        <nav className="home-page__view-tabs" aria-label="Wybór widoku">
          <button
            type="button"
            className={`home-page__view-tab${viewMode === VIEW_MODES.group ? ' home-page__view-tab--active' : ''}`}
            onClick={() => setViewMode(VIEW_MODES.group)}
            aria-selected={viewMode === VIEW_MODES.group}
          >
            Widok grupowy
          </button>
          <button
            type="button"
            className={`home-page__view-tab${viewMode === VIEW_MODES.fullScale ? ' home-page__view-tab--active' : ''}`}
            onClick={() => setViewMode(VIEW_MODES.fullScale)}
            aria-selected={viewMode === VIEW_MODES.fullScale}
          >
            Widok pełnej skali
          </button>
        </nav>

        <div className="home-page__user">
          {canManageUsers(user.role) && (
            <button
              type="button"
              className="home-page__btn home-page__btn--secondary"
              onClick={() => setShowUserPanel(true)}
            >
              Użytkownicy
            </button>
          )}
          <div className="home-page__user-info">
            <span className="home-page__user-name">{user.name}</span>
            <span className="home-page__user-role">{user.role}</span>
          </div>
          <button type="button" className="home-page__logout" onClick={logout}>
            Wyloguj
          </button>
        </div>
      </header>

      {viewMode === VIEW_MODES.fullScale ? (
        <FullScaleView
          vehicles={vehicles}
          groups={vehicleGroups}
          usersById={usersById}
          isModerator={isModerator}
          refreshKey={refreshKey}
          onRefresh={refresh}
        />
      ) : (
      <div className="home-page__layout">
        <VehicleSidebar
          vehicles={vehicles}
          groups={vehicleGroups}
          isManager={isManager}
          activeVehicleId={activeVehicleId}
          onSelectVehicle={setActiveVehicleId}
          onDeleteVehicle={handleDeleteVehicle}
          onRefresh={refresh}
          showAddVehicle={showAddVehicle}
          onToggleAddVehicle={() => setShowAddVehicle((v) => !v)}
          onOpenCreateGroup={() => setShowCreateGroupModal(true)}
          showAddVehicleForm={
            isManager &&
            showAddVehicle && (
              <form className="home-page__add-vehicle" onSubmit={handleAddVehicle}>
                {vehicleError && (
                  <p className="home-page__form-error" role="alert">
                    {vehicleError}
                  </p>
                )}
                <input
                  type="text"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  placeholder="Nr rejestracyjny"
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Wybierz typ pojazdu
                  </option>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button type="submit" className="home-page__btn home-page__btn--primary home-page__btn--sm">
                  Zapisz pojazd
                </button>
              </form>
            )
          }
        />

        <section className="home-page__board">
          {!activeVehicle ? (
            <div className="home-page__board-empty">
              <p>Wybierz pojazd z listy, aby zobaczyć zgłoszenia</p>
            </div>
          ) : (
            <>
              <header className="home-page__board-header">
                <div>
                  <h2 className="home-page__board-title">{activeVehicle.registrationNumber}</h2>
                  <p className="home-page__board-subtitle">{activeVehicle.type}</p>
                </div>
                {(activeVehicle.unresolvedProblemCount > 0 ||
                  activeVehicle.unresolvedInfoCount > 0) && (
                  <div className="home-page__board-alerts">
                    {activeVehicle.unresolvedProblemCount > 0 && (
                      <span className="home-page__board-alerts-badge home-page__board-alerts-badge--problem">
                        {activeVehicle.unresolvedProblemCount} problemów
                      </span>
                    )}
                    {activeVehicle.unresolvedInfoCount > 0 && (
                      <span className="home-page__board-alerts-badge home-page__board-alerts-badge--info">
                        {activeVehicle.unresolvedInfoCount} informacji
                      </span>
                    )}
                  </div>
                )}
              </header>

              {isDriver && (
                <AddPostForm
                  vehicleId={activeVehicle.id}
                  user={user}
                  onSuccess={refresh}
                />
              )}

              <nav className="home-page__tabs" aria-label="Filtr zgłoszeń">
                <button
                  type="button"
                  className={`home-page__tab${postFilter === POST_FILTERS.unresolved ? ' home-page__tab--active' : ''}`}
                  onClick={() => setPostFilter(POST_FILTERS.unresolved)}
                  aria-selected={postFilter === POST_FILTERS.unresolved}
                >
                  Nierozwiązane
                  <span className="home-page__tab-count">{unresolvedCount}</span>
                </button>
                <button
                  type="button"
                  className={`home-page__tab${postFilter === POST_FILTERS.resolved ? ' home-page__tab--active' : ''}`}
                  onClick={() => setPostFilter(POST_FILTERS.resolved)}
                  aria-selected={postFilter === POST_FILTERS.resolved}
                >
                  Rozwiązane
                  <span className="home-page__tab-count">{resolvedCount}</span>
                </button>
              </nav>

              <div className="home-page__feed">
                {filteredPosts.length === 0 ? (
                  <p className="home-page__feed-empty">
                    Brak zgłoszeń w kategorii „
                    {postFilter === POST_FILTERS.unresolved ? 'Nierozwiązane' : 'Rozwiązane'}”.
                  </p>
                ) : (
                  <ul className="home-page__feed-list">
                    {filteredPosts.map((post) => {
                      const author = usersById[post.authorId];
                      const authorRole = author?.role ?? '—';
                      const isProblem = post.type === 'problem';

                      return (
                        <li key={post.id}>
                          <article
                            className={`home-page__feed-post${isProblem ? ' home-page__feed-post--problem' : ''}`}
                          >
                            <header className="home-page__feed-post-header">
                              <div className="home-page__feed-post-author">
                                <div
                                  className={`home-page__feed-avatar${isProblem ? ' home-page__feed-avatar--problem' : ''}`}
                                  aria-hidden="true"
                                >
                                  {getInitials(post.authorName)}
                                </div>
                                <div className="home-page__feed-post-info">
                                  <span className="home-page__feed-post-name">{post.authorName}</span>
                                  <span className="home-page__feed-post-meta">
                                    {authorRole}
                                    <span className="home-page__feed-post-separator">·</span>
                                    {formatPostDate(post.createdAt)}
                                    <span className="home-page__feed-post-separator">·</span>
                                    {post.mileage.toLocaleString('pl-PL')} km
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`home-page__feed-label home-page__feed-label--${post.type}`}
                              >
                                {isProblem && (
                                  <svg
                                    className="home-page__feed-label-icon"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                                {getTypeLabel(post.type)}
                              </span>
                            </header>
                            <p className="home-page__feed-post-text">{post.text}</p>

                            {isModerator && (
                              <footer className="home-page__feed-post-actions">
                                <button
                                  type="button"
                                  className="home-page__btn home-page__btn--secondary home-page__btn--sm"
                                  onClick={() => handleToggleStatus(post)}
                                >
                                  Zmień status
                                  {post.status === POST_FILTERS.unresolved
                                    ? ' → Rozwiązane'
                                    : ' → Nierozwiązane'}
                                </button>
                                <button
                                  type="button"
                                  className="home-page__btn home-page__btn--danger home-page__btn--sm"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  Usuń post
                                </button>
                              </footer>
                            )}
                          </article>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      </div>
      )}

      {showUserPanel && (
        <UserManagementPanel
          currentUserId={user.id}
          onClose={() => setShowUserPanel(false)}
          onChange={refresh}
        />
      )}

      {showCreateGroupModal && (
        <CreateGroupModal
          onClose={() => setShowCreateGroupModal(false)}
          onSuccess={() => refresh()}
        />
      )}
    </section>
  );
}

export default HomePage;
