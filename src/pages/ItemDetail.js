import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';


const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';
//const TEST_USER_ID = 1; 消した

export const ItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    //現在ログインしているユーザーのIDをlocalStorageから取得（未ログインならフォールバックで1）
    const currentUserId = String(localStorage.getItem('user_id') || '1');

    //いいねの分
    const [isFavorited, setIsFavorited] = useState(false);

    //コメント用の状態管理
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    
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

            // デバッグ　　　APIから今、実際に何件の商品が届いているかログに出す
            console.log("--- 詳細画面デバッグ ---");
            console.log("URLから取得した探したいID:", id, "(型:", typeof id, ")");
            console.log("APIから届いた全データ:", data);



            if (response.ok && data.status === 'success') {
                const foundItem = data.items.find(i => String(i.id) === String(id));
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


    // コメント一覧を取得する関数
    const fetchComments = async () => {
        if (!id) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/items/${id}/comments`);
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    setComments(data.comments || []);
                }
            }
        } catch (err) {
            console.error("コメント取得失敗:", err);
        }
    };

    useEffect(() => {
        fetchItemDetail();
        fetchComments(); //コメントの初回読み込み

        // 閲覧履歴を localStorage に保存する

        if (id) {
            // 現在の履歴を取得（なければ空の配列）
            let history = JSON.parse(localStorage.getItem('view_history') || '[]');
            
            // 重複を防ぐため、一度同じIDを削除
            history = history.filter(itemId => String(itemId) !== String(id));
            
            // 先頭に今回のIDを追加
            history.unshift(String(id));
            
            // 直近で見た10件分だけをキープ、多すぎると重くなるため制限する
            if (history.length > 10) {
                history = history.slice(0, 10);
            }
            
            // 保存し直す
            localStorage.setItem('view_history', JSON.stringify(history));
        }

        //警告対策
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);


    //いいね状態のチェックと切り替え処理

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            const currentUserId = localStorage.getItem('user_id');
            if (!currentUserId || !id) return;

            try {
                // バックエンドのステータスAPIを叩く
                const res = await fetch(`${API_BASE_URL}/api/items/${id}/favorite/status?user_id=${currentUserId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'success') {
                        setIsFavorited(data.is_favorited); // サーバから届いた「True/False」をセット
                    }
                }
            } catch (err) {
                console.error("いいね状態の取得に失敗しました", err);
            }
        };
        checkFavoriteStatus();
    }, [id]);

    // いいねボタンを押した時に走る関数
    const handleToggleFavorite = async () => {
        const currentUserId = localStorage.getItem('user_id');
        if (!currentUserId) {
            alert("いいねするにはログインが必要です");
            window.location.href = '/login';
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/items/${id}/favorite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUserId })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    setIsFavorited(data.is_favorited); // ハートの色を即座に切り替える
                }
            }
        } catch (err) {
            alert("いいね処理に失敗しました");
        }
    };

    //コメントを送信する関数
    const handleSendComment = async (e) => {
        e.preventDefault();
        const currentUserId = localStorage.getItem('user_id');
        if (!currentUserId) {
            alert("コメントするにはログインが必要です");
            window.location.href = '/login';
            return;
        }
        if (!newComment.strip ? !newComment.trim() : !newComment.trim()) return;

        setCommentLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/items/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId,
                    text: newComment
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'success') {
                    setNewComment(''); // 入力欄を空にする
                    fetchComments(); // チャット一覧をリロード
                }
            }
        } catch (err) {
            alert("コメントの送信に失敗しました");
        } finally {
            setCommentLoading(false);
        }
    };



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
        // いいね！ボタン用のサイバーネオンピンクスタイル
        favButton: {display: 'flex',alignItems: 'center',justifyContent: 'center',gap: '8px',width: '100%', backgroundColor: 'transparent',borderRadius: '14px',padding: '12px',fontSize: '14px',fontWeight: '600',cursor: 'pointer',transition: 'all 0.3s ease',marginTop: '16px',boxSizing: 'border-box'},

        //コメント欄用のスタイル
        commentSection: { marginTop: '32px', width: '100%' },
        commentBubble: { backgroundColor: '#161822', borderRadius: '14px', padding: '12px 16px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.03)' },
        commentHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF', marginBottom: '6px', fontWeight: '600' },
        commentText: { fontSize: '14px', color: '#FFFFFF', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' },
        commentInputArea: { display: 'flex', gap: '8px', marginTop: '16px' },


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

                {/*商品説明の下に「いいね！」ボタンを配置 */}
                <button 
                    onClick={handleToggleFavorite}
                    style={{
                        ...styles.favButton,
                        border: isFavorited ? '1px solid #ff4b91' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: isFavorited ? '#ff4b91' : '#9CA3AF',
                        boxShadow: isFavorited ? '0 0 15px rgba(255, 75, 145, 0.15)' : 'none'
                    }}
                >
                    <span style={{ fontSize: '18px' }}>{isFavorited ? '❤️' : '🤍'}</span>
                    {isFavorited ? 'いいねを消す' : 'いいね！する'}
                </button>

                {/*コメント質問チャットエリア */}
                <div style={styles.commentSection}>
                    <div style={{fontSize: '12px', color: '#6B7280', fontWeight: '600', marginBottom: '12px'}}>
                        💬 コメント・質問 ({comments.length})
                    </div>
                    
                    {/* コメント履歴の一覧 */}
                    {comments.length === 0 ? (
                        <p style={{fontSize: '13px', color: '#6B7280', textAlign: 'center', padding: '16px 0'}}>この商品への質問・コメントはまだありません。</p>
                    ) : (
                        comments.map(c => (
                            <div key={c.id} style={styles.commentBubble}>
                                <div style={styles.commentHeader}>
                                    <span>👤 {c.user_name} <span style={{fontSize: '10px', color: '#4B5563'}}>({c.user_id})</span></span>
                                    {String(c.user_id) === String(item.user_id) && (
                                        <span style={{backgroundColor: '#1F222F', color: '#00f2fe', fontSize: '10px', padding: '2px 6px', borderRadius: '4px'}}>出品者</span>
                                    )}
                                </div>
                                <p style={styles.commentText}>{c.text}</p>
                            </div>
                        ))
                    )}

                    {/* コメント入力フォーム */}
                    <form onSubmit={handleSendComment} style={styles.commentInputArea}>
                        <input 
                            style={{...styles.input, marginBottom: 0, flex: 1}} 
                            type="text" 
                            placeholder="商品への質問をここに書き込む..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={commentLoading}
                            style={{
                                backgroundColor: '#1F222F',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#00f2fe',
                                borderRadius: '10px',
                                padding: '0 16px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}
                        >
                            {commentLoading ? '...' : '送信'}
                        </button>
                    </form>
                </div>


                {/* 🔒 ボタンの動的切り替えロジック */}
                <div style={styles.actionArea}>
                    {item.status === 'sold' ? (
                        // すでに売り切れている場合は完全に購入をブロック
                        <button 
                            style={{
                                ...styles.buyButton, 
                                background: '#2A2D3D', 
                                color: '#6B7280', 
                                cursor: 'not-allowed', 
                                boxShadow: 'none'
                            }}
                            disabled={true}
                        >
                            🛑 この商品は売り切れました
                        </button>
                    ) :String(item.user_id) === String(currentUserId) ? (
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