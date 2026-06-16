import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';
const TEST_USER_ID = 1;

export const Profile = () => {
    const [activeTab, setActiveTab] = useState('items'); 
    const [profile, setProfile] = useState({ username: '', email: '' });
    const [myItems, setMyItems] = useState([]);
    const [myPurchases, setMyPurchases] = useState([]);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // データの初回来得 
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                //プロフィール取得
                const pRes = await fetch(`${API_BASE_URL}/api/users/${TEST_USER_ID}/profile`);
                const pData = await pRes.json();
                if (pData.status === 'success') {
                    setProfile(pData.profile);
                    setEditName(pData.profile.username);
                    setEditEmail(pData.profile.email);
                }

                // 出品履歴取得
                const iRes = await fetch(`${API_BASE_URL}/api/users/${TEST_USER_ID}/items`);
                const iData = await iRes.json();
                if (iData.status === 'success') setMyItems(iData.items);

                // 購入履歴取得
                const purRes = await fetch(`${API_BASE_URL}/api/users/${TEST_USER_ID}/purchases`);
                const purData = await purRes.json();
                if (purData.status === 'success') setMyPurchases(purData.purchases);

            } catch (err) {
                console.error("マイページデータの取得失敗", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    // プロフィール保存処理
    const handleSaveProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${TEST_USER_ID}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: editName, email: editEmail })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setProfile({ username: editName, email: editEmail });
                setIsEditing(false);
                setMessage('👤 プロフィール情報を更新しました！');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            alert('プロフィールの更新に失敗しました');
        }
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
        
        //タブ切り替え用のスタイル
        tabContainer: { display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '16px' },
        tab: { flex: 1, textAlign: 'center', padding: '12px 0', cursor: 'pointer', color: '#9CA3AF', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid transparent' },
        activeTab: { color: '#00f2fe', borderBottom: '2px solid #00f2fe' },

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

                {/* 👤 プロフィールカード（通常モード / 編集モード） */}
                <div style={styles.profileCard}>
                    <div style={styles.avatar}>👤</div>
                    
                    {!isEditing ? (
                        <>
                            <h2 style={styles.username}>{profile.username}</h2>
                            <p style={styles.userEmail}>{profile.email}</p>
                            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>プロフィールを編集</button>
                        </>
                    ) : (
                        <div style={{textAlign: 'left'}}>
                            <label style={{fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px'}}>ユーザー名</label>
                            <input style={styles.input} type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            
                            <label style={{fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px'}}>メールアドレス</label>
                            <input style={styles.input} type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                            
                            <div style={{textAlign: 'center', marginTop: '8px'}}>
                                <button style={styles.editBtn} onClick={() => setIsEditing(false)}>キャンセル</button>
                                <button style={styles.saveBtn} onClick={handleSaveProfile}>変更を保存</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 🔄 出品履歴 / 購入履歴のタブ切り替え */}
                <div style={styles.tabContainer}>
                    <div 
                        style={{...styles.tab, ...(activeTab === 'items' ? styles.activeTab : {})}} 
                        onClick={() => setActiveTab('items')}
                    >
                        出品履歴 ({myItems.length})
                    </div>
                    <div 
                        style={{...styles.tab, ...(activeTab === 'purchases' ? styles.activeTab : {})}} 
                        onClick={() => setActiveTab('purchases')}
                    >
                        購入履歴 ({myPurchases.length})
                    </div>
                </div>

                {/* 📋 リスト表示エリア */}
                {activeTab === 'items' ? (
                    <div>
                        {myItems.length === 0 && <p style={{textAlign: 'center', color: '#6B7280', fontSize: '13px', paddingTop: '20px'}}>出品した商品はまだありません。</p>}
                        {myItems.map(item => (
                            <div key={item.id} style={styles.itemRow} onClick={() => window.location.href = `/items/${item.id}`}>
                                <div style={styles.emojiBox}>{getEmoji(item.category)}</div>
                                <div style={{flex: 1}}>
                                    <h4 style={{fontSize: '14px', margin: '0 0 2px 0'}}>{item.title}</h4>
                                    <span style={{fontSize: '13px', color: '#00f2fe', fontWeight: '600'}}>¥{item.price?.toLocaleString()}</span>
                                </div>
                                <span style={item.status === 'sold' ? styles.soldBadge : styles.statusBadge}>
                                    {item.status === 'sold' ? '売り切れ' : '出品中'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {myPurchases.length === 0 && <p style={{textAlign: 'center', color: '#6B7280', fontSize: '13px', paddingTop: '20px'}}>購入した商品はまだありません。</p>}
                        {myPurchases.map(item => (
                            <div key={item.id} style={styles.itemRow} onClick={() => window.location.href = `/items/${item.id}`}>
                                <div style={styles.emojiBox}>{getEmoji(item.category)}</div>
                                <div style={{flex: 1}}>
                                    <h4 style={{fontSize: '14px', margin: '0 0 2px 0'}}>{item.title}</h4>
                                    <span style={{fontSize: '13px', color: '#9CA3AF', fontWeight: '600'}}>¥{item.price?.toLocaleString()}</span>
                                </div>
                                <span style={{fontSize: '11px', backgroundColor: '#1F222F', color: '#9CA3AF', padding: '4px 8px', borderRadius: '6px'}}>購入完了</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Navbar />
        </div>
    );
};