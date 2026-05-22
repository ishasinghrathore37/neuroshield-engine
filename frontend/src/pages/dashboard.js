import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import StatsCards from '../components/statscards';
import CircularGauge from '../components/circulargauge';

// 3D Globe
const GlobeMap = () => {
  const [Globe, setGlobe] = useState(null);

  useEffect(() => {
    import('react-globe.gl').then(m => setGlobe(() => m.default));
  }, []);

  const arcs = [
    { startLat: 55.7, startLng: 37.6, endLat: 28.6, endLng: 77.2, color: '#ff0040' },
    { startLat: 39.9, startLng: 116.4, endLat: 37.7, endLng: -122.4, color: '#ff6600' },
    { startLat: 51.5, startLng: -0.1, endLat: 40.7, endLng: -74.0, color: '#ffcc00' },
    { startLat: 35.6, startLng: 139.7, endLat: 19.1, endLng: 72.8, color: '#ff0040' },
    { startLat: -23.5, startLng: -46.6, endLat: 48.8, endLng: 2.3, color: '#ff6600' },
    { startLat: 1.3, startLng: 103.8, endLat: 55.7, endLng: 37.6, color: '#00d4ff' },
    { startLat: 48.8, startLng: 2.3, endLat: 28.6, endLng: 77.2, color: '#ff0040' },
    { startLat: 40.7, startLng: -74.0, endLat: 51.5, endLng: -0.1, color: '#00ff88' },
  ];

  if (!Globe) return (
    <div style={{
      height: '360px', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ color: '#00d4ff', fontFamily: 'Orbitron,monospace', fontSize: '12px' }}
      >◉ LOADING GLOBE...</motion.div>
    </div>
  );

  return (
    <Globe
      width={480}
      height={360}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      arcsData={arcs}
      arcColor="color"
      arcDashLength={0.4}
      arcDashGap={0.2}
      arcDashAnimateTime={1500}
      arcStroke={0.5}
      pointsData={arcs.map(a => ({ lat: a.startLat, lng: a.startLng, color: a.color }))}
      pointColor="color"
      pointRadius={0.5}
      pointAltitude={0.01}
      atmosphereColor="#00d4ff"
      atmosphereAltitude={0.15}
    />
  );
};

