from .config import SUSPICIOUS_PROCESSES, SUSPICIOUS_PORTS
from datetime import datetime

class ThreatDetector:
    
    def __init__(self):
        self.detected_threats = []
    
    def analyze_processes(self, processes):
        """Suspicious processes check karo"""
        threats = []
        for proc in processes:
            name = proc.get('name', '').lower()
            for sus in SUSPICIOUS_PROCESSES:
                if sus in name:
                    threat = {
                        "type": "SUSPICIOUS_PROCESS",
                        "attack_type": "Malware Detected",
                        "severity": "critical",
                        "detail": f"Suspicious process found: {proc.get('name')}",
                        "pid": proc.get('pid'),
                        "timestamp": datetime.now().isoformat()
                    }
                    threats.append(threat)
        return threats
    
    def analyze_connections(self, connections):
        """Suspicious network connections check karo"""
        threats = []
        for conn in connections:
            remote_port = conn.get('remote_port', 0)
            remote_ip = conn.get('remote_ip', '')
            
            # Suspicious port check
            if remote_port in SUSPICIOUS_PORTS:
                threats.append({
                    "type": "SUSPICIOUS_CONNECTION",
                    "attack_type": "C2 Communication",
                    "severity": "critical",
                    "source_ip": remote_ip,
                    "detail": f"Connection to suspicious port {remote_port}",
                    "timestamp": datetime.now().isoformat()
                })
            
            # Port scan detection — too many connections
            same_ip_conns = [c for c in connections if c.get('remote_ip') == remote_ip]
            if len(same_ip_conns) > 15:
                threats.append({
                    "type": "PORT_SCAN",
                    "attack_type": "Port Scanning",
                    "severity": "high",
                    "source_ip": remote_ip,
                    "detail": f"Possible port scan: {len(same_ip_conns)} connections from {remote_ip}",
                    "timestamp": datetime.now().isoformat()
                })
        
        return threats
    
    def analyze_cpu_spike(self, cpu_percent):
        """CPU spike — possible cryptominer"""
        if cpu_percent > 90:
            return [{
                "type": "CPU_SPIKE",
                "attack_type": "Cryptominer/DDoS",
                "severity": "high",
                "detail": f"CPU usage critical: {cpu_percent}%",
                "timestamp": datetime.now().isoformat()
            }]
        return []
    
    def analyze_failed_logins(self, failed_logins):
        """Brute force detection"""
        if len(failed_logins) >= 5:
            return [{
                "type": "BRUTE_FORCE",
                "attack_type": "Brute Force",
                "severity": "critical",
                "detail": f"{len(failed_logins)} failed login attempts detected",
                "timestamp": datetime.now().isoformat()
            }]
        return []
    
    def run_full_scan(self, system_data):
        """Pura system scan karo"""
        all_threats = []
        
        all_threats += self.analyze_processes(system_data.get('processes', []))
        all_threats += self.analyze_connections(system_data.get('connections', []))
        all_threats += self.analyze_cpu_spike(system_data.get('cpu_percent', 0))
        all_threats += self.analyze_failed_logins(system_data.get('failed_logins', []))
        
        return all_threats

