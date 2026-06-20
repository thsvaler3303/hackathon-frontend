import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Items } from './pages/Items';
import { ItemDetail } from './pages/ItemDetail';
import { Checkout } from './pages/Checkout';
import { Upload } from './pages/Upload';
import { Profile } from './pages/Profile'; 
import { Search } from './pages/Search'; 
import { AiConcierge } from './pages/AiConcierge';
import { SellerProfile } from './pages/SellerProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* トップ（/）にアクセスしたら、メインのおすすめ画面へ自動ジャンプ */}
        <Route path="/" element={<Navigate to="/items" replace />} />
        
        {/* フリマアプリの主要取引動線 */}
        <Route path="/items" element={<Items />} />
        
        {/*検索の案内所を、新しく作ったAI類似検索ページだけに */}
        <Route path="/search" element={<Search />} />

        {/*AIコンシェルジュ用の新しいルートを追加 */}
        <Route path="/concierge" element={<AiConcierge />} />

        {/*出品者プロフページへのルート追加*/}
        <Route path="/seller/:userId" element={<SellerProfile />} />
        
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