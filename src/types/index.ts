export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
}

export interface PaginationMeta {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export type ItemsPerPage = 10 | 25 | 50;
