import { useState } from 'react';
import { addUser, deleteUser, getUsers } from '@api/fleet';
import { ROLES } from '@app/utils/permissions';

function UserManagementPanel({ currentUserId, onClose, onChange }) {
  const [users, setUsers] = useState(() => getUsers());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES.DRIVER);
  const [error, setError] = useState('');

  const refreshUsers = () => {
    setUsers(getUsers());
    onChange();
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    setError('');

    const result = addUser({ username, password, role, name });
    if (result.success) {
      setUsername('');
      setPassword('');
      setName('');
      setRole(ROLES.DRIVER);
      refreshUsers();
    } else {
      setError(result.error);
    }
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUserId) {
      setError('Nie możesz usunąć własnego konta');
      return;
    }

    if (!window.confirm('Czy na pewno usunąć tego użytkownika?')) return;

    const result = deleteUser(userId);
    if (result.success) {
      setError('');
      refreshUsers();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="home-page__panel-overlay" onClick={onClose} role="presentation">
      <div
        className="home-page__panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="users-panel-title"
      >
        <header className="home-page__panel-header">
          <h2 id="users-panel-title">Zarządzanie użytkownikami</h2>
          <button type="button" className="home-page__panel-close" onClick={onClose} aria-label="Zamknij">
            ×
          </button>
        </header>

        {error && (
          <p className="home-page__form-error home-page__panel-error" role="alert">
            {error}
          </p>
        )}

        <ul className="home-page__user-list">
          {users.map((u) => (
            <li key={u.id} className="home-page__user-item">
              <div>
                <span className="home-page__user-item-name">{u.name}</span>
                <span className="home-page__user-item-meta">
                  @{u.username} · {u.role}
                </span>
              </div>
              <button
                type="button"
                className="home-page__btn home-page__btn--danger home-page__btn--sm"
                onClick={() => handleDeleteUser(u.id)}
                disabled={u.id === currentUserId}
                title={u.id === currentUserId ? 'Nie możesz usunąć siebie' : 'Usuń użytkownika'}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>

        <form className="home-page__panel-form" onSubmit={handleAddUser}>
          <h3>Dodaj użytkownika</h3>
          <div className="home-page__panel-form-grid">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Imię i nazwisko"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Login"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Hasło"
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value={ROLES.DRIVER}>Kierowca</option>
              <option value={ROLES.MECHANIC}>Mechanik</option>
              <option value={ROLES.MANAGER}>Manager</option>
            </select>
          </div>
          <button type="submit" className="home-page__btn home-page__btn--primary">
            Dodaj użytkownika
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserManagementPanel;
