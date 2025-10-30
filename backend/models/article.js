import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Article content is required']
  },
  cover_image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['Technology', 'Lifestyle', 'Business', 'Design', 'Personal', 'Travel', 'Other'],
    default: 'Personal'
  },
  tags: [{
    type: String,
    trim: true
  }],
  published: {
    type: Boolean,
    default: false
  },
  published_date: {
    type: Date,
    default: null
  },
  reading_time: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: {
    createdAt: 'created_date',
    updatedAt: 'updated_date'
  }
});

// 发布时自动设置发布时间
articleSchema.pre('save', function(next) {
  if (this.published && !this.published_date) {
    this.published_date = new Date();
  }
  next();
});

articleSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// 计算阅读时间
articleSchema.methods.calculateReadingTime = function() {
  const wordsPerMinute = 200;
  const words = this.content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// 静态方法：获取已发布文章
articleSchema.statics.getPublished = function() {
  return this.find({ published: true }).sort({ published_date: -1 });
};

// 静态方法：按分类获取文章
articleSchema.statics.getByCategory = function(category) {
  return this.find({ published: true, category }).sort({ published_date: -1 });
};

const Article = mongoose.model('Article', articleSchema);
export default Article;