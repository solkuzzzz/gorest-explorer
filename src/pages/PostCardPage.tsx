import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { Card } from '@consta/uikit/Card';
import { Loader } from '@consta/uikit/Loader';
import { Informer } from '@consta/uikit/Informer';
import { getPostById, getPostComments } from '../api/posts';
import type { Post, Comment } from '../types';
import styles from './CardPage.module.css';

export default function PostCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const postId = Number(id);
    setLoading(true);
    setError('');
    Promise.all([getPostById(postId), getPostComments(postId)])
      .then(([postData, postComments]) => {
        setPost(postData);
        setComments(postComments);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) {
          setError('Пост не найден.');
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
          onClick={() => navigate('/posts')}
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

  if (!post) return null;

  return (
    <div className={styles.page}>
      <Button
        label="← Назад к списку"
        view="ghost"
        size="s"
        onClick={() => navigate('/posts')}
        className={styles.backBtn}
      />

      <Card className={styles.card} shadow>
        <div className={styles.detailRow}>
          <Text size="s" view="secondary" weight="medium">ID</Text>
          <Text size="s">{post.id}</Text>
        </div>
        <div className={styles.detailRow}>
          <Text size="s" view="secondary" weight="medium">Автор</Text>
          <Text
            size="s"
            view="link"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/users/${post.user_id}`)}
          >
            #{post.user_id}
          </Text>
        </div>
        <div style={{ padding: '16px 0' }}>
          <Text size="xl" weight="bold" style={{ marginBottom: 12 }}>
            {post.title}
          </Text>
          <Text size="m" view="secondary">
            {post.body}
          </Text>
        </div>
      </Card>

      <div className={styles.section}>
        <Text size="xl" weight="bold" className={styles.sectionTitle}>
          Комментарии ({comments.length})
        </Text>

        {comments.length === 0 ? (
          <Text view="secondary">Комментариев нет</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comments.map((comment) => (
              <Card key={comment.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <div>
                    <Text size="s" weight="bold">{comment.name}</Text>
                    <Text size="xs" view="secondary">{comment.email}</Text>
                  </div>
                  <Text size="xs" view="ghost">#{comment.id}</Text>
                </div>
                <Text size="s" className={styles.commentBody}>
                  {comment.body}
                </Text>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
