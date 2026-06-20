import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';

export const AiConcierge = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            sender: 'ai',
            text: 'こんにちは！AIコンシェルジュです。🤖\n予算や「こんなものが欲しい」という曖昧なご要望から、現在出品中の商品をお探しします！\n\n（例：3万円以内で大学のレポート用PC探して。軽量がいい、中古でも可）'
        }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userText = message;
        setMessage('');
        //ユーザーのメッセージをチャット履歴に追加
        setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-concierge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });
            const data = await response.json();

            if (data.status === 'success') {
                //AIの返答とおすすめ商品をチャット履歴に追加
                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    text: data.ai_response,
                    recommendations: data.recommendations || []
                }]);
            } else {
                throw new Error();
            }
        } catch (err) {
            setChatHistory(prev => [...prev, {
                sender: 'ai',
                text: '申し訳ありません。少し通信が混み合っているようです。もう一度条件を変えて試していただけますか？'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        outerContainer: { backgroundColor: '#0D0E12', minHeight: '100vh', color: '#FFFFFF', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', display: 'flex', justifyContent: 'center' },
        innerContainer: { width: '100%', maxWidth: '480px', padding: '80px 16px 140px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
        chatArea: { flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' },
        bubbleAi: { backgroundColor: '#161822', borderRadius: '16px 16px 16px 4px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.05)', alignSelf: 'flex-start', maxWidth: '85%', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' },
        bubbleUser: { backgroundColor: '#00f2fe', color: '#0D0E12', borderRadius: '16px 16px 4px 16px', padding: '14px', alignSelf: 'flex-end', maxWidth: '85%', fontSize: '14px', lineHeight: '1.5', fontWeight: '500' },
        
        // おすすめ商品のカードスタイル
        recContainer: { marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
        recCard: { backgroundColor: '#1F222F', border: '1px solid rgba(0, 242, 254, 0.2)', borderRadius: '12px', padding: '12px', cursor: 'pointer', transition: 'transform 0.2s' },
        recTitle: { fontSize: '14px', fontWeight: '700', color: '#00f2fe', margin: '0 0 4px 0' },
        recPrice: { fontSize: '13px', fontWeight: '600', color: '#FFFFFF', margin: '0 0 6px 0' },
        recReason: { fontSize: '12px', color: '#9CA3AF', margin: 0 },

        inputForm: { display: 'flex', gap: '8px', position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', padding: '0 16px', boxSizing: 'border-box', zIndex: 900 },
        input: { flex: 1, backgroundColor: '#161822', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' },
        button: { backgroundColor: '#00f2fe', border: 'none', color: '#0D0E12', borderRadius: '12px', padding: '0 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }
    };

    return (
        <div style={styles.outerContainer}>
            <Header />
            <div style={styles.innerContainer}>
                <div style={styles.chatArea}>
                    {chatHistory.map((chat, idx) => (
                        <div key={idx} style={chat.sender === 'ai' ? styles.bubbleAi : styles.bubbleUser}>
                            {chat.text}
                            
                            {/* おすすめ商品がある場合、カード形式で動的にレンダリング */}
                            {chat.recommendations && chat.recommendations.length > 0 && (
                                <div style={styles.recContainer}>
                                    {chat.recommendations.map((item) => (
                                        <div 
                                            key={item.id} 
                                            style={styles.recCard}
                                            onClick={() => navigate(`/items/${item.id}`)} // タップで直接詳細画面へ飛べるように
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <div style={styles.recTitle}>🎁 {item.title}</div>
                                            <div style={styles.recPrice}>¥{item.price?.toLocaleString()}</div>
                                            <div style={styles.recReason}>💡 おすすめ理由: {item.reason}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {loading && (
                        <div style={styles.bubbleAi}>
                            <span style={{ color: '#9CA3AF' }}>商品を横断検索中...🔍</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSendMessage} style={styles.inputForm}>
                    <input 
                        style={styles.input}
                        type="text"
                        placeholder="AIコンシェルジュに相談する..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? '...' : '送信'}
                    </button>
                </form>
            </div>
            <Navbar />
        </div>
    );
};