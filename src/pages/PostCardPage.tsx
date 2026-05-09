import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { Card } from '@consta/uikit/Card';
import { Loader } from '@consta/uikit/Loader';
import { getPostById, getPostComments } from '../api/posts';
import type { Post, Comment } from '../types';
import styles from './CardPage.module.css';

export default function PostCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const postId = Number(id);
    setLoading(true);
    Promise.all([getPostById(postId), getPostComments(postId)])
      .then(([postData, postComments]) => {
        setPost(postData);
        setComments(postComments);
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

  if (!post) {
    return <Text>Пост не найден</Text>;
  }

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
