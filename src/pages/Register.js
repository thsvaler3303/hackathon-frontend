import React, { useState } from 'react';

const API_BASE_URL = 'https://hackathon-backend-915741123530.us-central1.run.app'; 

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setSuccess('ユーザー登録が完了しました！ログイン画面へ進んでください。');
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                setError(data.detail || data.message || '登録に失敗しました。');
            }
        } catch (err) {
            setError('サーバーとの通信に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    //ダークUIのスタイル定義
    const styles = {
        container: {
            backgroundColor: '#0D0E12',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        card: {
            backgroundColor: '#161822',
            width: '100%',
            maxWidth: '440px', // スマホアプリ風の横幅
            borderRadius: '24px',
            padding: '40px 30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center',
        },
        title: {
            color: '#FFFFFF',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '1px',
        },
        subtitle: {
            color: '#9CA3AF',
            fontSize: '14px',
            marginBottom: '32px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        inputGroup: {
            textAlign: 'left',
        },
        label: {
            display: 'block',
            color: '#9CA3AF',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        input: {
            width: '100%',
            backgroundColor: '#1F222F',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '14px 16px',
            color: '#FFFFFF',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.2s',
        },
        button: {
            width: '100%',
            background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', // サイバーブルーグラデーション
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            color: '#0D0E12',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '12px',
            boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)',
            transition: 'opacity 0.2s',
        },
        alertError: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            color: '#FCA5A5',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '14px',
            textAlign: 'left',
        },
        alertSuccess: {
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10B981',
            color: '#A7F3D0',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '14px',
            textAlign: 'left',
        },
        linkContainer: {
            marginTop: '24px',
            fontSize: '14px',
            color: '#9CA3AF',
        },
        link: {
            color: '#00f2fe',
            textDecoration: 'none',
            fontWeight: '600',
            marginLeft: '5px',
            cursor: 'pointer',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>NEXT FLEAMARKET</h1>
                <p style={styles.subtitle}>AIが主役の次世代フリマへようこそ</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <div style={styles.alertError}>{error}</div>}
                    {success && <div style={styles.alertSuccess}>{success}</div>}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>ユーザー名</label>
                        <input
                            type="text"
                            placeholder="ex) uttc_user"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>メールアドレス</label>
                        <input
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>パスワード</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? '登録処理中...' : 'アカウントを作成する'}
                    </button>
                </form>

                <div style={styles.linkContainer}>
                    すでにアカウントをお持ちですか？
                    <span onClick={() => window.location.href = '/login'} style={styles.link}>ログイン</span>
                </div>
            </div>
        </div>
    );
};