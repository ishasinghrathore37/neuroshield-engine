import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const severityColors = {
  critical: '#ff0040',
  high: '#ff6600',
  medium: '#ffcc00',
  low: '#00ff88',
};

const demoThreats = [
  { id: 1, source_ip: '192.168.1.105', destination_ip: '10.0.0.1', attack_type: 'Port Scanning', severity: 'critical', status: 'detected', confidence_score: 0.99, created_at: new Date().toISOString() },
  { id: 2, source_ip: '203.0.113.42', destination_ip: '10.0.0.2', attack_type: 'Brute Force', severity: 'high', status: 'blocked', confidence_score: 0.94, created_at: new Date().toISOString() },
  { id: 3, source_ip: '198.51.100.7', destination_ip: '10.0.0.3', attack_type: 'SQL Injection', severity: 'medium', status: 'detected', confidence_score: 0.87, created_at: new Date().toISOString() },
  { id: 4, source_ip: '172.16.0.23', destination_ip: '10.0.0.4', attack_type: 'XSS Attack', severity: 'low', status: 'resolved', confidence_score: 0.76, created_at: new Date().toISOString() },
  { id: 5, source_ip: '10.10.10.55', destination_ip: '10.0.0.5', attack_type: 'Port Scanning', severity: 'critical', status: 'detected', confidence_score: 0.98, created_at: new Date().toISOString() },
  { id: 6, source_ip: '45.33.32.156', destination_ip: '10.0.0.6', attack_type: 'DDoS', severity: 'high', status: 'blocked', confidence_score: 0.91, created_at: new Date().toISOString() },
];

