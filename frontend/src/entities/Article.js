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
      // 确保新文章包含必要的字段
      const articleData = {
        ...data,
        author: data.author || 'Richard Li', // 确保有默认作者
        excerpt: data.excerpt || '', // 添加 excerpt 字段
        created_date: new Date().toISOString(), // 设置创建时间
        updated_date: new Date().toISOString(), // 设置更新时间
      };

      console.log('Creating article:', articleData);
      const result = await apiService.articles.create(articleData);
      console.log('Article created:', result);
      return result;
    } catch (error) {
      console.error('Error in Article.create:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      // 确保更新时设置更新时间
      const updateData = {
        ...data,
        excerpt: data.excerpt || '', // 添加 excerpt 字段
        updated_date: new Date().toISOString(), // 每次更新都刷新更新时间
      };

      console.log('Updating article:', id, updateData);
      const result = await apiService.articles.update(id, updateData);
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

  // 根据ID获取单篇文章
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

  // 获取统计信息
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
  },

  // 新增：按分类获取文章
  async getByCategory(category) {
    try {
      console.log('Getting articles by category:', category);
      const result = await apiService.articles.getByCategory(category);
      console.log('Category articles:', result);
      return result;
    } catch (error) {
      console.error('Error in Article.getByCategory:', error);
      throw error;
    }
  },

  // 新增：获取已发布文章
  async getPublished() {
    try {
      console.log('Getting published articles');
      const result = await apiService.articles.getPublished();
      console.log('Published articles:', result);
      return result;
    } catch (error) {
      console.error('Error in Article.getPublished:', error);
      throw error;
    }
  },

  // 新增：计算阅读时间（前端辅助方法）
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
};