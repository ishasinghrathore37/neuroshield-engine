import time
import os
import click
from colorama import Fore, Style, init
from dotenv import load_dotenv
from neuroshield_agent.monitor import SystemMonitor
from neuroshield_agent.detector import ThreatDetector
from neuroshield_agent.reporter import Reporter
from neuroshield_agent.policy_engine import PolicyEngine
from neuroshield_agent.logger import AgentLogger
from neuroshield_agent.ai_brain import AIBrain
from neuroshield_agent.config import SCAN_INTERVAL, ANTHROPIC_API_KEY, AI_ENABLED

load_dotenv()
init(autoreset=True)

def print_banner():
    print(f"""{Fore.CYAN}
███╗   ██╗███████╗██╗   ██╗██████╗  ██████╗ 
████╗  ██║██╔════╝██║   ██║██╔══██╗██╔═══██╗
██╔██╗ ██║█████╗  ██║   ██║██████╔╝██║   ██║
██║╚██╗██║██╔══╝  ██║   ██║██╔══██╗██║   ██║
██║ ╚████║███████╗╚██████╔╝██║  ██║╚██████╔╝
╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
{Fore.GREEN}        🛡️  NEUROSHIELD AGENT v1.0.0
{Fore.BLUE}        AI Endpoint Protection System
{Fore.MAGENTA}        Powered by Claude AI
{Style.RESET_ALL}""")

@click.group()
def cli():
    pass

@cli.command()
def start():
    """Agent start karo"""
    print_banner()

    # ── Initialize All Modules ──────────────
    monitor  = SystemMonitor()
    detector = ThreatDetector()
    policy   = PolicyEngine()
    logger   = AgentLogger()
    reporter = Reporter()

    # ── AI Brain ────────────────────────────
    ai_brain = None
    if AI_ENABLED:
        ai_brain = AIBrain(ANTHROPIC_API_KEY)
        print(f"{Fore.MAGENTA}🧠 AI Brain: ACTIVE (Claude){Style.RESET_ALL}")
    else:
        print(f"{Fore.YELLOW}⚠ AI Brain: DISABLED — add ANTHROPIC_API_KEY in .env{Style.RESET_ALL}")

    print(f"{Fore.GREEN}✅ All modules loaded!")
    print(f"{Fore.CYAN}⚡ Starting real-time protection...\n{Style.RESET_ALL}")

    scan_count = 0

    while True:
        try:
            scan_count += 1
            info = monitor.get_system_info()

            # ── INPUT ───────────────────────
            system_data = {
                "processes"    : monitor.get_running_processes(),
                "connections"  : monitor.get_network_connections(),
                "cpu_percent"  : info['cpu_percent'],
                "failed_logins": monitor.get_failed_logins(),
            }

            print(f"{Fore.BLUE}[#{scan_count}] {info['timestamp'][:19]}"
                  f"  CPU:{info['cpu_percent']}%"
                  f"  RAM:{info['memory_percent']}%"
                  f"  Conns:{len(system_data['connections'])}{Style.RESET_ALL}")

            # ── SCANNER ─────────────────────
            threats = detector.run_full_scan(system_data)

            # ── POLICY + DECISION + LOG ─────
            if threats:
                for threat in threats:

                    # Policy Engine
                    decision = policy.evaluate(threat)
                    policy.execute_decision(decision)

                    # Logger
                    logger.log_threat(threat, decision)

                    # Reporter → Backend
                    reporter.report_threat(threat)

                    # ── AI BRAIN ────────────
                    if ai_brain:
                        print(f"\n{Fore.MAGENTA}🧠 AI ANALYZING THREAT...{Style.RESET_ALL}")

                        ai_result = ai_brain.analyze_threat(
                            threat,
                            {
                                "cpu_percent"      : info['cpu_percent'],
                                "memory_percent"   : info['memory_percent'],
                                "connections_count": len(system_data['connections']),
                                "os"               : info.get('os', 'Windows')
                            }
                        )

                        print(f"""
{Fore.MAGENTA}╔══════════════════════════════════════════╗
║   🧠 AI THREAT ANALYSIS — CLAUDE         ║
╚══════════════════════════════════════════╝
{Fore.RED}Risk Level    : {ai_result.get('risk_level')}
{Fore.WHITE}Explanation   : {ai_result.get('explanation')}
{Fore.YELLOW}Attacker Goal : {ai_result.get('attack_motive')}
{Fore.RED}Do NOW        : {ai_result.get('immediate_action')}
{Fore.GREEN}Long-term Fix : {ai_result.get('long_term_fix')}
{Fore.CYAN}AI Confidence : {ai_result.get('confidence')}%{Style.RESET_ALL}
""")
            else:
                print(f"  {Fore.GREEN}✅ System clean{Style.RESET_ALL}")

            # Log scan stats
            logger.log_scan(scan_count, {
                "cpu"          : info['cpu_percent'],
                "ram"          : info['memory_percent'],
                "threats_found": len(threats)
            })

            time.sleep(SCAN_INTERVAL)

        except KeyboardInterrupt:
            summary = logger.get_summary()
            print(f"\n{Fore.YELLOW}🛑 Agent stopped")
            print(f"📊 Total logs  : {summary['total_logs']}")
            print(f"🔴 Critical    : {summary['critical']}")
            print(f"🟠 High        : {summary['high']}{Style.RESET_ALL}")
            break
        except Exception as e:
            print(f"{Fore.RED}Error: {e}{Style.RESET_ALL}")
            time.sleep(5)

@cli.command()
def status():
    """Agent status dekho"""
    print_banner()
    logger   = AgentLogger()
    reporter = Reporter()
    summary  = logger.get_summary()

    print(f"{Fore.CYAN}📊 AGENT STATUS{Style.RESET_ALL}")
    print(f"Total Logs  : {summary['total_logs']}")
    print(f"Critical    : {Fore.RED}{summary['critical']}{Style.RESET_ALL}")
    print(f"High        : {Fore.YELLOW}{summary['high']}{Style.RESET_ALL}")
    print(f"Log File    : {summary['log_file']}")
    print(f"AI Brain    : {Fore.MAGENTA}{'✅ Active' if AI_ENABLED else '❌ Disabled'}{Style.RESET_ALL}")
    print(f"Backend     : {'✅ Connected' if reporter.connected else '❌ Offline'}")

@cli.command()
def setup():
    """Agent setup karo"""
    print_banner()
    print(f"{Fore.CYAN}🔧 NEUROSHIELD AGENT SETUP{Style.RESET_ALL}\n")

    url = input("Backend URL (HuggingFace): ").strip()
    key = input("Anthropic API Key (optional): ").strip()

    with open(".env", "w") as f:
        f.write(f"BACKEND_URL={url}\n")
        if key:
            f.write(f"ANTHROPIC_API_KEY={key}\n")

    print(f"\n{Fore.GREEN}✅ Setup complete!")
    print(f"Ab chalao: python main.py start{Style.RESET_ALL}")

def main():
    cli()

if __name__ == "__main__":
    main()