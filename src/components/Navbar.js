import React from 'react';

export const Navbar = () => {
    const currentPath = window.location.pathname;

    const styles = {
        nav: {
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px',
            height: '64px',
            backgroundColor: '#161822',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 1000,
        },
        navItem: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            fontSize: '11px',
            cursor: 'pointer',
            gap: '4px',
            textDecoration: 'none'
        },
        activeItem: {
            color: '#00f2fe', 
            fontWeight: 'bold',
        }
    };

    return (
        <nav style={styles.nav}>
            <div 
                onClick={() => window.location.href = '/items'} 
                style={{...styles.navItem, ...(currentPath === '/items' ? styles.activeItem : {})}}
            >
                <span style={{fontSize: '20px'}}>🏠</span>
                <span>ホーム</span>
            </div>

            {/*AIコンシェルジュ追加 */}
            <div 
                onClick={() => window.location.href = '/concierge'} 
                style={{...styles.navItem, ...(currentPath === '/concierge' ? styles.activeItem : {})}}
            >
                <span style={{fontSize: '20px'}}>🔮</span>
                <span>AI相談</span>
            </div>
        
            <div 
                onClick={() => window.location.href = '/upload'} 
                style={{...styles.navItem, ...(currentPath === '/upload' ? styles.activeItem : {})}}
            >
                <span style={{fontSize: '20px'}}>📸</span>
                <span>出品</span>
            </div>
            <div 
                onClick={() => window.location.href = '/profile'} 
                style={{...styles.navItem, ...(currentPath === '/profile' ? styles.activeItem : {})}}
            >
                <span style={{fontSize: '20px'}}>👤</span>
                <span>マイページ</span>
            </div>
        </nav>
    );
};