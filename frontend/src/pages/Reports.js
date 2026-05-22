import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const demoReports = [
  {
    id: 'INC-20240518-001',
    severity: 'CRITICAL',
    attack_type: 'Port Scanning',
    source_ip: '192.168.1.105',
    status: 'OPEN',
    confidence: 99,
    time: '14:32:01',
    date: '2024-05-18',
    actions: ['🚫 IP Blocked', '📧 Alert Sent', '📋 Report Generated'],
    summary: 'Critical port scanning attack detected from external IP. Automated blocking initiated immediately.',
    recommendation: ['Block source IP range', 'Enable port scan detection', 'Review firewall rules']
  },
  {
    id: 'INC-20240518-002',
    severity: 'HIGH',
    attack_type: 'Brute Force',
    source_ip: '203.0.113.42',
    status: 'RESOLVED',
    confidence: 94,
    time: '12:15:44',
    date: '2024-05-18',
    actions: ['🚫 IP Blocked', '🔒 Account Locked', '📧 Alert Sent'],
    summary: 'SSH brute force attempt detected with 847 failed login attempts in 60 seconds.',
    recommendation: ['Enable MFA', 'Set account lockout policy', 'Use SSH key authentication']
  },
  {
    id: 'INC-20240518-003',
    severity: 'MEDIUM',
    attack_type: 'SQL Injection',
    source_ip: '198.51.100.7',
    status: 'INVESTIGATING',
    confidence: 87,
    time: '10:44:22',
    date: '2024-05-18',
    actions: ['📝 Logged', '⚠ Alert Generated'],
    summary: 'SQL injection attempt detected in web application login form.',
    recommendation: ['Use parameterized queries', 'Enable WAF', 'Sanitize all inputs']
  },
  {
    id: 'INC-20240517-001',
    severity: 'HIGH',
    attack_type: 'XSS Attack',
    source_ip: '172.16.0.23',
    status: 'RESOLVED',
    confidence: 91,
    time: '09:20:11',
    date: '2024-05-17',
    actions: ['🚫 IP Blocked', '🛡️ WAF Rule Added'],
    summary: 'Cross-site scripting attack detected targeting user session cookies.',
    recommendation: ['Implement CSP headers', 'Sanitize output', 'Use HTTPOnly cookies']
  },
];

const severityColors = {
  CRITICAL: '#ff0040',
  HIGH: '#ff6600',
  MEDIUM: '#ffcc00',
  LOW: '#00ff88',
};

const statusColors = {
  OPEN: '#ff0040',
  INVESTIGATING: '#ffcc00',
  RESOLVED: '#00ff88',
};


const ReportModal = ({ report, onClose }) => {
  if (!report) return null;
  const color = severityColors[report.severity] || '#00d4ff';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 1000, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)'
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '560px', maxHeight: '85vh',
          overflowY: 'auto',
          background: '#060d14',
          border: `1px solid ${color}50`,
          borderRadius: '4px', padding: '30px',
          boxShadow: `0 0 60px ${color}15`,
          position: 'relative'
        }}
      >
        {/* Top glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg,transparent,${color},transparent)`
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '11px', color: '#3a6a8a', letterSpacing: '2px' }}>
              INCIDENT REPORT
            </div>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '18px', color: color, fontWeight: '900', marginTop: '4px' }}>
              {report.id}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              padding: '4px 12px',
              background: `${color}15`,
              border: `1px solid ${color}60`,
              borderRadius: '2px',
              fontFamily: 'Orbitron,monospace', fontSize: '9px',
              color
            }}>{report.severity}</div>
            <div style={{
              padding: '4px 12px',
              background: `${statusColors[report.status]}15`,
              border: `1px solid ${statusColors[report.status]}60`,
              borderRadius: '2px',
              fontFamily: 'Orbitron,monospace', fontSize: '9px',
              color: statusColors[report.status]
            }}>{report.status}</div>
          </div>
        </div>

        {/* Summary */}
        <div style={{
          background: 'rgba(0,212,255,0.03)',
          border: '1px solid rgba(0,212,255,0.1)',
          borderRadius: '2px', padding: '14px',
          marginBottom: '20px',
          fontFamily: 'monospace', fontSize: '12px',
          color: '#c0dff0', lineHeight: '1.7'
        }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '8px', color: '#3a6a8a', marginBottom: '8px', letterSpacing: '2px' }}>
            EXECUTIVE SUMMARY
          </div>
          {report.summary}
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'ATTACK TYPE', value: report.attack_type },
            { label: 'SOURCE IP', value: report.source_ip },
            { label: 'DATE', value: report.date },
            { label: 'TIME', value: report.time },
            { label: 'CONFIDENCE', value: `${report.confidence}%` },
            { label: 'DETECTION', value: 'AI/ML Engine' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(0,212,255,0.08)',
              borderRadius: '2px', padding: '10px'
            }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '8px', color: '#3a6a8a', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c0dff0' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Actions Taken */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '9px', color: '#3a6a8a', letterSpacing: '2px', marginBottom: '10px' }}>
            ACTIONS TAKEN
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {report.actions.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(0,255,136,0.05)',
                  border: '1px solid rgba(0,255,136,0.15)',
                  borderRadius: '2px',
                  fontFamily: 'monospace', fontSize: '12px',
                  color: '#00ff88'
                }}
              >{a}</motion.div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '9px', color: '#3a6a8a', letterSpacing: '2px', marginBottom: '10px' }}>
            RECOMMENDATIONS
          </div>
          {report.recommendation.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '7px 0',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              fontFamily: 'monospace', fontSize: '12px', color: '#c0dff0'
            }}>
              <div style={{ width: '4px', height: '4px', background: '#00d4ff', borderRadius: '50%', flexShrink: 0 }} />
              {r}
            </div>
          ))}
        </div>

        {/* Close */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          style={{
            width: '100%', padding: '12px',
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: '2px', color: '#00d4ff',
            fontFamily: 'Orbitron,monospace', fontSize: '11px',
            letterSpacing: '2px', cursor: 'pointer'
          }}
        >CLOSE REPORT</motion.button>
      </motion.div>
    </motion.div>
  );
};


