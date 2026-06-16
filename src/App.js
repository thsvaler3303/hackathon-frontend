import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Items } from './pages/Items';
import { SearchResults } from './pages/SearchResults';
import { ItemDetail } from './pages/ItemDetail';
import { Checkout } from './pages/Checkout';
import { Upload } from './pages/Upload';
import { Profile } from './pages/Profile'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* トップ（/）にアクセスしたら、メインのおすすめ画面へ自動ジャンプ */}
        <Route path="/" element={<Navigate to="/items" replace />} />
        
        {/* フリマアプリの主要取引動線 */}
        <Route path="/items" element={<Items />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items/:id/checkout" element={<Checkout />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} /> 
        
        {/* ユーザー認証系 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;