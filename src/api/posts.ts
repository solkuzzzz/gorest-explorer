import client from './client';
import type { Post, Comment, PaginationMeta } from '../types';

interface PostsResponse {
  data: Post[];
  meta: PaginationMeta;
}

export async function getPosts(page: number, perPage: number): Promise<PostsResponse> {
  const response = await client.get('/posts', {
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

export async function getPostById(id: number): Promise<Post> {
  const response = await client.get(`/posts/${id}`);
  return response.data;
}

export async function getPostComments(postId: number): Promise<Comment[]> {
  const response = await client.get(`/posts/${postId}/comments`);
  return response.data;
}

export async function getUserPosts(userId: number): Promise<Post[]> {
  const response = await client.get(`/users/${userId}/posts`);
  return response.data;
}