const Reports = () => {
  const [reports, setReports] = useState(demoReports);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL'
    ? reports
    : reports.filter(r => r.status === filter);

  const statCards = [
    { label: 'TOTAL', value: reports.length, color: '#00d4ff' },
    { label: 'OPEN', value: reports.filter(r => r.status === 'OPEN').length, color: '#ff0040' },
    { label: 'INVESTIGATING', value: reports.filter(r => r.status === 'INVESTIGATING').length, color: '#ffcc00' },
    { label: 'RESOLVED', value: reports.filter(r => r.status === 'RESOLVED').length, color: '#00ff88' },
  ];

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
            INCIDENT REPORTS
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a6a8a', marginTop: '3px' }}>
            AI-GENERATED SECURITY REPORTS
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'rgba(6,13,20,0.9)',
              border: `1px solid ${s.color}25`,
              borderRadius: '4px', padding: '16px',
              textAlign: 'center',
              boxShadow: `0 0 15px ${s.color}10`
            }}
          >
            <div style={{
              fontFamily: 'Orbitron,monospace', fontSize: '28px',
              fontWeight: '900', color: s.color,
              textShadow: `0 0 15px ${s.color}`
            }}>{s.value}</div>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '9px', color: '#3a6a8a', letterSpacing: '2px', marginTop: '4px' }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '16px'
      }}>
        {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'].map(f => {
          const c = f === 'ALL' ? '#00d4ff' : statusColors[f];
          return (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                background: filter === f ? `${c}20` : 'transparent',
                border: `1px solid ${filter === f ? c : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '2px',
                color: filter === f ? c : '#3a6a8a',
                fontFamily: 'Orbitron,monospace', fontSize: '9px',
                letterSpacing: '1px', cursor: 'pointer',
                textShadow: filter === f ? `0 0 8px ${c}` : 'none'
              }}
            >{f}</motion.button>
          );
        })}
      </div>

      {/* Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <AnimatePresence>
          {filtered.map((report, i) => {
            const color = severityColors[report.severity] || '#00d4ff';
            const sColor = statusColors[report.status] || '#00d4ff';
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.01, boxShadow: `0 0 25px ${color}15` }}
                onClick={() => setSelected(report)}
                style={{
                  background: 'rgba(6,13,20,0.9)',
                  border: `1px solid ${color}25`,
                  borderRadius: '4px', padding: '20px',
                  cursor: 'pointer', position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Top glow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg,transparent,${color},transparent)`
                }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '12px', color, fontWeight: '900' }}>
                    {report.id}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{
                      padding: '3px 8px',
                      background: `${color}15`,
                      border: `1px solid ${color}50`,
                      borderRadius: '2px',
                      fontFamily: 'Orbitron,monospace', fontSize: '8px', color
                    }}>{report.severity}</div>
                    <motion.div
                      animate={report.status === 'OPEN' ? { opacity: [1, 0.4, 1] } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{
                        padding: '3px 8px',
                        background: `${sColor}15`,
                        border: `1px solid ${sColor}50`,
                        borderRadius: '2px',
                        fontFamily: 'Orbitron,monospace', fontSize: '8px',
                        color: sColor
                      }}
                    >{report.status}</motion.div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { label: 'ATTACK', value: report.attack_type },
                    { label: 'SOURCE IP', value: report.source_ip },
                    { label: 'TIME', value: `${report.date} ${report.time}` },
                    { label: 'CONFIDENCE', value: `${report.confidence}%` },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '7px', color: '#3a6a8a', letterSpacing: '1px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c0dff0', marginTop: '2px' }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div style={{
                  fontFamily: 'monospace', fontSize: '11px',
                  color: '#3a6a8a', lineHeight: '1.5',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  paddingTop: '10px'
                }}>
                  {report.summary.slice(0, 80)}...
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {report.actions.slice(0, 2).map((a, i) => (
                    <div key={i} style={{
                      padding: '3px 8px',
                      background: 'rgba(0,255,136,0.05)',
                      border: '1px solid rgba(0,255,136,0.15)',
                      borderRadius: '2px',
                      fontFamily: 'monospace', fontSize: '9px', color: '#00ff88'
                    }}>{a}</div>
                  ))}
                </div>

                {/* View button */}
                <div style={{
                  position: 'absolute', bottom: '16px', right: '16px',
                  fontFamily: 'Orbitron,monospace', fontSize: '8px',
                  color: '#00d4ff', letterSpacing: '1px'
                }}>VIEW REPORT →</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <ReportModal report={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default Reports;