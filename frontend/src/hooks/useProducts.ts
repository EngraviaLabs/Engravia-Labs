import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const useProducts = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/products', { params });
      return data;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data.product;
    },
    enabled: !!slug,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured');
      return data.products;
    },
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['bestsellers'],
    queryFn: async () => {
      const { data } = await api.get('/products/bestsellers');
      return data.products;
    },
  });
};

export const useInfiniteProducts = (params: Record<string, any> = {}) => {
  return useInfiniteQuery({
    queryKey: ['infinite-products', params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get('/products', { params: { ...params, page: pageParam, limit: 12 } });
      return data;
    },
    getNextPageParam: (last) => last.pagination?.hasNextPage ? last.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.categories;
    },
  });
};

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${productId}`);
      return data;
    },
    enabled: !!productId,
  });
};
