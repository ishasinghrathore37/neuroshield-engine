import requests
from .config import BACKEND_URL
from colorama import Fore, Style, init
import json

init(autoreset=True)

class Reporter:
    
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.connected = False
        self.test_connection()
    
    def test_connection(self):
        """Backend se connection test karo"""
        try:
            r = requests.get(f"{self.backend_url}/", timeout=5)
            if r.status_code == 200:
                self.connected = True
                print(f"{Fore.GREEN}✅ Connected to NeuroShield Backend{Style.RESET_ALL}")
            else:
                print(f"{Fore.RED}❌ Backend connection failed{Style.RESET_ALL}")
        except:
            print(f"{Fore.YELLOW}⚠ Backend offline — saving locally{Style.RESET_ALL}")
    
    def report_threat(self, threat):
        """Threat backend pe bhejo"""
        try:
            payload = {
                "raw_log": threat.get('detail', ''),
                "source_ip": threat.get('source_ip', 'localhost')
            }
            r = requests.post(
                f"{self.backend_url}/api/v1/analyze-log",
                json=payload, timeout=5
            )
            if r.status_code == 200:
                print(f"{Fore.RED}🚨 THREAT REPORTED: {threat.get('attack_type')}{Style.RESET_ALL}")
                return True
        except Exception as e:
            print(f"{Fore.YELLOW}⚠ Report failed: {e}{Style.RESET_ALL}")
        return False
    
    def report_system_stats(self, stats):
        """System stats backend pe bhejo"""
        try:
            requests.post(
                f"{self.backend_url}/api/v1/agent/stats",
                json=stats, timeout=5
            )
        except:
            pass