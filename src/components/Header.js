import React, { useState } from 'react';

export const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(''); // 追加

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // 検索結果ページへキーワードを持ってジャンプする
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&cat=${encodeURIComponent(selectedCategory)}`;
        }
    };

    const styles = {
        header: {
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px', // スマホ幅に固定
            height: '64px',
            backgroundColor: 'rgba(22, 24, 34, 0.85)', 
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            boxSizing: 'border-box',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            zIndex: 1000,
        },
        form: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1F222F',
            borderRadius: '12px',
            padding: '6px 12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        input: {
            flex: 1,
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            padding: '6px 0',
        },
        searchBtn: {
            background: 'none',
            border: 'none',
            color: '#00f2fe',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
        }
    };

    return (
        <header style={styles.header}>
            <form onSubmit={handleSearchSubmit} style={styles.form}>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={styles.select}>
                    <option value="" style={styles.option}>全て</option>
                    <option value="ガジェット" style={styles.option}>📱 ガジェット</option>
                    <option value="ファッション" style={styles.option}>👕 服</option>
                    <option value="ゲーム" style={styles.option}>🎮 ゲーム</option>
                    <option value="本" style={styles.option}>📚 本</option>
                </select>
                <input
                    type="text"
                    placeholder="キーワードでAI検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.searchBtn}>🔍</button>
            </form>
        </header>
    );
};