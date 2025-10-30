import React, { useState, useEffect } from "react";
import { Article } from "@/entities/Article";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function ArticleView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log('Loading article data for ID:', id);
      
      if (!id) {
        console.log('No ID provided, redirecting to home');
        navigate(createPageUrl("Home"));
        return;
      }

      try {
        // 使用新的 getById 方法直接获取单篇文章
        const articleData = await Article.getById(id);
        console.log('Found article:', articleData);
        
        if (articleData) {
          setArticle(articleData);
        } else {
          console.log('No article found, redirecting to home');
          navigate(createPageUrl("Home"));
        }
      } catch (error) {
        console.error('Error loading article:', error);
        navigate(createPageUrl("Home"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-12 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <Link to={createPageUrl("Home")} className="text-blue-600 hover:text-blue-800">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            to={createPageUrl("Home")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-blue-100 text-blue-700">
                <Tag className="w-3 h-3 mr-1" />
                {article.category}
              </Badge>
              {article.reading_time && (
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.reading_time} min read
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(article.published_date || article.created_date), "MMMM d, yyyy")}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xl text-gray-600">{article.subtitle}</p>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {article.cover_image && (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <article className="prose prose-lg prose-blue max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}