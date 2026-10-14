import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
AI_ENABLED = bool(ANTHROPIC_API_KEY)
print(f"KEY: '{ANTHROPIC_API_KEY[:10]}...'")
print(f"AI_ENABLED: {AI_ENABLED}")

CONFIG_FILE = os.path.expanduser("~\\NeuroshieldAgent\\config.json")

def load_config():
    """Local config load karo"""
    try:
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    except:
        return {
            "backend_url": "http://localhost:8000",
            "scan_interval": 10
        }

def get_cloud_rules(backend_url):
    """Cloud se latest rules download karo"""
    try:
        r = requests.get(f"{backend_url}/api/v1/agent/rules", timeout=5)
        if r.status_code == 200:
            data = r.json()
            print(f"✅ Rules downloaded: {len(data['rules'])} rules")
            return data
    except:
        pass
    
    # Fallback — default rules
    return {
        "rules": [],
        "suspicious_processes": [
            "mimikatz", "pwdump", "netcat",
            "meterpreter", "psexec"
        ],
        "suspicious_ports": [4444, 1337, 31337]
    }

# Load everything
_config = load_config()
BACKEND_URL = _config.get("backend_url", "https://huggingface.co/spaces/Ishasinghrathore/neuroshield")
SCAN_INTERVAL = _config.get("scan_interval", 10)
AGENT_VERSION = "1.0.0"

# Cloud se rules load karo
_cloud_data = get_cloud_rules(BACKEND_URL)
SUSPICIOUS_PROCESSES = _cloud_data.get("suspicious_processes", [])
SUSPICIOUS_PORTS = _cloud_data.get("suspicious_ports", [4444, 1337])
CLOUD_RULES = _cloud_data.get("rules", [])



