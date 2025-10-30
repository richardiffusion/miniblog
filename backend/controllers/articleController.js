import Article from '../models/Article.js';

// 获取所有文章（支持筛选和分页）
export const getArticles = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};

// 根据ID获取单篇文章
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: '文章未找到' });
    }

    // 增加阅读量（如果是已发布文章）
    if (article.published) {
      article.views += 1;
      await article.save();
    }

    res.json(article);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: '文章未找到' });
    }
    res.status(500).json({ error: error.message });
  }
};

// 创建新文章
export const createArticle = async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
};

// 更新文章
export const updateArticle = async (req, res) => {
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
      return res.status(404).json({ error: '文章未找到' });
    }

    res.json(article);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: '文章未找到' });
    }
    res.status(400).json({ error: error.message });
  }
};

// 删除文章
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: '文章未找到' });
    }

    res.json({ message: '文章删除成功' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: '文章未找到' });
    }
    res.status(500).json({ error: error.message });
  }
};

// 获取文章统计
export const getArticleStats = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};