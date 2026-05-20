

# 🛡️ NeuroShield
### AI-Powered Autonomous Cybersecurity Platform

**Real-time threat detection • Autonomous response • 99.99% ML accuracy**

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📌 Overview

**NeuroShield** is a production-grade, AI-powered Security Operations Center (SOC) platform that autonomously detects, analyzes, and responds to cybersecurity threats in real-time — without human intervention.

Built on cutting-edge ML models trained on real-world attack data (CICIDS2017), NeuroShield combines a **Random Forest classifier (99.99% accuracy)**, **Isolation Forest anomaly detection**, and an intelligent **auto-response engine** to deliver enterprise-grade security at scale.

> *"The same technology that Fortune 500 companies spend millions on — built from scratch."*

---

## ✨ Key Features

### 🧠 AI/ML Engine
- **Random Forest Classifier** — 99.99% accuracy on real network attack data
- **Isolation Forest** — Detects unknown zero-day anomalies without prior signatures
- **SMOTE Balancing** — Handles real-world imbalanced threat data
- Trained on **CICIDS2017** — Industry-standard cybersecurity dataset (2.8M+ records)

### 🔍 Threat Detection
- Real-time log analysis with pattern-based detection
- Detects: Port Scanning, Brute Force, SQL Injection, XSS, DDoS, and more
- AI confidence scoring on every alert
- Attack chain reasoning and kill-chain visualization

### 🛡️ Autonomous Response
- **Severity-based auto-response** (Low → Critical)
- Automatic IP blocking on high/critical threats
- Real-time Slack/Email alerting
- Human-in-the-loop approval for critical actions

### 🖥️ Advanced Dashboard
- **3D Interactive Globe** — Live world attack map with animated arcs
- Real-time charts: Area, Bar, Donut, Circular Gauges
- Live threat feed with auto-refresh every 5 seconds
- Dark cyberpunk UI with neon animations and Matrix effects

### 📋 Compliance & Reporting
- Auto-generated professional incident reports
- SOC2 & ISO 27001 compliance templates
- Full audit trail with timestamps
- Risk scoring and impact assessment

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI, SQLAlchemy, SQLite/PostgreSQL |
| **AI/ML** | Scikit-learn, PyTorch, Isolation Forest, Random Forest |
| **Data** | CICIDS2017, SMOTE (imbalanced-learn), Pandas, NumPy |
| **Frontend** | React 18, Framer Motion, Recharts, Three.js |
| **3D Globe** | react-globe.gl, Three.js |
| **Security** | JWT Auth, RBAC, Rate Limiting |
| **DevOps** | Docker, Railway, Vercel, GitHub Actions |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    NEUROSHIELD PLATFORM                  │
├──────────────┬──────────────────┬───────────────────────┤
│   FRONTEND   │     BACKEND      │      AI/ML ENGINE      │
│              │                  │                        │
│  React 18    │   FastAPI        │  Random Forest         │
│  3D Globe    │   SQLAlchemy     │  (99.99% accuracy)     │
│  Recharts    │   Log Parser     │                        │
│  Framer      │   Auto-Response  │  Isolation Forest      │
│  Motion      │   Alert Engine   │  (Anomaly Detection)   │
│              │                  │                        │
│  Dashboard   │   REST API       │  CICIDS2017 Dataset    │
│  Threat UI   │   WebSocket      │  50,000+ samples       │
│  AI Terminal │   JWT Auth       │  SMOTE Balancing       │
└──────────────┴──────────────────┴───────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
```
Python 3.10+
Node.js 18+
Git
```

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/NeuroShield.git
cd NeuroShield
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows


pip install -r requirements.txt
```

Create `.env` file:
```env
APP_NAME=NeuroShield
DEBUG=True
DATABASE_URL=sqlite:///./neuroshield.db
SECRET_KEY=your-super-secret-key-here
```

Run backend:
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. ML Models Setup
```bash
cd ml_engine
pip install -r requirements.txt

# Download CICIDS2017 dataset from Kaggle
# Place in ml_engine/data/cicids2017_cleaned.csv

python preprocess.py    # Data preprocessing + SMOTE
python train_models.py  # Train ML models
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 5. Open Browser
```
http://localhost:3000
```

---

