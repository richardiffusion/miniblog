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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/article" element={<ArticleView />} />
        <Route path="/article/:id" element={<ArticleView />} />
        <Route path="/new-article" element={<NewArticle />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  )
}

export default App