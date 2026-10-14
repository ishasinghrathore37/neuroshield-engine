import os
import sys
import subprocess
import urllib.request
import json
from colorama import Fore, Style, init

init(autoreset=True)

INSTALL_DIR = os.path.expanduser("~\\NeuroshieldAgent")
CONFIG_FILE = os.path.join(INSTALL_DIR, "config.json")
SERVICE_SCRIPT = os.path.join(INSTALL_DIR, "run_agent.bat")

def print_banner():
    print(f"""{Fore.CYAN}
╔═══════════════════════════════════════╗
║     🛡️  NEUROSHIELD AGENT INSTALLER   ║
║        AI Endpoint Protection v1.0    ║
╚═══════════════════════════════════════╝
{Style.RESET_ALL}""")

def install():
    print_banner()
    print(f"{Fore.CYAN}🔧 Installing NeuroShield Agent...{Style.RESET_ALL}\n")

    # Step 1 — Directory banao
    os.makedirs(INSTALL_DIR, exist_ok=True)
    print(f"{Fore.GREEN}✅ Install directory created: {INSTALL_DIR}{Style.RESET_ALL}")

    # Step 2 — Backend URL lo
    print(f"\n{Fore.YELLOW}Enter your NeuroShield Backend URL:")
    print(f"(Example: https://your-app.hf.space){Style.RESET_ALL}")
    backend_url = input("URL: ").strip()

    if not backend_url:
        backend_url = "http://localhost:8000"

    # Step 3 — Config save karo
    config = {
        "backend_url": backend_url,
        "scan_interval": 10,
        "agent_version": "1.0.0",
        "auto_block": True,
        "send_reports": True
    }

    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)
    print(f"{Fore.GREEN}✅ Config saved{Style.RESET_ALL}")

    # Step 4 — Dependencies install karo
    print(f"\n{Fore.CYAN}📦 Installing dependencies...{Style.RESET_ALL}")
    packages = ["psutil", "requests", "colorama", "watchdog", "click", "python-dotenv"]
    for pkg in packages:
        subprocess.run([sys.executable, "-m", "pip", "install", pkg, "-q"],
                      capture_output=True)
        print(f"  {Fore.GREEN}✅ {pkg}{Style.RESET_ALL}")

    # Step 5 — BAT file banao (auto-start ke liye)
    bat_content = f"""@echo off
cd /d "{INSTALL_DIR}"
python "{os.path.abspath('main.py')}" start
pause"""

    with open(SERVICE_SCRIPT, 'w') as f:
        f.write(bat_content)

    # Step 6 — Startup mein add karo (optional)
    add_startup = input(f"\n{Fore.YELLOW}Auto-start with Windows? (y/n): {Style.RESET_ALL}").lower()
    if add_startup == 'y':
        startup_folder = os.path.expanduser(
            "~\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"
        )
        import shutil
        shutil.copy(SERVICE_SCRIPT, startup_folder)
        print(f"{Fore.GREEN}✅ Added to Windows startup!{Style.RESET_ALL}")

    print(f"""
{Fore.GREEN}╔═══════════════════════════════════════╗
║     ✅  INSTALLATION COMPLETE!         ║
╚═══════════════════════════════════════╝{Style.RESET_ALL}

{Fore.CYAN}Ab chalao:{Style.RESET_ALL}
  python main.py start     → Protection shuru
  python main.py status    → Status check
  python main.py uninstall → Remove agent
""")

def uninstall():
    print(f"{Fore.YELLOW}🗑️ Uninstalling NeuroShield Agent...{Style.RESET_ALL}")
    import shutil
    if os.path.exists(INSTALL_DIR):
        shutil.rmtree(INSTALL_DIR)
    print(f"{Fore.GREEN}✅ Uninstalled successfully{Style.RESET_ALL}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "uninstall":
        uninstall()
    else:
        install()