import re
from datetime import datetime
from typing import Optional

class LogParser:
    
    
    ATTACK_PATTERNS = {
        "SQL_INJECTION": r"(union|select|insert|drop|delete|update).*sql",
        "XSS": r"<script.*?>|javascript:",
        "BRUTE_FORCE": r"Failed password|authentication failure",
        "PORT_SCAN": r"SYN_SENT|nmap|masscan",
        "DOS_ATTACK": r"too many connections|connection refused",
    }
    
    def parse_log(self, raw_log: str) -> dict:
        
        
        result = {
            "raw": raw_log,
            "timestamp": datetime.now().isoformat(),
            "source_ip": self._extract_ip(raw_log),
            "attack_type": self._detect_attack(raw_log),
            "severity": self._calculate_severity(raw_log),
            "is_threat": False
        }
        
        if result["attack_type"]:
            result["is_threat"] = True
            
        return result
    
    def _extract_ip(self, log: str) -> Optional[str]:
        
        pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        match = re.search(pattern, log)
        return match.group() if match else None
    
    def _detect_attack(self, log: str) -> Optional[str]:
        
        log_lower = log.lower()
        for attack_type, pattern in self.ATTACK_PATTERNS.items():
            if re.search(pattern, log_lower, re.IGNORECASE):
                return attack_type
        return None
    
    def _calculate_severity(self, log: str) -> str:
        
        critical_keywords = ["root", "admin", "passwd", "DROP TABLE"]
        high_keywords = ["brute force", "SQL injection", "XSS"]
        
        if any(k.lower() in log.lower() for k in critical_keywords):
            return "critical"
        elif any(k.lower() in log.lower() for k in high_keywords):
            return "high"
        elif self._detect_attack(log):
            return "medium"
        return "low"

log_parser = LogParser()