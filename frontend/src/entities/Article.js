import { apiService } from '@/services/api';

export const Article = {
  async filter(filters = {}, sort = '') {
    try {
      const params = { ...filters };
      
      // 处理排序
      if (sort) {
        // 这里可以根据需要添加排序参数
        console.log('Sort parameter:', sort);
      }

      const response = await apiService.articles.getList(params);
      console.log('API response for filter:', response);
      return response.articles || response;
    } catch (error) {
      console.error('Error in Article.filter:', error);
      throw error;
    }
  },

  async list(sort = '') {
    try {
      return await this.filter({}, sort);
    } catch (error) {
      console.error('Error in Article.list:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      console.log('Creating article:', data);
      const result = await apiService.articles.create(data);
      console.log('Article created:', result);
      return result;
    } catch (error) {
      console.error('Error in Article.create:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      console.log('Updating article:', id, data);
      const result = await apiService.articles.update(id, data);
      console.log('Article updated:', result);
      return result;
    } catch (error) {
      console.error('Error in Article.update:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      console.log('Deleting article:', id);
      const result = await apiService.articles.delete(id);
      console.log('Article deleted:', result);
      return result;
    } catch (error) {
      console.error('Error in Article.delete:', error);
      throw error;
    }
  },

  // 新方法：根据ID获取单篇文章
  async getById(id) {
    try {
      console.log('Getting article by ID:', id);
      const result = await apiService.articles.getById(id);
      console.log('Article found:', result);
      return result;
    } catch (error) {
      console.error('Error in Article.getById:', error);
      throw error;
    }
  },

  // 新方法：获取统计信息
  async getStats() {
    try {
      console.log('Getting article stats');
      const result = await apiService.articles.getStats();
      console.log('Article stats:', result);
      return result;
    } catch (error) {
      console.error('Error in Article.getStats:', error);
      throw error;
    }
  }
};