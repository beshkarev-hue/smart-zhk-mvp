import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import Logo from '../../components/Logo';
import { colors } from '../../theme/colors';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      if (response.user.role === 'resident') {
        navigate('/resident/dashboard');
      } else if (response.user.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (response.user.role === 'executor') {
        navigate('/executor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <Logo size="xlarge" showText={false} />
          <p style={styles.subtitle}>Умная платформа управления ЖКХ</p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p style={styles.footer}>
          Нет аккаунта? <Link to="/register" style={styles.link}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(124, 179, 66, 0.15)',
    backgroundImage: 'linear-gradient(135deg, rgba(124, 179, 66, 0.1) 0%, rgba(30, 136, 229, 0.1) 100%)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '48px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    border: `2px solid ${colors.primary}`,
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.primary,
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: colors.textLight,
    margin: 0,
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid #ef9a9a',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: colors.text,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${colors.light}`,
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: colors.secondary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: colors.textLight,
  },
  link: {
    color: colors.secondary,
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default LoginPage;
