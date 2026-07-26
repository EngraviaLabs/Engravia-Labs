export const getPaginationData = (page: number, limit: number, total: number, count: number) => ({
  page, limit, total,
  pages: Math.ceil(total / limit),
  hasNextPage: (page - 1) * limit + count < total,
  hasPrevPage: page > 1,
});
