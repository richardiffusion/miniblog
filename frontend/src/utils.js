export function createPageUrl(pageName) {
  const routes = {
    Home: '/',
    Calendar: '/calendar',
    Contact: '/contact',
  }
  return routes[pageName] || '/'
}