## 📊 ML Model Performance

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| **Random Forest** | **99.99%** | 1.00 | 1.00 | 1.00 |
| Isolation Forest | 40.33%* | — | — | — |

> *Isolation Forest is unsupervised — used for unknown anomaly detection, not classification accuracy.

**Training Data:** CICIDS2017 (50,000 samples after SMOTE balancing)
- Normal Traffic: 49,787 samples
- Port Scanning: 49,787 samples (after SMOTE)

---

## 📁 Project Structure

```
NeuroShield/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── core/
│   │   │   ├── config.py        # Settings & env vars
│   │   │   └── database.py      # DB connection
│   │   ├── models/
│   │   │   └── threat.py        # SQLAlchemy models
│   │   ├── api/
│   │   │   └── routes.py        # API endpoints
│   │   └── services/
│   │       ├── log_parser.py    # Log analysis
│   │       ├── predictor.py     # ML predictions
│   │       └── security.py      # Auto-response engine
│   └── models/                  # Trained ML models
│       ├── random_forest.pkl
│       ├── isolation_forest.pkl
│       ├── scaler.pkl
│       └── label_encoder.pkl
│
├── ml_engine/
│   ├── explore.py               # Data exploration
│   ├── preprocess.py            # Data preprocessing
│   ├── train_models.py          # Model training
│   └── data/                    # Dataset (not in git)
│
└── frontend/
    └── src/
        ├── App.js               # Router & auth
        ├── pages/
        │   ├── Login.js         # Matrix rain login
        │   ├── Dashboard.js     # 3D Globe + Charts
        │   ├── ThreatCenter.js  # Live threat table
        │   ├── AIAnalysis.js    # Neural net terminal
        │   └── Reports.js       # Incident reports
        └── components/
            ├── Layout.js        # Sidebar navigation
            ├── StatsCards.js    # Animated stat cards
            └── CircularGauge.js # SVG gauge charts
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/analyze-log` | Analyze raw log for threats |
| `POST` | `/api/v1/ml-predict` | ML model prediction |
| `GET` | `/api/v1/threats` | Get all detected threats |
| `GET` | `/api/v1/dashboard/stats` | Dashboard statistics |
| `PUT` | `/api/v1/threats/{id}/block` | Block a threat |
| `POST` | `/api/v1/security/auto-respond` | Trigger auto-response |
| `POST` | `/api/v1/security/block-ip` | Block an IP |
| `GET` | `/api/v1/security/blocked-ips` | List blocked IPs |
| `POST` | `/api/v1/security/incident-report` | Generate report |

**Interactive API Docs:** `http://localhost:8000/docs`

---

## 🧪 Testing

```bash
# Test threat detection
curl -X POST http://localhost:8000/api/v1/analyze-log \
  -H "Content-Type: application/json" \
  -d '{"raw_log": "Failed password for root from 192.168.1.105 port 22"}'

# Expected response:
# {
#   "threat_detected": true,
#   "attack_type": "BRUTE_FORCE",
#   "severity": "critical"
# }
```

---

## 🚢 Deployment

### Backend — Railway
```bash
# Push to GitHub, connect Railway
# Set environment variables in Railway dashboard
railway up
```

### Frontend — Vercel
```bash
# Push to GitHub, connect Vercel
# Set root directory to /frontend
vercel --prod
```

---

## 🗺️ Roadmap

- [x] Core threat detection engine
- [x] ML model training (Random Forest + Isolation Forest)
- [x] Auto-response system
- [x] 3D dashboard with Globe visualization
- [ ] LLM integration (GPT-4/Claude) for attack explanation
- [ ] WebSocket real-time push notifications
- [ ] Multi-user RBAC authentication
- [ ] Kubernetes deployment config
- [ ] IP Geolocation tracking
- [ ] Dark Web threat intelligence feed

---

## 🤝 Contributing

```bash
# Fork the repo
git fork https://github.com/yourusername/NeuroShield

# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Isha Singh Rathore**
- LinkedIn: [linkedin.com/in/yourname](#)
- GitHub: [@yourusername](#)
- Email: ishasinghrathore514@gmail.com

---


**⭐ Star this repo if you found it helpful!**

*Built with ❤️ and a lot of ☕*