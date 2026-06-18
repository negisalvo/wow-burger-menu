export function getImageSrc(url: any): string {
  if (!url) return '';
  if (typeof url === 'object' && url !== null) {
    return (url as any).src || '';
  }
  return String(url);
}
