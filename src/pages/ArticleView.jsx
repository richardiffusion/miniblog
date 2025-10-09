import React, { useState, useEffect } from "react";
import { Article } from "@/entities/Article";
import { User } from "@/entities/User";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Clock, Tag, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ArticleView() {
  const navigate = useNavigate();
  const { id } = useParams(); // 获取路由参数
  const location = useLocation(); // 获取位置信息
  const [article, setArticle] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, [id, location.search]); // 添加依赖

  const loadData = async () => {
    let articleId = id;

    // 如果没有从路由参数获取到 ID，尝试从查询参数获取
    if (!articleId) {
      const urlParams = new URLSearchParams(location.search);
      articleId = urlParams.get("id");
    }

    if (!articleId) {
      navigate(createPageUrl("Home"));
      return;
    }

    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }

    const articles = await Article.filter({ id: articleId });
    if (articles.length > 0) {
      setArticle(articles[0]);
    } else {
      navigate(createPageUrl("Home"));
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    await Article.delete(article.id);
    navigate(createPageUrl("Dashboard"));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-12 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) return null;

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

          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
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

            {user && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation(); // 防止事件冒泡
                    e.preventDefault(); // 防止默认行为
                    console.log('Edit button clicked for article:', article.id);
                    navigate(`/new-article?id=${article.id}`);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
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

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}