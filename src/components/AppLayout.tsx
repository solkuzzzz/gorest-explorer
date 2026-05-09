import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { useAuthStore } from '../store/authStore';
import styles from './AppLayout.module.css';

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, clearToken } = useAuthStore();
  const isMain = location.pathname === '/';

  function handleLogout() {
    clearToken();
    navigate('/');
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Text
          size="xl"
          weight="bold"
          className={styles.logo}
          onClick={() => navigate(token ? '/users' : '/')}
        >
          GoRest Explorer
        </Text>
        {!isMain && token && (
          <nav className={styles.nav}>
            <Button
              label="Пользователи"
              view={location.pathname.startsWith('/users') ? 'primary' : 'ghost'}
              size="s"
              onClick={() => navigate('/users')}
            />
            <Button
              label="Посты"
              view={location.pathname.startsWith('/posts') ? 'primary' : 'ghost'}
              size="s"
              onClick={() => navigate('/posts')}
            />
            <Button
              label="Выйти"
              view="ghost"
              size="s"
              onClick={handleLogout}
            />
          </nav>
        )}
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
