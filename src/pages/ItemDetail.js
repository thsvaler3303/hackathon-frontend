import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';


const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';
const TEST_USER_ID = 1; 

export const ItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    //編集モーダル用の状態管理
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editCategory, setEditCategory] = useState('clothing');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchItemDetail = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/items`);
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                const foundItem = data.items.find(i => i.id === parseInt(id));
                if (foundItem) {
                    setItem(foundItem);
                    // 編集用に初期値をセット
                    setEditTitle(foundItem.title);
                    setEditPrice(foundItem.price);
                    setEditDesc(foundItem.description);
                    setEditCategory(foundItem.category);
                } else {
                    setError('指定された商品が見つかりませんでした。');
                }
            } else {
                setError('商品情報の取得に失敗しました。');
            }
        } catch (err) {
            setError('サーバーとの通信に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItemDetail();
        //警告対策
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // 編集の保存を実行する関数
    const handleUpdate = async () => {
        setActionLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editTitle,
                    price: parseInt(editPrice),
                    description: editDesc,
                    category: editCategory
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert('🎉 商品情報を更新しました！');
                setShowEditModal(false);
                fetchItemDetail(); // 画面を再読み込みして最新状態にする
            }
        } catch (err) {
            alert('編集の送信に失敗しました');
        } finally {
            setActionLoading(false);
        }
    };

    //削除を実行する関数
    const handleDelete = async () => {
        if (!window.confirm('本当にこの出品を削除しますか？この操作は取り消せません。')) return;
        setActionLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert('🗑️ 商品を削除しました。');
                window.location.href = '/profile'; // マイページに戻る
            }
        } catch (err) {
            alert('削除に失敗しました');
        } finally {
            setActionLoading(false);
        }
    };

    //スタイル
    const styles = {
        outerContainer: { backgroundColor: '#0D0E12', minHeight: '100vh', color: '#FFFFFF', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', display: 'flex', justifyContent: 'center' },
        innerContainer: { width: '100%', maxWidth: '480px', padding: '80px 16px 140px 16px', boxSizing: 'border-box' },
        imageContainer: { width: '100%', aspectRatio: '4 / 3', backgroundColor: '#161822', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '64px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '24px' },
        price: { fontSize: '32px', fontWeight: '800', color: '#00f2fe', marginBottom: '16px' },
        title: { fontSize: '22px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 12px 0', lineHeight: '1.4' },
        badge: { backgroundColor: '#1F222F', color: '#9CA3AF', fontSize: '12px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', marginRight: '8px' },
        descriptionBox: { backgroundColor: '#161822', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255, 255, 255, 0.05)', lineHeight: '1.7', color: '#E5E7EB', fontSize: '15px', whiteSpace: 'pre-wrap', marginTop: '8px' },
        actionArea: { position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', padding: '0 16px', boxSizing: 'border-box', zIndex: 900 },
        buyButton: { width: '100%', background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', border: 'none', borderRadius: '14px', padding: '18px', color: '#0D0E12', fontSize: '16px', fontWeight: '750', cursor: 'pointer', boxShadow: '0 8px 25px rgba(0, 242, 254, 0.3)', textAlign: 'center' },
        
        //モーダルのスタイル
        modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(5, 5, 5, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '16px', boxSizing: 'border-box' },
        modalCard: { backgroundColor: '#161822', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '14px' },
        input: { width: '100%', backgroundColor: '#1F222F', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px', color: '#FFFFFF', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
        textarea: { width: '100%', backgroundColor: '#1F222F', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '12px', color: '#FFFFFF', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', resize: 'vertical', outline: 'none' }
    };

    const getEmoji = (category) => {
        const mapping = { clothing: '👕', electronics: '💻', books: '📚', food: '🍏', rrr: '📦' };
        return mapping[category?.toLowerCase()] || '🎁';
    };

    if (loading) return <div style={styles.outerContainer}><div style={{textAlign: 'center', color: '#9CA3AF', padding: '100px 0'}}>ロード中...</div></div>;
    if (error) return <div style={styles.outerContainer}><div style={{textAlign: 'center', color: '#EF4444', padding: '100px 0'}}>{error}</div></div>;
    if (!item) return null;

    return (
        <div style={styles.outerContainer}>
            <Header />

            <div style={styles.innerContainer}>
                <div style={styles.imageContainer}>{getEmoji(item.category)}</div>
                <div style={styles.price}>¥{item.price?.toLocaleString()}</div>
                <h1 style={styles.title}>{item.title}</h1>

                <div style={{display: 'flex', marginBottom: '24px'}}>
                    <span style={styles.badge}>カテゴリー: {item.category}</span>
                    <span style={styles.badge}>出品者ID: {item.user_id}</span>
                </div>

                <div style={{fontSize: '12px', color: '#6B7280', fontWeight: '600'}}>商品説明</div>
                <div style={styles.descriptionBox}>{item.description}</div>

                {/* 🔒 ボタンの動的切り替えロジック */}
                <div style={styles.actionArea}>
                    {item.user_id === TEST_USER_ID ? (
                        <button 
                            style={{...styles.buyButton, background: 'linear-gradient(90deg, #374151 0%, #1F222F 100%)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'none'}}
                            onClick={() => setShowEditModal(true)}
                        >
                            ⚙️ この出品を編集・削除する
                        </button>
                    ) : (
                        <button style={styles.buyButton} onClick={() => window.location.href = `/items/${item.id}/checkout`}>
                            購入手続きへ進む
                        </button>
                    )}
                </div>
            </div>

            {/* 編集・削除ポップアップモーダル */}
            {showEditModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <h3 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700'}}>出品内容の編集</h3>
                        
                        <input style={styles.input} type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="商品名" />
                        <input style={styles.input} type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="価格" />
                        <textarea style={styles.textarea} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="商品説明" />
                        
                        <select style={styles.input} value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                            <option value="clothing">👕 ファッション・古着</option>
                            <option value="electronics">💻 家電・ガジェット</option>
                            <option value="books">📚 本・メディア</option>
                            <option value="food">🍏 食品・飲料</option>
                            <option value="rrr">📦 その他</option>
                        </select>

                        <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                            <button style={{flex: 1, backgroundColor: 'transparent', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'}} onClick={handleDelete} disabled={actionLoading}>
                                🗑️ 削除
                            </button>
                            <button style={{flex: 1, backgroundColor: '#1F222F', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontSize: '13px'}} onClick={() => setShowEditModal(false)}>
                                キャンセル
                            </button>
                            <button style={{flex: 1, background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', border: 'none', color: '#0D0E12', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: '700'}} onClick={handleUpdate} disabled={actionLoading}>
                                {actionLoading ? '保存中...' : '変更を保存'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Navbar />
        </div>
    );
};