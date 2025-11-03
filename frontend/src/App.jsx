import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ArticleView from './pages/ArticleView'
import NewArticle from './pages/NewArticle'
import Calendar from './pages/Calendar'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Layout>
      <Routes>
        {/* 公开路由 */}
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleView />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* 受保护的管理员路由 */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/new-article" 
          element={
            <ProtectedRoute>
              <NewArticle />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/edit-article/:id" 
          element={
            <ProtectedRoute>
              <NewArticle />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Layout>
  )
}

export default App