import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const severityColor = {
  critical: '#ff0040',
  high: '#ff6600',
  medium: '#ffcc00',
  low: '#00ff88',
  none: '#4a7fa5'
};

const LiveThreatFeed = () => {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/threats?limit=8');
        setThreats(res.data.threats || []);
      } catch {
        // Demo data
        setThreats([
          { id: 1, source_ip: '192.168.1.105', attack_type: 'Port Scanning', severity: 'critical', status: 'detected' },
          { id: 2, source_ip: '10.0.0.45', attack_type: 'Brute Force', severity: 'high', status: 'blocked' },
          { id: 3, source_ip: '172.16.0.23', attack_type: 'SQL Injection', severity: 'medium', status: 'detected' },
        ]);
      }
    };
    fetchThreats();
    const interval = setInterval(fetchThreats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'rgba(6,13,20,0.9)',
      border: '1px solid rgba(0,212,255,0.2)',
      borderRadius: '4px',
      height: '300px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: '11px', color: '#00d4ff', letterSpacing: '2px' }}>
          ⚡ LIVE THREAT FEED
        </div>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ width: '8px', height: '8px', background: '#ff0040', borderRadius: '50%', boxShadow: '0 0 8px #ff0040' }}
        />
      </div>

      {/* Threats */}
      <div style={{ overflowY: 'auto', height: 'calc(100% - 50px)' }}>
        <AnimatePresence>
          {threats.map((threat, i) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '6px', height: '6px',
                  background: severityColor[threat.severity] || '#4a7fa5',
                  borderRadius: '50%',
                  boxShadow: `0 0 8px ${severityColor[threat.severity]}`
                }} />
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono', fontSize: '12px', color: '#e0f4ff' }}>
                    {threat.source_ip}
                  </div>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '11px', color: '#4a7fa5' }}>
                    {threat.attack_type}
                  </div>
                </div>
              </div>
              <div style={{
                padding: '3px 10px',
                background: `${severityColor[threat.severity]}20`,
                border: `1px solid ${severityColor[threat.severity]}60`,
                borderRadius: '2px',
                fontFamily: 'Orbitron', fontSize: '9px',
                color: severityColor[threat.severity],
                textTransform: 'uppercase'
              }}>
                {threat.severity}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveThreatFeed;