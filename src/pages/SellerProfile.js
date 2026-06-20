import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';

export const SellerProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 出品者プロフAPIから、この出品者の商品だけを安全に取得
        fetch(`${API_BASE_URL}/api/users/${userId}/items`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setItems(data.items || []);
                }
            })
            .catch(err => console.error("⚠️ 出品者商品の取得失敗:", err))
            .finally(() => setLoading(false));
    }, [userId]);

    const styles = {
        outerContainer: { backgroundColor: '#0D0E12', minHeight: '100vh', color: '#FFFFFF', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', display: 'flex', justifyContent: 'center' },
        innerContainer: { width: '100%', maxWidth: '480px', padding: '80px 16px 140px 16px', boxSizing: 'border-box' },
        profileHeader: { backgroundColor: '#161822', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '32px', textAlign: 'center' },
        avatar: { fontSize: '48px', marginBottom: '12px' },
        username: { fontSize: '20px', fontWeight: '750', color: '#FFFFFF', margin: '0 0 4px 0' },
        userIdText: { fontSize: '12px', color: '#6B7280', margin: 0 },
        sectionTitle: { fontSize: '14px', fontWeight: '700', color: '#9CA3AF', marginBottom: '16px', paddingLeft: '4px' },
        
        // 出品商品一覧のグリッドレイアウト
        grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
        card: { backgroundColor: '#161822', borderRadius: '16px', padding: '12px', border: '1px solid rgba(255, 255, 255, 0.03)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px' },
        emojiBox: { aspectRatio: '1', backgroundColor: '#1F222F', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px' },
        itemTitle: { fontSize: '13px', fontWeight: '600', color: '#E5E7EB', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
        itemPrice: { fontSize: '14px', fontWeight: '750', color: '#00f2fe', margin: 0 }
    };

    const getEmoji = (category) => {
        const mapping = { clothing: '👕', electronics: '💻', books: '📚', food: '🍏', rrr: '📦' };
        return mapping[category?.toLowerCase()] || '🎁';
    };

    return (
        <div style={styles.outerContainer}>
            <Header />
            <div style={styles.innerContainer}>
                
                {/* 出品者の簡易プロフィールカード（売上金や履歴は見えないので安全） */}
                <div style={styles.profileHeader}>
                    <div style={styles.avatar}>👤</div>
                    <h2 style={styles.username}>出品者ショップ</h2>
                    <p style={styles.userIdText}>ユーザーID: {userId}</p>
                </div>

                <h3 style={styles.sectionTitle}>出品中の商品 ({items.length})</h3>

                {loading ? (
                    <div style={{color: '#9CA3AF', textAlign: 'center', padding: '40px 0'}}>読み込み中...</div>
                ) : items.length === 0 ? (
                    <div style={{color: '#6B7280', textAlign: 'center', padding: '40px 0', fontSize: '14px'}}>現在、出品中の商品はありません。</div>
                ) : (
                    <div style={styles.grid}>
                        {items.map(item => (
                            <div key={item.id} style={styles.card} onClick={() => navigate(`/items/${item.id}`)}>
                                <div style={styles.emojiBox}>{getEmoji(item.category)}</div>
                                <p style={styles.itemTitle}>{item.title}</p>
                                <p style={styles.itemPrice}>¥{item.price?.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <Navbar />
        </div>
    );
};