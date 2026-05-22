import React from 'react';
import { motion } from 'framer-motion';

const CircularGauge = ({ value, label, color, size = 110 }) => {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <motion.circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - progress }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: 'Orbitron,monospace',
          fontSize: '16px', fontWeight: '900',
          color, textShadow: `0 0 10px ${color}`
        }}>{value}%</div>
      </div>
      <div style={{
        fontFamily: 'Orbitron,monospace', fontSize: '9px',
        color: '#3a6a8a', letterSpacing: '1px', marginTop: '6px'
      }}>{label}</div>
    </div>
  );
};

export default CircularGauge;
