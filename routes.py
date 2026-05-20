from app.services.predictor import predictor
from app.services.security import security_engine
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.threat import ThreatLog, NetworkLog
from app.services.log_parser import log_parser
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()


class LogInput(BaseModel):
    raw_log: str
    source_ip: Optional[str] = None

class ThreatInput(BaseModel):
    attack_type: str
    source_ip: str = "unknown"
    severity: str = "low"
    confidence: float = 0.0



@router.post("/analyze-log", tags=["Threat Detection"])
async def analyze_log(log_input: LogInput, db: Session = Depends(get_db)):
    """Single log analyze karo"""
    
    parsed = log_parser.parse_log(log_input.raw_log)
    
    if parsed["is_threat"]:
        
        threat = ThreatLog(
            source_ip=parsed["source_ip"] or "unknown",
            destination_ip="0.0.0.0",
            attack_type=parsed["attack_type"],
            severity=parsed["severity"],
            confidence_score=0.85,
            raw_log=log_input.raw_log,
            status="detected"
        )
        db.add(threat)
        db.commit()
        db.refresh(threat)
        
        return {
            "threat_detected": True,
            "attack_type": parsed["attack_type"],
            "severity": parsed["severity"],
            "threat_id": threat.id,
            "message": f"⚠️ {parsed['attack_type']} detected from {parsed['source_ip']}"
        }
    
    return {"threat_detected": False, "message": "✅ Log is clean"}


@router.get("/threats", tags=["Dashboard"])
async def get_all_threats(
    severity: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    
    query = db.query(ThreatLog)
    if severity:
        query = query.filter(ThreatLog.severity == severity)
    threats = query.order_by(ThreatLog.created_at.desc()).limit(limit).all()
    return {"total": len(threats), "threats": threats}


@router.get("/dashboard/stats", tags=["Dashboard"])
async def get_stats(db: Session = Depends(get_db)):
    """Dashboard ke liye stats"""
    total = db.query(ThreatLog).count()
    critical = db.query(ThreatLog).filter(ThreatLog.severity == "critical").count()
    high = db.query(ThreatLog).filter(ThreatLog.severity == "high").count()
    blocked = db.query(ThreatLog).filter(ThreatLog.status == "blocked").count()
    
    return {
        "total_threats": total,
        "critical": critical,
        "high": high,
        "blocked": blocked,
        "system_status": "🟢 Active"
    }


@router.put("/threats/{threat_id}/block", tags=["Response"])
async def block_threat(threat_id: int, db: Session = Depends(get_db)):
    """Threat ko block karo"""
    threat = db.query(ThreatLog).filter(ThreatLog.id == threat_id).first()
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    
    threat.status = "blocked"
    db.commit()
    
    return {
        "message": f"🛡️ Threat {threat_id} blocked successfully",
        "blocked_ip": threat.source_ip
    }

@router.post("/ml-predict", tags=["AI Detection"])
async def ml_predict(features: list[float], db: Session = Depends(get_db)):
    """ML Model se threat predict karo"""
    
    result = predictor.predict(features)
    
    if result.get("is_threat"):
        threat = ThreatLog(
            source_ip="ml-detected",
            destination_ip="0.0.0.0",
            attack_type=result["attack_type"],
            severity=result["severity"],
            confidence_score=result["confidence"] / 100,
            raw_log=str(features),
            status="detected"
        )
        db.add(threat)
        db.commit()
    
    return result

  
@router.post("/security/auto-respond", tags=["Security"])
async def auto_respond(threat_data: ThreatInput, db: Session = Depends(get_db)):
    response = security_engine.auto_respond(threat_data.model_dump())
    return response


@router.post("/security/block-ip", tags=["Security"])
async def block_ip(ip: str, reason: str = "Manual block"):
    result = security_engine.block_ip(ip, reason)
    return result


@router.get("/security/blocked-ips", tags=["Security"])
async def get_blocked_ips():
    ips = security_engine.get_blocked_ips()
    return {"total_blocked": len(ips), "blocked_ips": ips}


@router.delete("/security/unblock-ip", tags=["Security"])
async def unblock_ip(ip: str):
    return security_engine.unblock_ip(ip)


@router.post("/security/incident-report", tags=["Security"])
async def generate_report(threat_data: ThreatInput):
    report = security_engine.generate_incident_report(threat_data.model_dump())
    return report


@router.get("/security/alert-log", tags=["Security"])
async def get_alert_log():
    logs = security_engine.get_alert_log()
    return {"total": len(logs), "logs": logs}