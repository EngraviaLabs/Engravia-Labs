export function getImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  if (url.startsWith('https://res.cloudinary.com') || url.startsWith('https://images.unsplash.com')) {
    return url;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const backendBase = apiUrl.replace(/\/api\/?$/, '');

  let cleanPath = url;
  if (cleanPath.startsWith('http://localhost') || cleanPath.startsWith('https://localhost')) {
    cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+/, '');
  }
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  return `${backendBase}${cleanPath}`;
}
