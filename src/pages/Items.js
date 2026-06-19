import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; //追加
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';


const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';

export const Items = () => {
    const navigate = useNavigate();
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


    //初期商品の自動拡充APIを呼び出す関数
    const handleBulkGenerate = async () => {
        const confirmGenerate = window.confirm("Geminiにリアルな商品を20件自動生成させますか？（10〜15秒ほどかかります）");
        if (!confirmGenerate) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/debug/bulk-generate-items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            
            if (data.status === "success") {
                alert(data.message);
                // 商品が追加されたので、画面をリロードして最新の一覧にする
                window.location.reload();
            } else {
                alert("生成エラー: " + data.message);
            }
        } catch (error) {
            console.error("通信失敗:", error);
            alert("サーバーとの通信に失敗しました。");
        }
    };

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
        },

        /*追加：SOLD用のスタイル群 */
        soldBadge: {
            position: 'absolute',
            top: '12px',
            left: '-28px',
            backgroundColor: '#EF4444', // 赤色
            color: '#FFFFFF',
            fontWeight: '900',
            fontSize: '10px',
            padding: '4px 30px',
            transform: 'rotate(-45deg)',
            zIndex: 10,
            letterSpacing: '1px',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
        },
        soldDiagonalLine: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '150%', // 対角線をカバーする長さ
            height: '2px',
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            transform: 'rotate(45deg)',
            transformOrigin: 'top left',
            pointerEvents: 'none',
            zIndex: 5,
        }
    };

    //ジャンルごとのおすすめ絵文字マッピング
    const getEmoji = (category) => {
        const mapping = {
            clothing: '👕',
            electronics: '💻',
            books: '📚',
            food: '🍏',
            rrr: '📦',
            // 👇 Geminiが生成する日本語カテゴリ用
            'ファッション': '👕',
            'ガジェット': '📱',
            '家電': '🔌',
            '本・ゲーム': '🎮',
            'その他': '📦'
        };
        return mapping[category] || mapping[category?.toLowerCase()] || '🎁';
    };

    return (
        <div style={styles.outerContainer}>
            {/* 全画面共通の検索窓ヘッダー */}
            <Header />

            <div style={styles.innerContainer}>
                {/*開発時限定：商品自動生成ボタン */}
                <div style={{ padding: '0 0 24px 0', textAlign: 'center' }}>
                    <button 
                        onClick={handleBulkGenerate}
                        style={{
                            backgroundColor: '#161822',
                            color: '#00f2fe',
                            border: '1px solid rgba(0, 242, 254, 0.3)',
                            padding: '12px 20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            width: '100%',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.2s'
                        }}
                    >
                        開発用Geminiでリアルな商品を20件自動生成
                    </button>
                </div>

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
                            {recommendations.map((item) => {
                                const isSold = item.status === 'sold'; //ここでisSoldを安全に定義！
                                return ( 
                                <div 
                                    key={item.id} 
                                    style={{
                                        ...styles.card,
                                        // SOLDの場合は全体的なトーンを暗く、少し透明にする
                                        opacity: isSold ? 0.55 : 1,
                                        filter: isSold ? 'brightness(0.7)' : 'none'
                                    }}
                                    onClick={() => navigate(`/items/${item.id}`)} // SPA高速遷移へ変更
                                >

                                    {/* 🚨 売り切れ時のSOLDバッジと斜線のレンダリング */}
                                    {isSold && (
                                            <>
                                                <div style={styles.soldBadge}>SOLD</div>
                                                <div style={styles.soldDiagonalLine}></div>
                                            </>
                                        )}

                                    {/* 商品画像エリア（ダミー絵文字） */}
                                    <div style={styles.imagePlaceholder}>
                                        {getEmoji(item.category)}
                                        <span style={styles.categoryBadge}>{item.category}</span>
                                    </div>
                                    
                                    {/* 商品情報エリア */}
                                    <div style={styles.infoArea}>
                                        <div style={{
                                            ...styles.price,
                                            // SOLDの場合は値段の色をグレーに変更して区別
                                            color: isSold ? '#9CA3AF' : '#00f2fe'
                                        }}>¥{item.price?.toLocaleString()}</div>
                                        <h3 style={styles.itemTitle}>{item.title}</h3>
                                        {/* AIからの一言おすすめ理由 */}
                                        <div style={styles.aiReason}>
                                            💡 {item.ai_reason || 'あなたへのおすすめ商品'}
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* スマホ用下部ナビゲーションバー */}
            <Navbar />
        </div>
    );
};