const ThreatModal = ({ threat, onClose, onBlock }) => {
  if (!threat) return null;
  const color = severityColors[threat.severity] || '#4a7fa5';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '500px',
            background: '#060d14',
            border: `1px solid ${color}60`,
            borderRadius: '4px',
            padding: '30px',
            boxShadow: `0 0 60px ${color}20`,
            position: 'relative'
          }}
        >
          {/* Top border glow */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg,transparent,${color},transparent)`
          }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{
                fontFamily: 'Orbitron,monospace', fontSize: '16px',
                color: color, textShadow: `0 0 10px ${color}`,
                fontWeight: '900'
              }}>THREAT #{threat.id}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a6a8a', marginTop: '4px' }}>
                INCIDENT ANALYSIS REPORT
              </div>
            </div>
            <div style={{
              padding: '4px 12px', height: 'fit-content',
              background: `${color}15`,
              border: `1px solid ${color}60`,
              borderRadius: '2px',
              fontFamily: 'Orbitron,monospace', fontSize: '10px',
              color: color
            }}>{threat.severity?.toUpperCase()}</div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'SOURCE IP', value: threat.source_ip },
              { label: 'DESTINATION', value: threat.destination_ip },
              { label: 'ATTACK TYPE', value: threat.attack_type },
              { label: 'STATUS', value: threat.status?.toUpperCase() },
              { label: 'CONFIDENCE', value: `${Math.round((threat.confidence_score || 0) * 100)}%` },
              { label: 'DETECTED AT', value: new Date(threat.created_at).toLocaleTimeString() },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(0,212,255,0.03)',
                border: '1px solid rgba(0,212,255,0.1)',
                borderRadius: '2px', padding: '12px'
              }}>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '8px', color: '#3a6a8a', letterSpacing: '2px', marginBottom: '6px' }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#c0dff0' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Confidence Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontFamily: 'Orbitron,monospace', fontSize: '9px',
              color: '#3a6a8a', letterSpacing: '2px', marginBottom: '8px'
            }}>AI CONFIDENCE SCORE</div>
            <div style={{
              height: '6px', background: 'rgba(255,255,255,0.05)',
              borderRadius: '3px', overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(threat.confidence_score || 0) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%', background: color,
                  boxShadow: `0 0 10px ${color}`,
                  borderRadius: '3px'
                }}
              />
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: color, marginTop: '4px' }}>
              {Math.round((threat.confidence_score || 0) * 100)}% CONFIDENCE
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {threat.status !== 'blocked' && (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255,0,64,0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBlock(threat.id)}
                style={{
                  flex: 1, padding: '12px',
                  background: 'rgba(255,0,64,0.1)',
                  border: '1px solid #ff0040',
                  borderRadius: '2px', color: '#ff0040',
                  fontFamily: 'Orbitron,monospace', fontSize: '11px',
                  letterSpacing: '2px', cursor: 'pointer'
                }}
              >🚫 BLOCK IP</motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                flex: 1, padding: '12px',
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.3)',
                borderRadius: '2px', color: '#00d4ff',
                fontFamily: 'Orbitron,monospace', fontSize: '11px',
                letterSpacing: '2px', cursor: 'pointer'
              }}
            >CLOSE</motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Component
const ThreatCenter = () => {
  const [threats, setThreats] = useState(demoThreats);
  const [filtered, setFiltered] = useState(demoThreats);
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const r = await axios.get('http://localhost:8000/api/v1/threats?limit=50');
        if (r.data.threats?.length) setThreats(r.data.threats);
      } catch {}
    };
    fetchThreats();
    const i = setInterval(fetchThreats, 5000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    let data = [...threats];
    if (search) data = data.filter(t =>
      t.source_ip?.includes(search) ||
      t.attack_type?.toLowerCase().includes(search.toLowerCase())
    );
    if (sevFilter !== 'ALL') data = data.filter(t => t.severity === sevFilter.toLowerCase());
    setFiltered(data);
  }, [threats, search, sevFilter]);

  const handleBlock = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/threats/${id}/block`);
    } catch {}
    setThreats(prev => prev.map(t => t.id === id ? { ...t, status: 'blocked' } : t));
    setSelected(null);
  };

  const inputStyle = {
    background: 'rgba(0,212,255,0.04)',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: '2px', color: '#00d4ff',
    fontFamily: 'monospace', fontSize: '12px',
    outline: 'none', padding: '10px 14px'
  };

  const sevButtons = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '22px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '20px', fontWeight: '900', color: '#e0f4ff' }}>
            THREAT CENTER
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a6a8a', marginTop: '3px' }}>
            {filtered.length} THREATS DETECTED
          </div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            padding: '7px 14px',
            background: 'rgba(255,0,64,0.08)',
            border: '1px solid #ff004060',
            borderRadius: '2px',
            fontFamily: 'Orbitron,monospace', fontSize: '9px',
            color: '#ff0040', letterSpacing: '2px'
          }}
        >⚠ ACTIVE MONITORING</motion.div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'rgba(6,13,20,0.9)',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: '4px', padding: '16px',
        marginBottom: '16px',
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap'
      }}>
        {/* Search */}
        <input
          placeholder="🔍 Search IP or attack type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, width: '260px' }}
        />

        {/* Severity Filter */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {sevButtons.map(s => {
            const c = severityColors[s.toLowerCase()] || '#00d4ff';
            const active = sevFilter === s;
            return (
              <motion.button
                key={s}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSevFilter(s)}
                style={{
                  padding: '7px 12px',
                  background: active ? `${c}20` : 'transparent',
                  border: `1px solid ${active ? c : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '2px', color: active ? c : '#3a6a8a',
                  fontFamily: 'Orbitron,monospace', fontSize: '9px',
                  letterSpacing: '1px', cursor: 'pointer',
                  textShadow: active ? `0 0 8px ${c}` : 'none'
                }}
              >{s}</motion.button>
            );
          })}
        </div>

        {/* Total */}
        <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '11px', color: '#3a6a8a' }}>
          SHOWING <span style={{ color: '#00d4ff' }}>{filtered.length}</span> RESULTS
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(6,13,20,0.9)',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: '4px', overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr 1fr 1fr 120px 120px 100px',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
          background: 'rgba(0,212,255,0.03)'
        }}>
          {['#', 'SOURCE IP', 'ATTACK TYPE', 'DESTINATION', 'SEVERITY', 'STATUS', 'ACTION'].map(h => (
            <div key={h} style={{
              fontFamily: 'Orbitron,monospace', fontSize: '9px',
              color: '#3a6a8a', letterSpacing: '2px'
            }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <AnimatePresence>
            {filtered.map((t, i) => {
              const color = severityColors[t.severity] || '#4a7fa5';
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ background: 'rgba(0,212,255,0.04)' }}
                  onClick={() => setSelected(t)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr 1fr 1fr 120px 120px 100px',
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    borderLeft: `2px solid ${color}40`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a6a8a' }}>
                    {t.id}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#c0dff0' }}>
                    {t.source_ip}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e0f4ff' }}>
                    {t.attack_type}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#3a6a8a' }}>
                    {t.destination_ip}
                  </div>

                  {/* Severity Badge */}
                  <div>
                    <motion.div
                      animate={t.severity === 'critical' ? { opacity: [1, 0.5, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        background: `${color}15`,
                        border: `1px solid ${color}60`,
                        borderRadius: '2px',
                        fontFamily: 'Orbitron,monospace', fontSize: '8px',
                        color, boxShadow: `0 0 8px ${color}30`
                      }}
                    >{t.severity?.toUpperCase()}</motion.div>
                  </div>

                  {/* Status */}
                  <div style={{
                    fontFamily: 'monospace', fontSize: '11px',
                    color: t.status === 'blocked' ? '#00ff88' :
                      t.status === 'resolved' ? '#00d4ff' : '#ffcc00'
                  }}>
                    {t.status === 'blocked' ? '🚫 BLOCKED' :
                      t.status === 'resolved' ? '✅ RESOLVED' : '⚡ ACTIVE'}
                  </div>

                  {/* Block Button */}
                  <div>
                    {t.status !== 'blocked' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={e => { e.stopPropagation(); handleBlock(t.id); }}
                        style={{
                          padding: '5px 10px',
                          background: 'rgba(255,0,64,0.1)',
                          border: '1px solid #ff004060',
                          borderRadius: '2px', color: '#ff0040',
                          fontFamily: 'Orbitron,monospace', fontSize: '8px',
                          cursor: 'pointer', letterSpacing: '1px'
                        }}
                      >BLOCK</motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{
              padding: '60px', textAlign: 'center',
              color: '#3a6a8a', fontFamily: 'Orbitron,monospace', fontSize: '12px'
            }}>
              ✅ NO THREATS FOUND
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <ThreatModal
          threat={selected}
          onClose={() => setSelected(null)}
          onBlock={handleBlock}
        />
      )}
    </motion.div>
  );
};

export default ThreatCenter;