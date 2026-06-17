import { useState } from 'react';
import { addPost } from '@api/fleet';

function AddPostForm({ vehicleId, user, onSuccess }) {
  const [text, setText] = useState('');
  const [mileage, setMileage] = useState('');
  const [type, setType] = useState('informacja');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const parsedMileage = Number(mileage);
    if (!text.trim()) {
      setError('Wprowadź treść zgłoszenia');
      return;
    }
    if (!Number.isFinite(parsedMileage) || parsedMileage < 0) {
      setError('Podaj prawidłowy przebieg');
      return;
    }

    const result = addPost({
      vehicleId,
      text: text.trim(),
      type,
      authorId: user.id,
      authorName: user.name,
      mileage: parsedMileage,
    });

    if (result.success) {
      setText('');
      setMileage('');
      setType('informacja');
      onSuccess();
    } else {
      setError(result.error);
    }
  };

  return (
    <form className="home-page__add-post" onSubmit={handleSubmit}>
      <h3 className="home-page__add-post-title">Dodaj nowy post</h3>

      {error && (
        <p className="home-page__form-error" role="alert">
          {error}
        </p>
      )}

      <textarea
        className="home-page__add-post-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Opisz sytuację lub informację…"
        rows={3}
      />

      <div className="home-page__add-post-row">
        <div className="home-page__add-post-field">
          <label htmlFor="post-mileage">Przebieg (km)</label>
          <input
            id="post-mileage"
            type="number"
            min="0"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="np. 145000"
          />
        </div>

        <div className="home-page__add-post-field">
          <label htmlFor="post-type">Typ</label>
          <select
            id="post-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="informacja">Informacja</option>
            <option value="problem">Problem</option>
          </select>
        </div>
      </div>

      <button type="submit" className="home-page__btn home-page__btn--primary">
        Dodaj post
      </button>
    </form>
  );
}

export default AddPostForm;
