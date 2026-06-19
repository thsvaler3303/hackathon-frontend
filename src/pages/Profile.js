import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';
//const TEST_USER_ID = 1;  消した

export const Profile = () => {
    const [activeTab, setActiveTab] = useState('items'); 
    const [profile, setProfile] = useState({ username: '', email: '',points: 0 });  //追加
    const [myItems, setMyItems] = useState([]);
    const [myPurchases, setMyPurchases] = useState([]);

    //いいねした商品を保存するステートを新規追加
    const [myFavorites, setMyFavorites] = useState([]);

    //閲覧履歴の商品データを保存するステート
    const [viewHistoryItems, setViewHistoryItems] = useState([]);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');


    // ログアウト処理
    const handleLogout = () => {
        if (window.confirm('ログアウトしますか？')) {
            localStorage.clear(); // 認証情報user_idなどをすべて削除
            window.location.href = '/login'; //ログイン画面にリダイレクト
        }
    };

    // データの初回来得 
    useEffect(() => {
        const fetchProfileData = async () => {

            const currentUserId = String(localStorage.getItem('user_id'));
            //キック処理
            if (!currentUserId) {
                window.location.href = '/login'; 
                return;
            }
            setLoading(true);

            try {
                //プロフィール取得
                const pRes = await fetch(`${API_BASE_URL}/api/users/${currentUserId}/profile`);
                if (pRes.ok) {  //少し強固にしてみたが、、、、
                    const pData = await pRes.json();
                    if (pData.status === 'success'&& pData.profile) {
                        // バックエンドから返ってきた名前が 'username' か 'name' かを柔軟に判定してセット
                        const fetchedName = pData.profile.username || pData.profile.name || '未設定のユーザー';
                        const fetchedEmail = pData.profile.email || '未設定のメールアドレス';
                        setProfile({
                            username: fetchedName,
                            email: fetchedEmail,
                            points: pData.profile.points || 0  //追加
                        });
                        // 編集用フォームの初期値にもしっかり代入して、開いた瞬間に空っぽになるのを防ぐ
                        setEditName(fetchedName);
                        setEditEmail(fetchedEmail);

                    }
                }
            } catch (err) {
                console.error("プロフィール取得失敗", err);
            }

            try{
                // 出品履歴取得
                const iRes = await fetch(`${API_BASE_URL}/api/users/${currentUserId}/items`);
                if (iRes.ok) {
                    const iData = await iRes.json();
                    if (iData.status === 'success') setMyItems(iData.items|| []);
                }
            } catch (err) {
                console.error("出品履歴取得失敗", err);
            }

                // 購入履歴取得
            try {
                const purRes = await fetch(`${API_BASE_URL}/api/users/${currentUserId}/purchases`);
                if (purRes.ok) {
                    const purData = await purRes.json();
                    if (purData.status === 'success') setMyPurchases(purData.purchases|| []);
                }
            } catch (err) {
                console.error("購入履歴取得失敗", err);
            } 

            // いいね一覧APIからデータを同期
            try {
                const favRes = await fetch(`${API_BASE_URL}/api/users/${currentUserId}/favorites`);
                if (favRes.ok) {
                    const favData = await favRes.json();
                    if (favData.status === 'success') setMyFavorites(favData.items || []);
                }
            } catch (err) {
                console.error("いいね一覧取得失敗", err);
            }

            //localStorage から閲覧履歴のIDを読み込んで、商品データと照合
            try {
                const historyIds = JSON.parse(localStorage.getItem('view_history') || '[]');
                
                // 全商品が載っている myItemsや全体のAPI等から探す、またはすでに取得済みの全商品リストがあればそこから抽出
                // ここでは一番確実な全体の商品一覧APIから履歴にマッチするものを引く
                const allItemsRes = await fetch(`${API_BASE_URL}/api/items`);
                if (allItemsRes.ok) {
                    const allItemsData = await allItemsRes.json();
                    if (allItemsData.status === 'success' && allItemsData.items) {
                        // 保存されているIDの順番通りに商品を並べて配列を作る
                        const matchedItems = historyIds
                            .map(hid => allItemsData.items.find(item => String(item.id || item.ID) === String(hid)))
                            .filter(Boolean); // 見つからなかった空のデータを排除
                            
                        setViewHistoryItems(matchedItems);
                    }
                }
            } catch (err) {
                console.error("閲覧履歴の同期失敗:", err);
            }

                setLoading(false);
            
        };
        fetchProfileData();
    }, []);

    // プロフィール保存処理
    const handleSaveProfile = async () => {

        const currentUserId = String(localStorage.getItem('user_id') || '1');

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${currentUserId}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: editName, email: editEmail })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setProfile(prev =>({...prev, username: editName, email: editEmail }));   //ポイント情報が消えないように既存の値を引き継ぐ
                setIsEditing(false);
                setMessage('👤 プロフィール情報を更新しました！');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            alert('プロフィールの更新に失敗しました');
        }
    };

    // 編集キャンセル時の処理（フォームを元の値に戻す）
    const handleCancelEdit = () => {
        setEditName(profile.username);
        setEditEmail(profile.email);
        setIsEditing(false);
    };

    // スタイル定義
    const styles = {
        outerContainer: { backgroundColor: '#0D0E12', minHeight: '100vh', color: '#FFFFFF', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', display: 'flex', justifyContent: 'center' },
        innerContainer: { width: '100%', maxWidth: '480px', padding: '80px 16px 100px 16px', boxSizing: 'border-box' },
        profileCard: { backgroundColor: '#161822', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center', marginBottom: '24px' },
        avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '36px', margin: '0 auto 16px auto' },
        username: { fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0' },
        userEmail: { fontSize: '13px', color: '#9CA3AF', margin: '0 0 16px 0' },
        input: { width: '100%', backgroundColor: '#1F222F', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 12px', color: '#FFFFFF', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' },
        editBtn: { backgroundColor: '#1F222F', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', marginRight: '8px' },
        saveBtn: { background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', border: 'none', color: '#0D0E12', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '700' },
        // 未定義だったログアウトボタンのスタイルをダークテーマに最適化して追加
        logoutBtn: { width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#FCA5A5', borderRadius: '12px', padding: '10px 0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '24px' },
        
        //追加、売上金（ポイント）表示用のネオン風スタイル
        pointsContainer: { backgroundColor: '#1F222F', borderRadius: '14px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', border: '1px solid rgba(0, 242, 254, 0.2)', boxShadow: '0 0 15px rgba(0, 242, 254, 0.05)' },
        pointsLabel: { fontSize: '12px', color: '#9CA3AF', fontWeight: '600' },
        pointsValue: { fontSize: '18px', color: '#00f2fe', fontWeight: '700' },


        //タブ切り替え用のスタイル
        tabContainer: { display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '16px' },
        tab: { flex: 1, textAlign: 'center', padding: '12px 0', cursor: 'pointer', color: '#9CA3AF', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid transparent' },
        activeTabItem: { color: '#00f2fe', borderBottom: '2px solid #00f2fe' },

        //いいねタブ専用のアクティブカラー
        activeTabFav: { color: '#ff4b91', borderBottom: '2px solid #ff4b91' },

        //閲覧履歴タブ用のアクティブカラー
        activeTabHistory: { color: '#a855f7', borderBottom: '2px solid #a855f7' },

        itemRow: { display: 'flex', backgroundColor: '#161822', borderRadius: '16px', padding: '12px', gap: '16px', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '12px', cursor: 'pointer' },
        emojiBox: { fontSize: '24px', backgroundColor: '#1F222F', borderRadius: '10px', width: '48px', height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
        statusBadge: { fontSize: '11px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', color: '#A7F3D0', padding: '4px 8px', borderRadius: '6px' },
        soldBadge: { fontSize: '11px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '4px 8px', borderRadius: '6px' },
        alertSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', color: '#A7F3D0', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }
    };

    const getEmoji = (category) => {
        const mapping = { clothing: '👕', electronics: '💻', books: '📚', food: '🍏', rrr: '📦' };
        return mapping[category?.toLowerCase()] || '🎁';
    };

    if (loading) return <div style={styles.outerContainer}><div style={{color: '#9CA3AF', paddingTop: '100px'}}>データを同期中...</div></div>;

    return (
        <div style={styles.outerContainer}>
            <Header />

            <div style={styles.innerContainer}>
                {message && <div style={styles.alertSuccess}>{message}</div>}

                {/* ログアウトボタンをマイページ最上部に設置 */}
                <button style={styles.logoutBtn} onClick={handleLogout}>🚪 アカウントからログアウト</button>

                {/* 👤 プロフィールカード（通常モード / 編集モード） */}
                <div style={styles.profileCard}>
                    <div style={styles.avatar}>👤</div>
                    
                    {!isEditing ? (
                        <>
                            <h2 style={styles.username}>{profile.username}</h2>
                            <p style={styles.userEmail}>{profile.email}</p>
                            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>プロフィールを編集</button>
                            {/*追加、プロフィールのすぐ下にネオンブルーの売上金（ポイント）残高を表示 */}
                            <div style={styles.pointsContainer}>
                                <span style={styles.pointsLabel}>現在の売上金残高</span>
                                <span style={styles.pointsValue}>¥ {(profile.points || 0).toLocaleString()} pt</span>
                            </div>
                        </>
                    ) : (
                        <div style={{textAlign: 'left'}}>
                            <label style={{fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px'}}>ユーザー名</label>
                            <input style={styles.input} type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            
                            <label style={{fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px'}}>メールアドレス</label>
                            <input style={styles.input} type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                            
                            <div style={{textAlign: 'center', marginTop: '8px'}}>
                                <button style={styles.editBtn} onClick={handleCancelEdit}>キャンセル</button>
                                <button style={styles.saveBtn} onClick={handleSaveProfile}>変更を保存</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 🔄 出品履歴 / 購入履歴のタブ切り替え */}
                <div style={styles.tabContainer}>
                    <div 
                        style={{...styles.tab, ...(activeTab === 'items' ? styles.activeTabItem : {})}} 
                        onClick={() => setActiveTab('items')}
                    >
                        出品履歴 ({myItems.length})
                    </div>

                    {/*真ん中にいいねタブを割り込ませる */}
                    <div 
                        style={{...styles.tab, ...(activeTab === 'favorites' ? styles.activeTabFav : {})}} 
                        onClick={() => setActiveTab('favorites')}
                    >
                        いいね ({myFavorites.length})
                    </div>


                    <div 
                        style={{...styles.tab, ...(activeTab === 'purchases' ? styles.activeTabItem : {})}} 
                        onClick={() => setActiveTab('purchases')}
                    >
                        購入履歴 ({myPurchases.length})
                    </div>

                    {/* 一番右に閲覧履歴タブを配置 */}
                    <div style={{...styles.tab, ...(activeTab === 'history' ? styles.activeTabHistory : {})}} onClick={() => setActiveTab('history')}>
                        閲覧履歴 ({viewHistoryItems.length})
                    </div>
                </div>

                {/* 📋 リスト表示エリア */}
                {activeTab === 'items' ? (
                    <div>
                        {myItems.length === 0 && <p style={{textAlign: 'center', color: '#6B7280', fontSize: '13px', paddingTop: '20px'}}>出品した商品はまだありません。</p>}
                        {myItems.map(item => {
                            //IDのキー名を安全にフォールバック判定
                            const itemId = item.id || item.ID || item.item_id;
                            return (
                            <div key={itemId} style={styles.itemRow} onClick={() => window.location.href = `/items/${itemId}`}>
                                <div style={styles.emojiBox}>{getEmoji(item.category)}</div>
                                <div style={{flex: 1}}>
                                    <h4 style={{fontSize: '14px', margin: '0 0 2px 0'}}>{item.title}</h4>
                                    <span style={{fontSize: '13px', color: '#00f2fe', fontWeight: '600'}}>¥{item.price?.toLocaleString()}</span>
                                </div>
                                <span style={item.status === 'sold' ? styles.soldBadge : styles.statusBadge}>
                                    {item.status === 'sold' ? '売り切れ' : '出品中'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : activeTab === 'favorites' ? (

                // いいね一覧の表示エリア
                <div>
                {myFavorites.length === 0 && <p style={{textAlign: 'center', color: '#6B7280', fontSize: '13px', paddingTop: '20px'}}>いいねした商品はまだありません。</p>}
                {myFavorites.map(item => {
                    const itemId = item.id || item.ID || item.item_id;
                    return (
                        <div key={`fav-${itemId}`} style={styles.itemRow} onClick={() => window.location.href = `/items/${itemId}`}>
                            <div style={styles.emojiBox}>{getEmoji(item.category)}</div>
                            <div style={{flex: 1}}>
                                <h4 style={{fontSize: '14px', margin: '0 0 2px 0'}}>{item.title}</h4>
                                <span style={{fontSize: '13px', color: '#ff4b91', fontWeight: '600'}}>¥{item.price?.toLocaleString()}</span>
                            </div>
                            <span style={item.status === 'sold' ? styles.soldBadge : styles.statusBadge}>
                                {item.status === 'sold' ? '売り切れ' : '出品中'}
                            </span>
                        </div>
                    );
                })}
            </div>
        ) : activeTab === 'history' ? (
            // 閲覧履歴の表示エリア
            <div>
            {viewHistoryItems.length === 0 && <p style={{textAlign: 'center', color: '#6B7280', fontSize: '13px', paddingTop: '20px'}}>最近見た商品はまだありません。</p>}
            {viewHistoryItems.map(item => {
                const itemId = item.id || item.ID || item.item_id;
                return (
                    <div key={`hist-${itemId}`} style={styles.itemRow} onClick={() => window.location.href = `/items/${itemId}`}>
                        <div style={styles.emojiBox}>{getEmoji(item.category)}</div>
                        <div style={{flex: 1}}>
                            <h4 style={{fontSize: '14px', margin: '0 0 2px 0'}}>{item.title}</h4>
                            <span style={{fontSize: '13px', color: '#a855f7', fontWeight: '600'}}>¥{item.price?.toLocaleString()}</span>
                        </div>
                        <span style={item.status === 'sold' ? styles.soldBadge : styles.statusBadge}>
                            {item.status === 'sold' ? '売り切れ' : '出品中'}
                        </span>
                    </div>
                );
            })}
        </div>
    ) : (
            <div>
                {myPurchases.length === 0 && <p style={{textAlign: 'center', color: '#6B7280', fontSize: '13px', paddingTop: '20px'}}>購入した商品はまだありません。</p>}
                {myPurchases.map((item, index) => {
                    // 修正：DictCursor化に伴い、購入商品のIDとして、大文字小文字や別名を完全自動探索
                    // デバッグ：ループの中に入ってきたデータをブラウザのコンソールに流す
                    console.log("【フロント描画中】現在の購入商品データ:", item);

                    const itemId = item.id || item.ID || item.item_id || item[0];
                    // 警告対策として、万が一IDが壊れていても一意のKeyをインデックス併用で死守する
                    const safeKey = itemId ? `pur-${itemId}` : `pur-index-${index}`;
                        
                    return (
                        <div 
                            key={safeKey} 
                            style={styles.itemRow} 
                            onClick={() => {
                                if (!itemId) {
                                    alert("デバッグエラー: 商品IDが取得できませんでした。");
                                    return;
                                }
                                window.location.href = `/items/${itemId}`;
                            }}
                        >
                            <div style={styles.emojiBox}>{getEmoji(item.category)}</div>
                            <div style={{flex: 1}}>
                                <h4 style={{fontSize: '14px', margin: '0 0 2px 0'}}>{item.title}</h4>
                                <span style={{fontSize: '13px', color: '#9CA3AF', fontWeight: '600'}}>¥{Number(item.price || 0).toLocaleString()}</span>
                            </div>
                            <span style={{fontSize: '11px', backgroundColor: '#1F222F', color: '#9CA3AF', padding: '4px 8px', borderRadius: '6px'}}>購入完了</span>
                        </div>
                    );
                })}
            </div>
        )}
        </div>

        <Navbar />
    </div>
);
};








//                             <div key={item.id} style={styles.itemRow} onClick={() => window.location.href = `/items/${item.id}`}>
//                                 <div style={styles.emojiBox}>{getEmoji(item.category)}</div>
//                                 <div style={{flex: 1}}>
//                                     <h4 style={{fontSize: '14px', margin: '0 0 2px 0'}}>{item.title}</h4>
//                                     <span style={{fontSize: '13px', color: '#9CA3AF', fontWeight: '600'}}>¥{item.price?.toLocaleString()}</span>
//                                 </div>
//                                 <span style={{fontSize: '11px', backgroundColor: '#1F222F', color: '#9CA3AF', padding: '4px 8px', borderRadius: '6px'}}>購入完了</span>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             <Navbar />
//         </div>
//     );
// };