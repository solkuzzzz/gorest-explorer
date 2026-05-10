import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { Card } from '@consta/uikit/Card';
import { Badge } from '@consta/uikit/Badge';
import { Loader } from '@consta/uikit/Loader';
import { Informer } from '@consta/uikit/Informer';
import { Table } from '@consta/uikit/Table';
import type { TableColumn } from '@consta/uikit/Table';
import { getUserById } from '../api/users';
import { getUserPosts } from '../api/posts';
import type { User, Post } from '../types';
import styles from './CardPage.module.css';

interface PostRow {
  id: string;
  title: string;
}

const postColumns: TableColumn<PostRow>[] = [
  { title: 'ID', accessor: 'id', width: 80 },
  { title: 'Заголовок', accessor: 'title' },
];

export default function UserCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const userId = Number(id);
    setLoading(true);
    setError('');
    Promise.all([getUserById(userId), getUserPosts(userId)])
      .then(([userData, userPosts]) => {
        setUser(userData);
        setPosts(userPosts);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) {
          setError('Пользователь не найден.');
        } else if (status === 401) {
          setError('Неверный или просроченный токен.');
        } else {
          setError('Не удалось загрузить данные. Проверьте соединение.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loaderWrap}>
        <Loader size="m" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Button
          label="← Назад к списку"
          view="ghost"
          size="s"
          onClick={() => navigate('/users')}
          className={styles.backBtn}
        />
        <Informer
          status="alert"
          view="filled"
          title="Ошибка"
          label={error}
        />
      </div>
    );
  }

  if (!user) return null;

  const [firstName, ...lastParts] = user.name.trim().split(' ');
  const lastName = lastParts.join(' ');

  const postRows: PostRow[] = posts.map((p) => ({
    id: String(p.id),
    title: p.title,
  }));

  return (
    <div className={styles.page}>
      <Button
        label="← Назад к списку"
        view="ghost"
        size="s"
        onClick={() => navigate('/users')}
        className={styles.backBtn}
      />

      <Card className={styles.card} shadow>
        <div className={styles.cardHeader}>
          <div className={styles.avatar}>
            <Text size="2xl" weight="bold">
              {firstName?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </div>
          <div className={styles.cardInfo}>
            <Text size="2xl" weight="bold">
              {firstName} {lastName}
            </Text>
            <Text size="m" view="secondary">{user.email}</Text>
            <div className={styles.badges}>
              <Badge
                label={user.gender === 'male' ? 'Мужской' : 'Женский'}
                status="system"
                size="s"
              />
              <Badge
                label={user.status === 'active' ? 'Активен' : 'Неактивен'}
                status={user.status === 'active' ? 'success' : 'error'}
                size="s"
              />
            </div>
          </div>
        </div>

        <div className={styles.detailRow}>
          <Text size="s" view="secondary" weight="medium">ID</Text>
          <Text size="s">{user.id}</Text>
        </div>
        <div className={styles.detailRow}>
          <Text size="s" view="secondary" weight="medium">Email</Text>
          <Text size="s">{user.email}</Text>
        </div>
        <div className={styles.detailRow}>
          <Text size="s" view="secondary" weight="medium">Пол</Text>
          <Text size="s">{user.gender === 'male' ? 'Мужской' : 'Женский'}</Text>
        </div>
        <div className={styles.detailRow}>
          <Text size="s" view="secondary" weight="medium">Статус</Text>
          <Text size="s">{user.status === 'active' ? 'Активен' : 'Неактивен'}</Text>
        </div>
      </Card>

      <div className={styles.section}>
        <Text size="xl" weight="bold" className={styles.sectionTitle}>
          Посты пользователя ({postRows.length})
        </Text>
        {postRows.length === 0 ? (
          <Text view="secondary">У этого пользователя нет постов</Text>
        ) : (
          <Table
            columns={postColumns}
            rows={postRows}
            onRowClick={({ id: postId }) => navigate(`/posts/${postId}`)}
            getCellWrap={() => 'truncate'}
          />
        )}
      </div>
    </div>
  );
}
