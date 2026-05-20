import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MatrixRain = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = 'NEUROSHIELD01アイウカキサシスタチ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(2,4,8,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = i % 3 === 0 ? '#00d4ff' : '#00ff88';
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />;
};

const Login = ({ onLogin }) => {
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const messages = ['INITIALIZING NEUROSHIELD...', 'AI ENGINE ONLINE...', 'ALL SYSTEMS READY...'];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    const msg = messages[msgIndex];
    const interval = setInterval(() => {
      setText(msg.slice(0, i));
      i++;
      if (i > msg.length) {
        clearInterval(interval);
        setTimeout(() => {
          setText('');
          setMsgIndex(prev => (prev + 1) % messages.length);
        }, 2000);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [msgIndex]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('⚠ ACCESS DENIED — ENTER CREDENTIALS');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    onLogin();
    navigate('/');
  };

  return (
    <div style={{
      position: 'relative', height: '100vh',
      background: '#020408', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <MatrixRain />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative', zIndex: 10,
          width: '400px',
          background: 'rgba(6,13,20,0.95)',
          border: '1px solid rgba(0,212,255,0.4)',
          borderRadius: '4px',
          padding: '40px',
          boxShadow: '0 0 60px rgba(0,212,255,0.15)',
        }}
      >
        {/* Corner Borders */}
        {[
          { top: -1, left: -1, borderTop: '2px solid #00d4ff', borderLeft: '2px solid #00d4ff' },
          { top: -1, right: -1, borderTop: '2px solid #00d4ff', borderRight: '2px solid #00d4ff' },
          { bottom: -1, left: -1, borderBottom: '2px solid #00d4ff', borderLeft: '2px solid #00d4ff' },
          { bottom: -1, right: -1, borderBottom: '2px solid #00d4ff', borderRight: '2px solid #00d4ff' },
        ].map((s, i) => (
          <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...s }} />
        ))}

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ fontSize: '56px', display: 'inline-block' }}
          >🛡️</motion.div>

          <div style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '26px', fontWeight: '900',
            color: '#00d4ff',
            textShadow: '0 0 30px rgba(0,212,255,0.8)',
            letterSpacing: '4px', marginTop: '8px'
          }}>NEUROSHIELD</div>

          <div style={{
            fontFamily: 'monospace', fontSize: '11px',
            color: '#00ff88', marginTop: '8px',
            minHeight: '18px',
            textShadow: '0 0 8px rgba(0,255,136,0.6)'
          }}>
            {text}<span style={{ opacity: Math.random() > 0.5 ? 1 : 0 }}>_</span>
          </div>
        </div>

        {/* Inputs */}
        {[
          { label: 'OPERATOR ID', value: username, set: setUsername, type: 'text', ph: 'username' },
          { label: 'ACCESS CODE', value: password, set: setPassword, type: 'password', ph: '••••••••' }
        ].map(f => (
          <div key={f.label} style={{ marginBottom: '18px' }}>
            <div style={{
              fontFamily: 'Orbitron, monospace', fontSize: '9px',
              color: '#4a7fa5', letterSpacing: '2px', marginBottom: '8px'
            }}>{f.label}</div>
            <input
              type={f.type}
              value={f.value}
              placeholder={f.ph}
              onChange={e => f.set(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '12px 14px',
                background: 'rgba(0,212,255,0.04)',
                border: '1px solid rgba(0,212,255,0.25)',
                borderRadius: '2px', color: '#00d4ff',
                fontFamily: 'monospace', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.3s'
              }}
              onFocus={e => e.target.style.borderColor = '#00d4ff'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.25)'}
            />
          </div>
        ))}

        {/* Error */}
        {error && (
          <div style={{
            color: '#ff0040', fontFamily: 'monospace',
            fontSize: '11px', marginBottom: '14px',
            textShadow: '0 0 8px rgba(255,0,64,0.5)'
          }}>{error}</div>
        )}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,212,255,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: 'rgba(0,212,255,0.1)',
            border: '1px solid #00d4ff',
            borderRadius: '2px', color: '#00d4ff',
            fontFamily: 'Orbitron, monospace',
            fontSize: '12px', letterSpacing: '3px',
            cursor: 'pointer'
          }}
        >
          {loading ? (
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              AUTHENTICATING...
            </motion.span>
          ) : 'INITIATE ACCESS'}
        </motion.button>

        <div style={{
          marginTop: '20px', textAlign: 'center',
          fontFamily: 'monospace', fontSize: '10px', color: '#2a4f6a'
        }}>
          <span style={{ color: '#00ff88' }}>●</span> SECURE CONNECTION &nbsp;
          <span style={{ color: '#00ff88' }}>●</span> AI ENGINE READY
        </div>
      </motion.div>
    </div>
  );
};

export default Login;