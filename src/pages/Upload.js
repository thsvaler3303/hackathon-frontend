import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app';

export const Upload = () => {
    const [hint, setHint] = useState(''); // AIへのキーワード
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('clothing');
    
    const [aiLoading, setAiLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    //Geminiに文章を自動生成してもらう関数
    const handleGenerateAI = async () => {
        if (!hint.trim()) {
            setError('AIに指示するためのキーワード（例: 古着のスニーカー、傷なし）を入力してください。');
            return;
        }
        setAiLoading(true);
        setError('');
        setMessage('');

        try {
            // 以前作成したAI自動生成APIを叩く 
            // お使いのAPIパスやBodyのキー名に合わせて適宜調整してください
            const response = await fetch(`${API_BASE_URL}/api/generate-description`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: hint,              
                    description: '状態は良好'
                })
            });

            const data = await response.json();

            if (response.ok && data.suggested_description) {
                // タイトルはキーワードを活用し、説明文にGeminiの生成テキストをそのまま注入
                setTitle(`${hint}（極美品）`);
                setDescription(data.suggested_description);
                setMessage('🪄 本物のGemini AIが、最高に魅力的な商品説明文を自動生成しました！');
            } else {
                setError(data.message || 'AI文章の生成に失敗しました。手動で入力も可能です。');
            }
        } catch (err) {
            setError('サーバーまたはGeminiとの通信に失敗しました。');
        } finally {
            setAiLoading(false);
        }
    };


// 最終的な出品データをDBに送信する関数
const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price) {
        setError('すべての項目を入力してください。');
        return;
    }
    setUploadLoading(true);
    setError('');
    setMessage('');

    try {
        // 登録、ログインに成功したテストユーザーのIDを指定
        const testUserId = 1; 

        const response = await fetch(`${API_BASE_URL}/api/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: title,              
                price: parseInt(price),
                description: description,
                category: category,
                user_id: testUserId     
            })
        });

        const data = await response.json();

        // バックエンドが正常に成功
        if (response.ok && data.status === 'success') {
            setMessage(`🎉 ${data.message || '商品の出品が正常に完了しました！'} (商品ID: ${data.item_id})`);
            // 入力欄をクリア
            setHint('');
            setTitle('');
            setDescription('');
            setPrice('');
        } else {
            setError(data.message || '出品に失敗しました。user_idがDBに存在するか確認してください。');
        }
    } catch (err) {
        setError('サーバーとの通信に失敗しました。');
    } finally {
        setUploadLoading(false);
    }
};





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
        sectionTitle: {
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '4px',
        },
        subtitle: {
            fontSize: '13px',
            color: '#9CA3AF',
            marginBottom: '24px',
        },
        aiCard: {
            backgroundColor: 'rgba(0, 242, 254, 0.03)',
            border: '1px dashed rgba(0, 242, 254, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        },
        label: {
            fontSize: '12px',
            fontWeight: '600',
            color: '#9CA3AF',
            textTransform: 'uppercase',
        },
        input: {
            width: '100%',
            backgroundColor: '#161822',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '14px',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
        },
        textarea: {
            width: '100%',
            backgroundColor: '#161822',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '14px',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            minHeight: '120px',
            resize: 'vertical',
            boxSizing: 'border-box',
        },
        select: {
            width: '100%',
            backgroundColor: '#161822',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '14px',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
        },
        aiButton: {
            width: '100%',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid #00f2fe',
            borderRadius: '10px',
            padding: '12px',
            color: '#00f2fe',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '8px',
        },
        submitButton: {
            width: '100%',
            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            color: '#0D0E12',
            fontSize: '16px',
            fontWeight: '750',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 242, 254, 0.2)',
            marginTop: '10px',
        },
        alertError: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            color: '#FCA5A5',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
        },
        alertSuccess: {
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10B981',
            color: '#A7F3D0',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
        }
    };

    return (
        <div style={styles.outerContainer}>
            <Header />

            <div style={styles.innerContainer}>
                <h1 style={styles.sectionTitle}>新商品を出品</h1>
                <p style={styles.subtitle}>Gemini AIが面倒な紹介文作成を強力サポート</p>

                {error && <div style={styles.alertError}>{error}</div>}
                {message && <div style={styles.alertSuccess}>{message}</div>}

                {/* ✨ 目玉機能：AI自動生成のトリガーエリア */}
                <div style={styles.aiCard}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>✨ AIにおまかせ生成（キーワード）</label>
                        <input 
                            type="text" 
                            placeholder="ex) ナイキのスニーカー、27cm、ほぼ新品"
                            value={hint}
                            onChange={(e) => setHint(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <button 
                        type="button" 
                        style={styles.aiButton} 
                        onClick={handleGenerateAI}
                        disabled={aiLoading}
                    >
                        {aiLoading ? '🤖 Geminiが文章を思考中...' : '🪄 AIでタイトル・説明文を自動入力'}
                    </button>
                </div>

                {/* 通常の出品フォーム */}
                <form onSubmit={handleUploadSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>商品名</label>
                        <input 
                            type="text" 
                            placeholder="商品名を入力（AI生成も可）"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>カテゴリー</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            style={styles.select}
                        >
                            <option value="clothing">👕 ファッション・古着</option>
                            <option value="electronics">💻 家電・ガジェット</option>
                            <option value="books">📚 本・メディア</option>
                            <option value="food">🍏 食品・飲料</option>
                            <option value="rrr">📦 その他</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>販売価格 (¥)</label>
                        <input 
                            type="number" 
                            placeholder="3000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>商品の詳細説明</label>
                        <textarea 
                            placeholder="商品の状態やサイズなどの詳細を記入してください（AI生成も可）"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={styles.textarea}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={styles.submitButton}
                        disabled={uploadLoading}
                    >
                        {uploadLoading ? '出品データを送信中...' : 'この内容で出品する'}
                    </button>
                </form>
            </div>

            <Navbar />
        </div>
    );
};