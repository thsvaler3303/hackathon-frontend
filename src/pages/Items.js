import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';


const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';

export const Items = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/recommendations`);
                const data = await response.json();
                
                if (response.ok && data.status === 'success') {
                    setRecommendations(data.recommendations);
                } else {
                    setError('おすすめ商品の取得に失敗しました。');
                }
            } catch (err) {
                setError('サーバーとの通信に失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);


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
            maxWidth: '480px', // スマホアプリ幅
            padding: '80px 16px 100px 16px', //ヘッダーとナビの隙間を確保
            boxSizing: 'border-box',
        },
        aiSection: {
            marginBottom: '32px',
        },
        aiHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
        },
        aiBadge: {
            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
            color: '#0D0E12',
            fontSize: '11px',
            fontWeight: '800',
            padding: '4px 8px',
            borderRadius: '20px',
            letterSpacing: '0.5px',
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '750',
            color: '#FFFFFF',
            margin: 0,
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
            transition: 'transform 0.2s',
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
            color: '#9CA3AF',
            backgroundColor: 'rgba(0, 242, 254, 0.05)',
            borderLeft: '2px solid #00f2fe',
            padding: '4px 6px',
            borderRadius: '0 4px 4px 0',
            marginTop: '4px',
            lineHeight: '1.3',
        },
        statusMessage: {
            textAlign: 'center',
            color: '#9CA3AF',
            padding: '40px 0',
            fontSize: '14px',
        }
    };

    //ジャンルごとのおすすめ絵文字マッピング
    const getEmoji = (category) => {
        const mapping = {
            clothing: '👕',
            electronics: '💻',
            books: '📚',
            food: '🍏',
            rrr: '📦'
        };
        return mapping[category?.toLowerCase()] || '🎁';
    };

    return (
        <div style={styles.outerContainer}>
            {/* 全画面共通の検索窓ヘッダー */}
            <Header />

            <div style={styles.innerContainer}>
                <div style={styles.aiSection}>
                    <div style={styles.aiHeader}>
                        <span style={styles.aiBadge}>AI RECOMMEND</span>
                        <h2 style={styles.sectionTitle}>あなたへのおすすめ</h2>
                    </div>

                    {loading && <div style={styles.statusMessage}>AIが好みを分析中...</div>}
                    {error && <div style={{...styles.statusMessage, color: '#EF4444'}}>{error}</div>}
                    
                    {!loading && !error && recommendations.length === 0 && (
                        <div style={styles.statusMessage}>おすすめの商品がまだありません。</div>
                    )}

                    {!loading && !error && recommendations.length > 0 && (
                        <div style={styles.grid}>
                            {recommendations.map((item) => (
                                <div 
                                    key={item.id} 
                                    style={styles.card}
                                    onClick={() => window.location.href = `/items/${item.id}`}
                                >
                                    {/* 商品画像エリア（ダミー絵文字） */}
                                    <div style={styles.imagePlaceholder}>
                                        {getEmoji(item.category)}
                                        <span style={styles.categoryBadge}>{item.category}</span>
                                    </div>
                                    
                                    {/* 商品情報エリア */}
                                    <div style={styles.infoArea}>
                                        <div style={styles.price}>¥{item.price?.toLocaleString()}</div>
                                        <h3 style={styles.itemTitle}>{item.title}</h3>
                                        {/* AIからの一言おすすめ理由 */}
                                        <div style={styles.aiReason}>
                                            💡 {item.ai_reason}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* スマホ用下部ナビゲーションバー */}
            <Navbar />
        </div>
    );
};