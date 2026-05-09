import client from './client';
import type { User, PaginationMeta } from '../types';

interface UsersResponse {
  data: User[];
  meta: PaginationMeta;
}

export async function getUsers(page: number, perPage: number): Promise<UsersResponse> {
  const response = await client.get('/users', {
    params: { page, per_page: perPage },
  });

  const meta: PaginationMeta = {
    total: Number(response.headers['x-pagination-total']),
    pages: Number(response.headers['x-pagination-pages']),
    page: Number(response.headers['x-pagination-page']),
    limit: Number(response.headers['x-pagination-limit']),
  };

  return { data: response.data, meta };
}

export async function getUserById(id: number): Promise<User> {
  const response = await client.get(`/users/${id}`);
  return response.data;
}
