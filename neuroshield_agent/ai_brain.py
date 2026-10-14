import anthropic
import json
from colorama import Fore, Style

class AIBrain:
    
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        print(f"{Fore.GREEN}✅ AI Brain Initialized (Claude){Style.RESET_ALL}")
    
    def analyze_threat(self, threat: dict, system_info: dict) -> dict:
        """Threat ko AI se analyze karao"""
        
        prompt = f"""You are NeuroShield AI - an expert cybersecurity analyst.

THREAT DETECTED:
- Type: {threat.get('type')}
- Attack: {threat.get('attack_type')}  
- Severity: {threat.get('severity')}
- Detail: {threat.get('detail')}
- Source IP: {threat.get('source_ip', 'localhost')}

SYSTEM INFO:
- CPU: {system_info.get('cpu_percent')}%
- RAM: {system_info.get('memory_percent')}%
- Active Connections: {system_info.get('connections_count')}
- OS: {system_info.get('os')}

Respond ONLY in this JSON format:
{{
    "risk_level": "CRITICAL/HIGH/MEDIUM/LOW",
    "explanation": "2-3 lines explaining what this attack is",
    "attack_motive": "What attacker is trying to do",
    "immediate_action": "What to do RIGHT NOW",
    "long_term_fix": "Permanent solution",
    "confidence": 95
}}"""

        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            response_text = message.content[0].text
            
            # JSON parse karo
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
                
        except Exception as e:
            print(f"{Fore.RED}AI Error: {e}{Style.RESET_ALL}")
        
        # Fallback
        return {
            "risk_level": threat.get('severity', 'unknown').upper(),
            "explanation": f"Threat detected: {threat.get('attack_type')}",
            "attack_motive": "Unknown",
            "immediate_action": "Block and investigate",
            "long_term_fix": "Review security policies",
            "confidence": 75
        }
    
    def generate_report(self, threats: list, system_info: dict) -> str:
        """Full incident report generate karo"""
        
        if not threats:
            return "No threats detected in this scan period."
        
        threat_summary = "\n".join([
            f"- {t.get('attack_type')} ({t.get('severity')}): {t.get('detail', '')[:80]}"
            for t in threats
        ])
        
        prompt = f"""You are NeuroShield AI Security Analyst.

SCAN RESULTS:
{threat_summary}

SYSTEM: CPU {system_info.get('cpu_percent')}% | RAM {system_info.get('memory_percent')}%

Write a professional 5-line security incident report covering:
1. Executive summary
2. Threats found
3. Risk assessment  
4. Actions taken
5. Recommendations

Keep it concise and professional."""

        try:
            message = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        except:
            return f"Scan detected {len(threats)} threats. Manual review required."