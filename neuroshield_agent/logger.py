import json
import os
from datetime import datetime
from colorama import Fore, Style

class AgentLogger:
    
    def __init__(self):
        os.makedirs("logs", exist_ok=True)
        self.log_file = f"logs/neuroshield_{datetime.now().strftime('%Y%m%d')}.json"
        self.logs = []
        self._load_existing()
    
    def _load_existing(self):
        try:
            if os.path.exists(self.log_file):
                with open(self.log_file, 'r') as f:
                    self.logs = json.load(f)
        except:
            self.logs = []
    
    def log(self, event_type, data, severity="info"):
        entry = {
            "id": len(self.logs) + 1,
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "severity": severity,
            "data": data,
            "agent_version": "1.0.0"
        }
        
        self.logs.append(entry)
        self._save()
        self._print(entry)
        return entry
    
    def log_threat(self, threat, decision):
        return self.log(
            event_type="THREAT_DETECTED",
            data={
                "threat": threat,
                "decision": decision,
                "action_taken": decision.get("action")
            },
            severity=threat.get("severity", "medium")
        )
    
    def log_scan(self, scan_num, stats):
        return self.log(
            event_type="SCAN_COMPLETE",
            data=stats,
            severity="info"
        )
    
    def _save(self):
        try:
            with open(self.log_file, 'w') as f:
                json.dump(self.logs[-500:], f, indent=2)
        except:
            pass
    
    def _print(self, entry):
        if entry["severity"] in ["critical", "high"]:
            color = Fore.RED if entry["severity"] == "critical" else Fore.YELLOW
            print(f"{color}📝 LOGGED: [{entry['severity'].upper()}] {entry['event_type']}{Style.RESET_ALL}")
    
    def get_summary(self):
        critical = len([l for l in self.logs if l["severity"] == "critical"])
        high = len([l for l in self.logs if l["severity"] == "high"])
        return {
            "total_logs": len(self.logs),
            "critical": critical,
            "high": high,
            "log_file": self.log_file
        }