import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';

export const Search = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    //?q=xxxから検索ワードを抜き出す
    const queryParams = new URLSearchParams(window.location.search);
    const q = queryParams.get('q') || '';
    const cat = queryParams.get('cat') || ''; //追加

    useEffect(() => {
        const fetchSimilarItems = async () => {
            if (!q) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                // バックエンドにのAI類似検索を呼び出す
                // const response = await fetch(`${API_BASE_URL}/api/items/similar?q=${encodeURIComponent(q)}`);
                let apiUrl = `${API_BASE_URL}/api/items/similar?q=${encodeURIComponent(q)}`;
                if (cat) {
                    apiUrl += `&selected_category=${encodeURIComponent(cat)}`;
                }
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                if (response.ok && data.status === 'success') {
                    setItems(data.items);
                } else {
                    setError('類似商品の検索に失敗しました。');
                }
            } catch (err) {
                setError('サーバーとの通信に失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarItems();
    }, [q, cat]);  //「キーワードが変わった時だけでなく、選んだカテゴリが変わった時も検索

    const styles = {
        outerContainer: {
            backgroundColor: '#0D0E12',
            minHeight: '100vh',
            color: '#FFFFFF',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            justifyContent: 'center',
        },
        innerContainer: {
            width: '100%',
            maxWidth: '480px',
            padding: '80px 16px 100px 16px',
            boxSizing: 'border-box',
        },
        searchInfo: {
            marginBottom: '20px',
            fontSize: '14px',
            color: '#9CA3AF',
        },
        keyword: {
            color: '#00f2fe',
            fontWeight: 'bold',
            marginRight: '4px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '16px',
        },
        card: {
            backgroundColor: '#161822',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
        },
        imagePlaceholder: {
            width: '100%',
            aspectRatio: '1 / 1',
            backgroundColor: '#1F222F',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '32px',
            position: 'relative',
        },
        categoryBadge: {
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            backgroundColor: 'rgba(13, 14, 18, 0.75)',
            color: '#9CA3AF',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
        },
        infoArea: {
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flexGrow: 1,
        },
        price: {
            fontSize: '17px',
            fontWeight: '700',
            color: '#00f2fe', 
        },
        itemTitle: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#E5E7EB',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        aiReason: {
            fontSize: '11px',
            color: '#00f2fe',
            backgroundColor: 'rgba(0, 242, 254, 0.05)',
            borderLeft: '2px solid #00f2fe',
            padding: '4px 6px',
            borderRadius: '0 4px 4px 0',
            marginTop: '4px',
            fontWeight: 'bold',
        },
        statusMessage: {
            textAlign: 'center',
            color: '#9CA3AF',
            padding: '40px 0',
            fontSize: '14px',
        }
    };

    const getEmoji = (category) => {
        const mapping = {
            'ファッション': '👕',
            'ガジェット': '📱',
            '家電': '🔌',
            '本・ゲーム': '🎮',
            'その他': '📦'
        };
        return mapping[category] || '🎁';
    };

    return (
        <div style={styles.outerContainer}>
            {/* 上部検索ヘッダー */}
            <Header />

            <div style={styles.innerContainer}>
                <div style={styles.searchInfo}>
                    <span style={styles.keyword}>「{q}」</span>
                    {cat && <span style={{ color: '#E5E7EB', marginRight: '4px' }}>({cat})</span>}
                    のAI検索結果 ({items.length}件)
                </div>

                {loading && <div style={styles.statusMessage}>AIが意味を解析して検索中...</div>}
                {error && <div style={{...styles.statusMessage, color: '#EF4444'}}>{error}</div>}
                
                {!loading && !error && items.length === 0 && (
                    <div style={styles.statusMessage}>一致する商品が見つかりませんでした。</div>
                )}

                {!loading && !error && items.length > 0 && (
                    <div style={styles.grid}>
                        {items.map((item) => (
                            <div 
                                key={item.id} 
                                style={styles.card}
                                onClick={() => window.location.href = `/items/${item.id}`}
                            >
                                <div style={styles.imagePlaceholder}>
                                    {getEmoji(item.category)}
                                    <span style={styles.categoryBadge}>{item.category}</span>
                                </div>
                                
                                <div style={styles.infoArea}>
                                    <div style={styles.price}>¥{item.price?.toLocaleString()}</div>
                                    <h3 style={styles.itemTitle}>{item.title}</h3>
                                    {/* Geminiが計算したマッチ度を表示！ */}
                                    <div style={styles.aiReason}>
                                        🎯 AIマッチ度: {item.similarity_score}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 下部ナビゲーション */}
            <Navbar />
        </div>
    );
};