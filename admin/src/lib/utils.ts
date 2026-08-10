export function getImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('data:')) return url;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.startsWith('http://localhost') || url.startsWith('https://localhost') || url.startsWith('http://127.0.0.1')) {
      const cleanPath = url.replace(/^https?:\/\/[^\/]+/, '');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const backendBase = apiUrl.replace(/\/api\/?$/, '');
      return `${backendBase}${cleanPath}`;
    }
    return url;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const backendBase = apiUrl.replace(/\/api\/?$/, '');

  let cleanPath = url;
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  return `${backendBase}${cleanPath}`;
}
