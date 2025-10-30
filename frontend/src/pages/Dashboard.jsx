import React, { useState, useEffect } from "react";
import { Article } from "@/entities/Article";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      console.log('Loading articles...');
      const data = await Article.list("-created_date");
      console.log('Articles loaded:', data);
      
      // 确保每个文章都有 id 字段
      const articlesWithIds = data.map(article => {
        if (!article.id && article._id) {
          console.log('Found article with _id, mapping to id:', article._id);
          return { ...article, id: article._id };
        }
        return article;
      });
      
      setArticles(articlesWithIds);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (article) => {
    console.log('Toggling published for article:', article.id, article.title);
    
    if (!article.id) {
      console.error('No article ID for toggle:', article);
      alert('Cannot update article: Missing ID');
      return;
    }

    try {
      const updatedData = {
        ...article,
        published: !article.published,
        published_date: !article.published ? new Date().toISOString() : article.published_date,
      };
      await Article.update(article.id, updatedData);
      await loadArticles();
    } catch (error) {
      console.error('Error toggling published:', error);
      alert('Failed to update article');
    }
  };

  const deleteArticle = async (articleId) => {
    console.log('Delete button clicked for article:', articleId);
    
    // 验证 ID
    if (!articleId) {
      console.error('No article ID provided for deletion');
      
      // 查找可能的问题
      const problemArticle = articles.find(a => !a.id && !a._id);
      if (problemArticle) {
        console.error('Problem article found:', problemArticle);
      }
      
      alert('Cannot delete article: Missing ID');
      return;
    }

    // 确认删除
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      console.log('Proceeding with deletion for article:', articleId);
      
      await Article.delete(articleId);
      console.log('Article deleted successfully');
      
      await loadArticles();
      
    } catch (error) {
      console.error('Error deleting article:', error);
      alert(`Failed to delete article: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.published).length,
    drafts: articles.filter((a) => !a.published).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Article Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your blog content</p>
        </div>
        <Link to="/admin/new-article">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-green-700">{stats.published}</p>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-blue-700">{stats.drafts}</p>
              <EyeOff className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No articles yet. Create your first article!</p>
              <Link to="/admin/new-article">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => {
                    console.log('Rendering article:', article.id, article.title); // 调试
                    return (
                      <TableRow key={article.id || article._id}>
                        <TableCell className="font-medium">
                          <Link
                            to={`/article/${article.id || article._id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{article.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => togglePublished(article)}
                            className="flex items-center gap-1"
                          >
                            {article.published ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                <Eye className="w-3 h-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Draft
                              </Badge>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(article.created_date), "MMM d, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/edit-article/${article.id || article._id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteArticle(article.id || article._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}