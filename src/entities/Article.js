// Mock implementation with localStorage persistence
const STORAGE_KEY = 'blog_articles';

const getArticlesFromStorage = () => {
  try {
    const articlesJSON = localStorage.getItem(STORAGE_KEY);
    return articlesJSON ? JSON.parse(articlesJSON) : [];
  } catch (error) {
    console.error('Error reading articles from storage:', error);
    return [];
  }
};

const saveArticlesToStorage = (articles) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Error saving articles to storage:', error);
  }
};

// Initial mock data
const initialArticles = [
  {
    id: "1",
    title: "Getting Started with React",
    subtitle: "Learn the basics of React development",
    content: "# Getting Started with React\n\nReact is a popular JavaScript library for building user interfaces. In this article, we'll explore the fundamentals.\n\n## What is React?\n\nReact makes it painless to create interactive UIs...",
    cover_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    category: "Technology",
    tags: ["React", "JavaScript", "Frontend"],
    published: true,
    published_date: "2024-01-15T10:00:00Z",
    reading_time: 5,
    created_date: "2024-01-10T08:00:00Z"
  }
];

// Initialize storage with mock data if empty
const initializeStorage = () => {
  const existing = getArticlesFromStorage();
  if (existing.length === 0) {
    saveArticlesToStorage(initialArticles);
  }
};

initializeStorage();

export const Article = {
  async filter(filters = {}, sort = "") {
    let articles = getArticlesFromStorage();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...articles]; // Create a copy
    
    if (filters.published !== undefined) {
      filtered = filtered.filter(article => article.published === filters.published);
    }
    
    if (filters.id) {
      filtered = filtered.filter(article => article.id === filters.id);
    }
    
    if (filters.category) {
      filtered = filtered.filter(article => article.category === filters.category);
    }
    
    // Sort by date (newest first)
    if (sort && sort.includes('created_date') || sort.includes('published_date')) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.published_date || a.created_date);
        const dateB = new Date(b.published_date || b.created_date);
        return sort.startsWith('-') ? dateB - dateA : dateA - dateB;
      });
    }
    
    return filtered;
  },
  
  async list(sort = "") {
    return this.filter({}, sort);
  },
  
  async create(data) {
    const articles = getArticlesFromStorage();
    const newArticle = {
      id: Date.now().toString(), // Simple ID generation
      ...data,
      created_date: new Date().toISOString(),
    };
    
    articles.push(newArticle);
    saveArticlesToStorage(articles);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return newArticle;
  },
  
  async update(id, data) {
    const articles = getArticlesFromStorage();
    const index = articles.findIndex(article => article.id === id);
    
    if (index !== -1) {
      articles[index] = { ...articles[index], ...data };
      saveArticlesToStorage(articles);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return articles[index];
    }
    
    throw new Error('Article not found');
  },
  
  async delete(id) {
    const articles = getArticlesFromStorage();
    const filteredArticles = articles.filter(article => article.id !== id);
    saveArticlesToStorage(filteredArticles);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
}