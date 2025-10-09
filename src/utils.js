export function createPageUrl(pageName) {
  const routes = {
    Home: '/',
    Dashboard: '/dashboard',
    ArticleView: '/article', // 保持兼容性
    NewArticle: '/new-article',
    Calendar: '/calendar',
    Contact: '/contact',
  }
  return routes[pageName] || '/'
}