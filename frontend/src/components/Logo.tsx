import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizes = {
    small: { height: 50, fontSize: 18 },
    medium: { height: 80, fontSize: 24 },
    large: { height: 120, fontSize: 32 },
  };

  const currentSize = sizes[size];

  return (
    <div style={styles.container}>
      <img 
        src="/assets/logo.png" 
        alt="Отта PropTech" 
        style={{ height: currentSize.height, width: 'auto' }}
      />
      {showText && (
        <span style={{ ...styles.text, fontSize: currentSize.fontSize }}>
          Отта
        </span>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  text: {
    fontWeight: 'bold',
    color: '#7CB342',
    fontFamily: 'Arial, sans-serif',
  },
};

export default Logo;
