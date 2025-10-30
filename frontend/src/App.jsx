import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ArticleView from './pages/ArticleView'
import NewArticle from './pages/NewArticle'
import Calendar from './pages/Calendar'
import Contact from './pages/Contact'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleView />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* 秘密管理路由 - 只有你知道这些URL */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/new-article" element={<NewArticle />} />
        <Route path="/admin/edit-article/:id" element={<NewArticle />} />
      </Routes>
    </Layout>
  )
}

export default App