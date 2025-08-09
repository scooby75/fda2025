
// Utility function to create page URLs
export const createPageUrl = (page: string): string => {
  const routes: Record<string, string> = {
    Dashboard: '/dashboard',
    Backtesting: '/backtesting',
    UploadData: '/upload',
  }
  
  return routes[page] || '/'
}
