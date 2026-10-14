import psutil
import socket
import os
import platform
from datetime import datetime

class SystemMonitor:
    
    def get_system_info(self):
        """System ki basic info"""
        return {
            "hostname": socket.gethostname(),
            "os": platform.system(),
            "os_version": platform.version(),
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "timestamp": datetime.now().isoformat()
        }
    
    def get_network_connections(self):
        """Active network connections"""
        connections = []
        try:
            for conn in psutil.net_connections(kind='inet'):
                if conn.status == 'ESTABLISHED':
                    connections.append({
                        "local_ip": conn.laddr.ip if conn.laddr else "",
                        "local_port": conn.laddr.port if conn.laddr else 0,
                        "remote_ip": conn.raddr.ip if conn.raddr else "",
                        "remote_port": conn.raddr.port if conn.raddr else 0,
                        "status": conn.status,
                        "pid": conn.pid
                    })
        except Exception as e:
            print(f"Network error: {e}")
        return connections
    
    def get_running_processes(self):
        """Saare running processes"""
        processes = []
        try:
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'username']):
                try:
                    processes.append(proc.info)
                except:
                    pass
        except Exception as e:
            print(f"Process error: {e}")
        return processes
    
    def get_disk_usage(self):
        """Disk usage"""
        disks = []
        for disk in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(disk.mountpoint)
                disks.append({
                    "device": disk.device,
                    "mountpoint": disk.mountpoint,
                    "percent": usage.percent
                })
            except:
                pass
        return disks
    
    def get_failed_logins(self):
        """Windows failed login attempts"""
        failed = []
        try:
            import subprocess
            result = subprocess.run(
                ['powershell', '-Command',
                 'Get-EventLog -LogName Security -InstanceId 4625 -Newest 10 | Select-Object TimeGenerated, Message | ConvertTo-Json'],
                capture_output=True, text=True, timeout=10
            )
            if result.stdout:
                failed = [{"event": "Failed Login", "raw": result.stdout[:500]}]
        except:
            pass
        return failed