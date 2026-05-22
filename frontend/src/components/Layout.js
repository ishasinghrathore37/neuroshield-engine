import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = () => {
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const navItems = [
    { to: '/', icon: '⬡', label: 'DASHBOARD' },
    { to: '/threats', icon: '⚠', label: 'THREAT CENTER' },
    { to: '/ai-analysis', icon: '🧠', label: 'AI ANALYSIS' },
    { to: '/reports', icon: '📋', label: 'REPORTS' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#020408' }}>

      {/* SIDEBAR */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          width: '220px', minWidth: '220px',
          background: 'linear-gradient(180deg,#060d14,#020408)',
          borderRight: '1px solid rgba(0,212,255,0.15)',
          display: 'flex', flexDirection: 'column',
          padding: '0', zIndex: 10
        }}
      >
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(0,212,255,0.1)'
        }}>
          <div style={{
            fontFamily: 'Orbitron,monospace',
            fontSize: '20px', fontWeight: '900',
            color: '#00d4ff',
            textShadow: '0 0 20px rgba(0,212,255,0.7)',
            letterSpacing: '2px'
          }}>🛡️ NEURO</div>
          <div style={{
            fontFamily: 'Orbitron,monospace',
            fontSize: '20px', fontWeight: '900',
            color: '#fff', letterSpacing: '2px'
          }}>SHIELD</div>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontSize: '10px', color: '#00ff88',
              fontFamily: 'monospace', marginTop: '6px',
              textShadow: '0 0 8px rgba(0,255,136,0.6)'
            }}
          >● SYSTEM ACTIVE</motion.div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: '16px' }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center',
                gap: '12px', padding: '13px 20px',
                color: isActive ? '#00d4ff' : '#3a6a8a',
                textDecoration: 'none',
                fontFamily: 'Orbitron,monospace',
                fontSize: '10px', letterSpacing: '1px',
                borderLeft: isActive ? '2px solid #00d4ff' : '2px solid transparent',
                background: isActive ? 'rgba(0,212,255,0.06)' : 'transparent',
                transition: 'all 0.3s',
                textShadow: isActive ? '0 0 10px rgba(0,212,255,0.5)' : 'none'
              })}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Clock */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid rgba(0,212,255,0.1)',
          fontFamily: 'monospace'
        }}>
          <div style={{
            fontSize: '18px', color: '#00d4ff',
            textShadow: '0 0 10px rgba(0,212,255,0.5)',
            fontWeight: 'bold'
          }}>{time.toLocaleTimeString()}</div>
          <div style={{ fontSize: '11px', color: '#3a6a8a', marginTop: '2px' }}>
            {time.toLocaleDateString()}
          </div>
        </div>
      </motion.div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {/* Scan line */}
        <motion.div
          animate={{ y: ['0vh', '100vh'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'fixed', left: '220px', right: 0,
            height: '1px', zIndex: 999, pointerEvents: 'none',
            background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.3),transparent)'
          }}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;