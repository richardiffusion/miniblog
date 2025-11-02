import React, { useState, useEffect } from "react";
import { Article } from "@/entities/Article";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Calendar() {
  const [articles, setArticles] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // 始终显示今天所在的月份
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const data = await Article.filter({ published: true });
    setArticles(data);
    
    // 设置默认选中的日期（但不改变当前显示的月份）
    setDefaultSelectedDate(data);
    setLoading(false);
  };

  // 设置默认选中的日期（但不改变当前月份显示）
  const setDefaultSelectedDate = (articlesData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 检查今天是否有文章
    const todayArticles = articlesData.filter((article) => {
      const articleDate = new Date(article.published_date || article.created_date);
      articleDate.setHours(0, 0, 0, 0);
      return isSameDay(articleDate, today);
    });

    if (todayArticles.length > 0) {
      // 如果今天有文章，选择今天
      setSelectedDate(today);
      return;
    }

    // 如果今天没有文章，找到最近一天有文章的日期
    const articlesWithDates = articlesData.map((article) => {
      const articleDate = new Date(article.published_date || article.created_date);
      articleDate.setHours(0, 0, 0, 0);
      return {
        ...article,
        date: articleDate
      };
    });

    // 按日期降序排序（最新的在前面）
    articlesWithDates.sort((a, b) => b.date - a.date);

    // 找到第一个在今天或今天之前的文章日期
    const recentArticle = articlesWithDates.find(article => article.date <= today);

    if (recentArticle) {
      // 选择最近的有文章的日期
      setSelectedDate(recentArticle.date);
      // 注意：这里不再设置 currentDate，保持当前月份为今天
    } else if (articlesWithDates.length > 0) {
      // 如果所有文章都在未来，选择最新的文章日期
      const latestArticle = articlesWithDates[0];
      setSelectedDate(latestArticle.date);
      // 同样，不设置 currentDate
    }
    // 如果没有文章，selectedDate 保持为 null
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const getArticlesForDate = (date) => {
    return articles.filter((article) => {
      const articleDate = new Date(article.published_date || article.created_date);
      return isSameDay(articleDate, date);
    });
  };

  const selectedArticles = selectedDate ? getArticlesForDate(selectedDate) : [];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // 添加一个函数来检查选中的日期是否在当前显示的月份中
  const isSelectedDateInCurrentMonth = selectedDate && isSameMonth(selectedDate, currentDate);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Publishing Calendar</h1>
        <p className="text-gray-600">View all published articles by date</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const today = new Date();
                      setCurrentDate(today);
                      setSelectedDate(today);
                    }}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
              ) : (
                <div>
                  {/* 如果选中的日期不在当前月份，显示提示 */}
                  {selectedDate && !isSelectedDateInCurrentMonth && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      Currently viewing articles from {format(selectedDate, "MMMM d, yyyy")}. 
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-700 ml-1"
                        onClick={() => setCurrentDate(selectedDate)}
                      >
                        Switch to {format(selectedDate, "MMMM")}
                      </Button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {dateRange.map((date, index) => {
                      const dayArticles = getArticlesForDate(date);
                      const isCurrentMonth = isSameMonth(date, currentDate);
                      const isToday = isSameDay(date, new Date());
                      const isSelected = selectedDate && isSameDay(date, selectedDate);

                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(date)}
                          className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : dayArticles.length > 0
                              ? "border-blue-200 bg-blue-50/50 hover:border-blue-400"
                              : "border-gray-100 hover:border-gray-300"
                          } ${!isCurrentMonth && "opacity-30"} ${
                            isToday && "ring-2 ring-blue-500"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`text-sm font-medium ${
                                isCurrentMonth ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {format(date, "d")}
                            </span>
                            {dayArticles.length > 0 && (
                              <div className="flex gap-0.5">
                                {dayArticles.slice(0, 3).map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 h-1 rounded-full bg-blue-500"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-none shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a Date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedArticles.length > 0 ? (
                <div className="space-y-4">
                  {selectedArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {article.category}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : selectedDate ? (
                <p className="text-gray-500 text-center py-8">No articles published on this date</p>
              ) : (
                <p className="text-gray-500 text-center py-8">Click on a date to view articles</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}