// Live Threat Feed
const LiveFeed = () => {
  const [threats, setThreats] = useState([
    { id: 1, ip: '192.168.1.105', type: 'Port Scanning', sev: 'critical' },
    { id: 2, ip: '10.0.0.45', type: 'Brute Force', sev: 'high' },
    { id: 3, ip: '172.16.0.23', type: 'SQL Injection', sev: 'medium' },
    { id: 4, ip: '203.0.113.42', type: 'XSS Attack', sev: 'low' },
    { id: 5, ip: '198.51.100.7', type: 'Port Scanning', sev: 'high' },
  ]);

  const colors = { critical:'#ff0040', high:'#ff6600', medium:'#ffcc00', low:'#00ff88' };

  useEffect(() => {
    const fetch = async () => {
      try {
        const r = await axios.get('http://localhost:8000/api/v1/threats?limit=8');
        if (r.data.threats?.length) setThreats(r.data.threats.map(t => ({
          id: t.id, ip: t.source_ip, type: t.attack_type, sev: t.severity
        })));
      } catch {}
    };
    fetch();
    const i = setInterval(fetch, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{
      background: 'rgba(6,13,20,0.9)',
      border: '1px solid rgba(0,212,255,0.15)',
      borderRadius: '4px', height: '100%'
    }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontFamily: 'Orbitron,monospace', fontSize: '10px', color: '#00d4ff', letterSpacing: '2px' }}>
          ⚡ LIVE THREAT FEED
        </div>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ width: '7px', height: '7px', background: '#ff0040', borderRadius: '50%', boxShadow: '0 0 8px #ff0040' }}
        />
      </div>
      <div style={{ overflowY: 'auto', maxHeight: '240px' }}>
        {threats.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '6px', height: '6px',
                background: colors[t.sev] || '#4a7fa5',
                borderRadius: '50%',
                boxShadow: `0 0 6px ${colors[t.sev]}`
              }} />
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c0dff0' }}>{t.ip}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#3a6a8a' }}>{t.type}</div>
              </div>
            </div>
            <div style={{
              padding: '2px 8px',
              background: `${colors[t.sev]}15`,
              border: `1px solid ${colors[t.sev]}50`,
              borderRadius: '2px',
              fontFamily: 'Orbitron,monospace', fontSize: '8px',
              color: colors[t.sev]
            }}>{t.sev?.toUpperCase()}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const areaData = [
    { d: 'MON', v: 12 }, { d: 'TUE', v: 28 },
    { d: 'WED', v: 19 }, { d: 'THU', v: 45 },
    { d: 'FRI', v: 33 }, { d: 'SAT', v: 8 }, { d: 'SUN', v: 22 }
  ];
  const barData = [
    { name: 'Port Scan', v: 45, c: '#ff0040' },
    { name: 'Brute Force', v: 30, c: '#ff6600' },
    { name: 'SQL Inject', v: 15, c: '#ffcc00' },
    { name: 'XSS', v: 10, c: '#00d4ff' },
  ];
  const pieData = [
    { name: 'Critical', v: 15, c: '#ff0040' },
    { name: 'High', v: 25, c: '#ff6600' },
    { name: 'Medium', v: 35, c: '#ffcc00' },
    { name: 'Low', v: 25, c: '#00ff88' },
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const r = await axios.get('http://localhost:8000/api/v1/dashboard/stats');
        setStats(r.data);
      } catch {
        setStats({ total_threats: 127, critical: 14, blocked: 89 });
      }
    };
    fetch();
    const i = setInterval(fetch, 5000);
    return () => clearInterval(i);
  }, []);

  const card = (children, extra = {}) => (
    <div style={{
      background: 'rgba(6,13,20,0.9)',
      border: '1px solid rgba(0,212,255,0.15)',
      borderRadius: '4px', padding: '18px', ...extra
    }}>{children}</div>
  );

  const title = t => (
    <div style={{
      fontFamily: 'Orbitron,monospace', fontSize: '10px',
      color: '#3a6a8a', letterSpacing: '2px', marginBottom: '14px'
    }}>{t}</div>
  );

  const tooltip = { contentStyle: { background: '#060d14', border: '1px solid #00d4ff30', fontFamily: 'monospace', fontSize: '11px' } };

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
            COMMAND CENTER
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a6a8a', marginTop: '3px' }}>
            REAL-TIME THREAT INTELLIGENCE
          </div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            padding: '7px 14px',
            background: 'rgba(0,255,136,0.08)',
            border: '1px solid #00ff8860',
            borderRadius: '2px',
            fontFamily: 'Orbitron,monospace', fontSize: '9px',
            color: '#00ff88', letterSpacing: '2px'
          }}
        >● LIVE MONITORING</motion.div>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Row 1 — Globe + Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '14px', marginBottom: '14px' }}>

        {/* Globe */}
        {card(
          <>
            {title('🌍 GLOBAL ATTACK MAP — LIVE')}
            <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
              <GlobeMap />
            </div>
          </>
        )}

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Area Chart */}
          {card(
            <>
              {title('📈 THREAT HISTORY — 7 DAYS')}
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff0040" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff0040" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: '#3a6a8a', fontFamily: 'monospace', fontSize: 10 }} axisLine={false} />
                  <YAxis tick={{ fill: '#3a6a8a', fontFamily: 'monospace', fontSize: 10 }} axisLine={false} />
                  <Tooltip {...tooltip} />
                  <Area type="monotone" dataKey="v" stroke="#ff0040" fill="url(#ag)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}

          {/* Gauges */}
          {card(
            <>
              {title('⚡ SYSTEM VITALS')}
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <CircularGauge value={72} label="CPU" color="#00d4ff" size={100} />
                <CircularGauge value={45} label="NETWORK" color="#ff6600" size={100} />
                <CircularGauge value={88} label="THREAT LVL" color="#ff0040" size={100} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 2 — Bar + Pie + Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>

        {/* Bar Chart */}
        {card(
          <>
            {title('🎯 ATTACK TYPES')}
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: '#3a6a8a', fontFamily: 'monospace', fontSize: 9 }} axisLine={false} />
                <YAxis tick={{ fill: '#3a6a8a', fontFamily: 'monospace', fontSize: 9 }} axisLine={false} />
                <Tooltip {...tooltip} />
                <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                  {barData.map((e, i) => <Cell key={i} fill={e.c} style={{ filter: `drop-shadow(0 0 4px ${e.c})` }} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* Pie Chart */}
        {card(
          <>
            {title('🔴 SEVERITY SPLIT')}
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} dataKey="v">
                  {pieData.map((e, i) => <Cell key={i} fill={e.c} style={{ filter: `drop-shadow(0 0 5px ${e.c})` }} />)}
                </Pie>
                <Tooltip {...tooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {pieData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '7px', height: '7px', background: d.c, borderRadius: '50%' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#3a6a8a' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Live Feed */}
        <LiveFeed />
      </div>
    </motion.div>
  );
};

export default Dashboard;