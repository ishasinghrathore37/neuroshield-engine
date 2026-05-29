from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.api.routes import router

app = FastAPI(
    title="🛡️ NeuroShield",
    description="AI-Powered Cybersecurity Platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    try:
        Base.metadata.create_all(bind=engine)
        print("DB connected successfully")
    except Exception as e:
        print("DB error:", e)


app.include_router(router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "name": "🛡️ NeuroShield",
        "status": "🟢 Running",
        "docs": "/docs"
    }