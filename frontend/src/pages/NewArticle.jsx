import React, { useState, useEffect } from "react";
import { Article } from "@/entities/Article";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye, Upload, Loader2, User } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "@/hooks/useAuth"; // admin auth hook
import { Badge } from "@/components/ui/badge"; // admin badge


export default function NewArticle() {
  const navigate = useNavigate();
  const { id } = useParams(); // 从路由参数获取 ID
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [articleData, setArticleData] = useState({
    title: "",
    subtitle: "",
    content: "",
    cover_image: "",
    category: "Personal",
    tags: [],
    published: false,
    reading_time: 0,
  });
  const [tagInput, setTagInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth(); // get current user info

  useEffect(() => {
    console.log('NewArticle mounted with ID:', id); // 调试
    
    if (id) {
      setIsEditMode(true);
      loadArticle(id);
    }
  }, [id]); // 依赖 id

  useEffect(() => {
    calculateReadingTime();
  }, [articleData.content]);

  const loadArticle = async (articleId) => {
    try {
      console.log('Loading article for editing:', articleId);
      const article = await Article.getById(articleId); // 使用 getById 方法
      console.log('Article loaded for editing:', article);
      
      if (article) {
        setArticleData({
          title: article.title || "",
          subtitle: article.subtitle || "",
          content: article.content || "",
          cover_image: article.cover_image || "",
          category: article.category || "Personal",
          tags: article.tags || [],
          published: article.published || false,
          reading_time: article.reading_time || 0,
        });
      } else {
        console.error('Article not found for editing:', articleId);
        alert('Article not found');
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error('Error loading article for editing:', error);
      alert('Error loading article');
      navigate("/admin/dashboard");
    }
  };

  const calculateReadingTime = () => {
    const wordsPerMinute = 200;
    const words = articleData.content.split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    setArticleData((prev) => ({ ...prev, reading_time: time }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !articleData.tags.includes(tagInput.trim())) {
      setArticleData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setArticleData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async (publish = false) => {
    if (!articleData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!articleData.content.trim()) {
      alert('Please enter content');
      return;
    }

    setLoading(true);
    
    try {
      const dataToSave = {
        ...articleData,
        published: publish,
        published_date: publish ? new Date().toISOString() : articleData.published_date,
      };

      let savedArticle;
      if (isEditMode && id) {
        console.log('Updating article:', id, dataToSave);
        savedArticle = await Article.update(id, dataToSave);
      } else {
        console.log('Creating new article:', dataToSave);
        savedArticle = await Article.create(dataToSave);
      }

      console.log('Article saved:', savedArticle);
      
      // 导航到 Dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          {/* 添加管理员徽章 */}
          {user && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <User className="w-3 h-3 mr-1" />
              {user.username}
            </Badge>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={loading || !articleData.title}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={loading || !articleData.title}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {isEditMode ? "Edit Article" : "Create New Article"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter article title..."
              value={articleData.title}
              onChange={(e) => setArticleData({ ...articleData, title: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              placeholder="Enter a short subtitle or excerpt..."
              value={articleData.subtitle}
              onChange={(e) => setArticleData({ ...articleData, subtitle: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={articleData.category}
                onChange={(e) => setArticleData({ ...articleData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Personal">Personal</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-image">Cover Image URL</Label>
              <Input
                id="cover-image"
                placeholder="Enter image URL..."
                value={articleData.cover_image}
                onChange={(e) => setArticleData({ ...articleData, cover_image: e.target.value })}
                className="flex-1"
              />
              {articleData.cover_image && (
                <img
                  src={articleData.cover_image}
                  alt="Cover preview"
                  className="mt-2 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {articleData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <div className="min-h-96">
              <ReactQuill
                theme="snow"
                value={articleData.content}
                onChange={(value) => setArticleData({ ...articleData, content: value })}
                className="h-80"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-500 pt-4">
            Estimated reading time: {articleData.reading_time} minute{articleData.reading_time !== 1 ? "s" : ""}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}