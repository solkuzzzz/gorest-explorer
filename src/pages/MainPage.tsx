import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { Card } from '@consta/uikit/Card';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import { useAuthStore } from '../store/authStore';
import styles from './MainPage.module.css';

type ModeItem = { label: string; value: 'users' | 'posts' };

const modeItems: ModeItem[] = [
  { label: 'Пользователи', value: 'users' },
  { label: 'Посты', value: 'posts' },
];

export default function MainPage() {
  const { token, setToken } = useAuthStore();
  const navigate = useNavigate();
  const [inputToken, setInputToken] = useState(token);
  const [selectedMode, setSelectedMode] = useState<ModeItem>(modeItems[0]);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputToken.trim()) {
      setError('Введите access token');
      return;
    }
    setError('');
    setToken(inputToken.trim());
    navigate(`/${selectedMode.value}`);
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card} shadow>
        <Text size="2xl" weight="bold" className={styles.title}>
          GoRest Explorer
        </Text>
        <Text size="s" view="secondary" className={styles.subtitle}>
          Введите токен доступа GoRest для работы с API
        </Text>

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Access Token"
            value={inputToken}
            onChange={(value) => {
              setInputToken(value ?? '');
              if (error) setError('');
            }}
            placeholder="Вставьте ваш Bearer token..."
            status={error ? 'alert' : undefined}
            caption={error || 'Получить токен можно на gorest.co.in'}
            type="password"
            style={{ width: '100%' }}
          />

          <div className={styles.modeSection}>
            <Text size="s" weight="medium">
              Режим просмотра
            </Text>
            <ChoiceGroup
              items={modeItems}
              value={selectedMode}
              onChange={(item) => setSelectedMode(item)}
              getItemLabel={(item) => item.label}
              name="mode"
              size="m"
            />
          </div>

          <Button
            label="Войти"
            type="submit"
            width="full"
            size="l"
          />
        </form>
      </Card>
    </div>
  );
}
