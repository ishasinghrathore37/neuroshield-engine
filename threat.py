from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class SeverityLevel(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ThreatLog(Base):
    __tablename__ = "threat_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    source_ip = Column(String, index=True)
    destination_ip = Column(String)
    attack_type = Column(String)
    severity = Column(Enum(SeverityLevel))
    confidence_score = Column(Float)  
    raw_log = Column(String)
    status = Column(String, default="detected")  
    created_at = Column(DateTime, default=func.now())

class NetworkLog(Base):
    __tablename__ = "network_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    source_ip = Column(String)
    dest_ip = Column(String)
    protocol = Column(String)
    bytes_sent = Column(Integer)
    packets = Column(Integer)
    timestamp = Column(DateTime, default=func.now())