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
  };
}

export const apiService = new ApiService();