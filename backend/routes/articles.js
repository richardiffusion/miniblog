import express from 'express';
import Article from '../models/article.js';

const router = express.Router();

// 获取所有文章（支持筛选和分页）
router.get('/', async (req, res) => {
  try {
    const { 
      published, 
      category, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    let filter = {};
    
    // 发布状态筛选
    if (published !== undefined) {
      filter.published = published === 'true';
    }
    
    // 分类筛选
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    // 搜索功能
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const articles = await Article.find(filter)
      .sort({ published_date: -1, created_date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(filter);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error in GET /articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取文章统计
router.get('/stats', async (req, res) => {
  try {
    const total = await Article.countDocuments();
    const published = await Article.countDocuments({ published: true });
    const drafts = await Article.countDocuments({ published: false });
    
    // 按分类统计
    const categoryStats = await Article.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      total,
      published,
      drafts,
      categoryStats
    });
  } catch (error) {
    console.error('Error in GET /articles/stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// 根据ID获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // 增加阅读量（如果是已发布文章）
    if (article.published) {
      article.views += 1;
      await article.save();
    }

    res.json(article);
  } catch (error) {
    console.error('Error in GET /articles/:id:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// 创建新文章
router.post('/', async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      reading_time: Math.ceil(req.body.content.split(/\s+/).length / 200)
    };

    // 如果发布，设置发布时间
    if (articleData.published && !articleData.published_date) {
      articleData.published_date = new Date();
    }

    const article = new Article(articleData);
    await article.save();

    res.status(201).json(article);
  } catch (error) {
    console.error('Error in POST /articles:', error);
    res.status(400).json({ error: error.message });
  }
});

// 更新文章
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // 重新计算阅读时间
    if (updates.content) {
      updates.reading_time = Math.ceil(updates.content.split(/\s+/).length / 200);
    }

    // 如果从未发布变为发布，设置发布时间
    if (updates.published === true) {
      const existingArticle = await Article.findById(req.params.id);
      if (existingArticle && !existingArticle.published) {
        updates.published_date = new Date();
      }
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error in PUT /articles/:id:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(400).json({ error: error.message });
  }
});

// 删除文章
router.delete('/:id', async (req, res) => {
  try {
    console.log('Received delete request for article ID:', req.params.id);
    
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      console.log('Article not found for deletion:', req.params.id);
      return res.status(404).json({ error: 'Article not found' });
    }
    
    console.log('Article deleted successfully:', req.params.id);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /articles/:id:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;