import { useState } from 'react';
import { createVehicleGroup } from '@api/fleet';

function CreateGroupModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = createVehicleGroup(name);
    if (result.success) {
      onSuccess(result.group);
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="home-page__panel-overlay" onClick={onClose} role="presentation">
      <div
        className="home-page__panel home-page__panel--sm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="create-group-title"
      >
        <header className="home-page__panel-header">
          <h2 id="create-group-title">Nowy oddział</h2>
          <button type="button" className="home-page__panel-close" onClick={onClose} aria-label="Zamknij">
            ×
          </button>
        </header>

        <form className="home-page__panel-form" onSubmit={handleSubmit}>
          {error && (
            <p className="home-page__form-error" role="alert">
              {error}
            </p>
          )}

          <label className="home-page__panel-label" htmlFor="group-name">
            Nazwa oddziału
          </label>
          <input
            id="group-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Oddział Wrocław"
            autoFocus
          />

          <div className="home-page__panel-actions">
            <button type="button" className="home-page__btn home-page__btn--secondary" onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" className="home-page__btn home-page__btn--primary">
              Utwórz oddział
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;
