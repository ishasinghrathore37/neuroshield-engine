import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const cards = [
  { title: 'TOTAL THREATS', key: 'total_threats', icon: '⚠️', color: '#ff0040', fallback: 127 },
  { title: 'CRITICAL', key: 'critical', icon: '🔴', color: '#ff6600', fallback: 14 },
  { title: 'BLOCKED IPs', key: 'blocked', icon: '🚫', color: '#00d4ff', fallback: 89 },
  { title: 'SYSTEM HEALTH', key: 'health', icon: '🟢', color: '#00ff88', fallback: 98, suffix: '%' },
];

const StatsCards = ({ stats }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
    {cards.map((card, i) => (
      <motion.div
        key={card.title}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${card.color}40` }}
        style={{
          background: 'rgba(6,13,20,0.9)',
          border: `1px solid ${card.color}30`,
          borderRadius: '4px', padding: '18px',
          position: 'relative', overflow: 'hidden',
          boxShadow: `0 0 15px ${card.color}20`
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg,transparent,${card.color},transparent)`
        }} />

        {/* BG glow */}
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '70px', height: '70px',
          background: `${card.color}20`,
          borderRadius: '50%', filter: 'blur(15px)'
        }} />

        <div style={{ fontSize: '22px', marginBottom: '8px' }}>{card.icon}</div>

        <div style={{
          fontFamily: 'Orbitron,monospace', fontSize: '26px',
          fontWeight: '900', color: card.color,
          textShadow: `0 0 15px ${card.color}`
        }}>
          <CountUp
            end={stats?.[card.key] ?? card.fallback}
            duration={2}
            suffix={card.suffix || ''}
          />
        </div>

        <div style={{
          fontFamily: 'Orbitron,monospace', fontSize: '9px',
          color: '#3a6a8a', letterSpacing: '2px', marginTop: '6px'
        }}>{card.title}</div>

        {/* Pulse dot */}
        {card.key === 'critical' && (
          <motion.div
            animate={{ opacity: [1, 0, 1], scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              position: 'absolute', top: '14px', right: '14px',
              width: '8px', height: '8px',
              background: '#ff0040', borderRadius: '50%',
              boxShadow: '0 0 10px #ff0040'
            }}
          />
        )}
      </motion.div>
    ))}
  </div>
);

export default StatsCards;