// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log(`Making API request to: ${url}`, config);
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 文章相关API
  articles = {
    // 获取文章列表
    getList: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/articles?${queryString}` : '/articles';
      
      return this.request(url);
    },

    // 获取单篇文章
    getById: (id) => this.request(`/articles/${id}`),

    // 创建文章
    create: (articleData) => 
      this.request('/articles', {
        method: 'POST',
        body: articleData,
      }),

    // 更新文章
    update: (id, articleData) =>
      this.request(`/articles/${id}`, {
        method: 'PUT',
        body: articleData,
      }),

    // 删除文章
    delete: (id) =>
      this.request(`/articles/${id}`, {
        method: 'DELETE',
      }),

    // 获取统计信息
    getStats: () => this.request('/articles/stats'),

    // 新增：按分类获取文章
    getByCategory: (category) => 
      this.request(`/articles/category/${category}`),

    // 新增：获取已发布文章
    getPublished: () => 
      this.request('/articles/published'),

    // 新增：获取博客站点的文章（用于主站集成）
    getBlogArticles: (limit = 12) =>
      this.request(`/blog/api/articles?limit=${limit}`)
  };

  // 新增：博客相关API（如果与主站文章API不同）
  blog = {
    // 获取博客文章列表
    getArticles: (params = {}) => {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/blog/api/articles?${queryString}` : '/blog/api/articles';
      
      return this.request(url);
    },

    // 获取单篇博客文章
    getArticle: (id) => this.request(`/blog/api/articles/${id}`),
  };
}

export const apiService = new ApiService();