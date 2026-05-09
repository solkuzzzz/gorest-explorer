import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@consta/uikit/Table';
import type { TableColumn } from '@consta/uikit/Table';
import { Pagination } from '@consta/uikit/Pagination';
import { Select } from '@consta/uikit/Select';
import { Text } from '@consta/uikit/Text';
import { Loader } from '@consta/uikit/Loader';
import { getPosts } from '../api/posts';
import type { ItemsPerPage } from '../types';
import styles from './ListPage.module.css';

interface PostRow {
  id: string;
  title: string;
}

const columns: TableColumn<PostRow>[] = [
  { title: 'ID', accessor: 'id', width: 80 },
  { title: 'Заголовок', accessor: 'title' },
];

const perPageOptions: { label: string; value: ItemsPerPage }[] = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
];

export default function PostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState<ItemsPerPage>(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPosts(page, perPage)
      .then(({ data, meta }) => {
        if (cancelled) return;
        setPosts(data.map((p) => ({ id: String(p.id), title: p.title })));
        setTotalPages(meta.pages || 1);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [page, perPage]);

  return (
    <div className={styles.page}>
      <Text size="2xl" weight="bold" className={styles.heading}>
        Посты
      </Text>

      {loading ? (
        <div className={styles.loaderWrap}>
          <Loader size="m" />
        </div>
      ) : (
        <Table
          columns={columns}
          rows={posts}
          onRowClick={({ id }) => navigate(`/posts/${id}`)}
          getCellWrap={() => 'truncate'}
          className={styles.table}
        />
      )}

      <div className={styles.controls}>
        <div className={styles.perPage}>
          <Text size="s" view="secondary">Записей на странице:</Text>
          <Select
            items={perPageOptions}
            value={perPageOptions.find((o) => o.value === perPage) ?? perPageOptions[0]}
            onChange={(value) => {
              if (value) {
                setPerPage(value.value);
                setPage(1);
              }
            }}
            getItemLabel={(item) => item.label}
            getItemKey={(item) => item.value}
            size="s"
          />
        </div>

        <Pagination
          value={page}
          items={totalPages}
          onChange={(value) => setPage(value)}
          showFirstPage
          showLastPage
        />
      </div>
    </div>
  );
}
