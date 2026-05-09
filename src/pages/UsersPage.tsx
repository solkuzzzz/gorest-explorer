import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '@consta/uikit/Table';
import type { TableColumn } from '@consta/uikit/Table';
import { Pagination } from '@consta/uikit/Pagination';
import { Select } from '@consta/uikit/Select';
import { Text } from '@consta/uikit/Text';
import { Loader } from '@consta/uikit/Loader';
import { getUsers } from '../api/users';
import type { ItemsPerPage } from '../types';
import styles from './ListPage.module.css';

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const columns: TableColumn<UserRow>[] = [
  { title: 'Имя', accessor: 'firstName' },
  { title: 'Фамилия', accessor: 'lastName' },
  { title: 'Email', accessor: 'email' },
];

const perPageOptions: { label: string; value: ItemsPerPage }[] = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
];

function splitName(fullName: string): [string, string] {
  const parts = fullName.trim().split(' ');
  return [parts[0] ?? '', parts.slice(1).join(' ')];
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState<ItemsPerPage>(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUsers(page, perPage)
      .then(({ data, meta }) => {
        if (cancelled) return;
        const rows: UserRow[] = data.map((u) => {
          const [firstName, lastName] = splitName(u.name);
          return { id: String(u.id), firstName, lastName, email: u.email };
        });
        setUsers(rows);
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
        Пользователи
      </Text>

      {loading ? (
        <div className={styles.loaderWrap}>
          <Loader size="m" />
        </div>
      ) : (
        <Table
          columns={columns}
          rows={users}
          onRowClick={({ id }) => navigate(`/users/${id}`)}
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
