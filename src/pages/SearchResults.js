import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';

export const SearchResults = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    //URLの後ろについているクエリパラメータ（取得するため
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q') || '';
    const categoryQuery = queryParams.get('category') || '';

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            setError('');
            try {
                //検索APIを叩く
                let url = `${API_BASE_URL}/api/items?q=${encodeURIComponent(searchQuery)}`;
                if (categoryQuery) {
                    url += `&category=${encodeURIComponent(categoryQuery)}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                
                if (response.ok && data.status === 'success') {
                    setItems(data.items);
                } else {
                    setError('検索結果の取得に失敗しました。');
                }
            } catch (err) {
                setError('サーバーとの通信に失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery, categoryQuery]); // 検索キーワードが変わるたびに再実行する

    //ダークUIのスタイル
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
        searchHeader: {
            marginBottom: '20px',
        },
        queryTitle: {
            fontSize: '16px',
            color: '#9CA3AF',
            margin: '0 0 4px 0',
            fontWeight: 'normal',
        },
        boldQuery: {
            color: '#00f2fe',
            fontWeight: '700',
        },
        resultCount: {
            fontSize: '13px',
            color: '#6B7280',
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
            gap: '4px',
        },
        price: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#FFFFFF',
        },
        itemTitle: {
            fontSize: '13px',
            color: '#9CA3AF',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        statusMessage: {
            textAlign: 'center',
            color: '#9CA3AF',
            padding: '6px 0',
            fontSize: '14px',
        }
    };

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
            <Header />

            <div style={styles.innerContainer}>
                <div style={styles.searchHeader}>
                    <h2 style={styles.queryTitle}>
                        「<span style={styles.boldQuery}>{searchQuery || 'すべての商品'}</span>」の検索結果
                    </h2>
                    {!loading && !error && (
                        <span style={styles.resultCount}>{items.length}件見つかりました</span>
                    )}
                </div>

                {loading && <div style={styles.statusMessage}>AIが商品データを抽出中...</div>}
                {error && <div style={{...styles.statusMessage, color: '#EF4444'}}>{error}</div>}
                
                {!loading && !error && items.length === 0 && (
                    <div style={styles.statusMessage}>一致する商品は見つかりませんでした。別のキーワードをお試しください。</div>
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Navbar />
        </div>
    );
};