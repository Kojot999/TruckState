import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@app/context/AuthContext';
import './style.scss';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Wprowadź login i hasło');
      return;
    }

    setIsSubmitting(true);

    const result = login(username.trim(), password);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-page__background" aria-hidden="true" />

      <div className="login-page__card">
        <div className="login-page__brand">
          <div className="login-page__logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 17h1v2H2v-1a1 1 0 011-1zm18 1h-1v2h1a1 1 0 001-1v-1zM5 17h14v2H5v-2z"
                fill="currentColor"
              />
              <path
                d="M6 12h12l-1.5-4.5A2 2 0 0014.6 6H9.4a2 2 0 00-1.9 1.5L6 12z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor" />
              <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h1 className="login-page__title">TruckState</h1>
          <p className="login-page__subtitle">System obsługi floty pojazdów</p>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="login-page__error" role="alert">
              {error}
            </div>
          )}

          <div className="login-page__field">
            <label htmlFor="username">Login</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="np. manager"
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>

          <div className="login-page__field">
            <label htmlFor="password">Hasło</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="login-page__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logowanie…' : 'Zaloguj się'}
          </button>
        </form>

        <div className="login-page__hint">
          <p className="login-page__hint-title">Konta demo</p>
          <ul className="login-page__hint-list">
            <li>
              <span className="login-page__hint-role">Manager</span>
              <code>manager</code> / <code>manager123</code>
            </li>
            <li>
              <span className="login-page__hint-role">Mechanik</span>
              <code>mechanik1</code> / <code>mech123</code>
            </li>
            <li>
              <span className="login-page__hint-role">Kierowca</span>
              <code>kierowca1</code> / <code>drive123</code>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
