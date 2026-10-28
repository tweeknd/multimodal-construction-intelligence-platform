from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import safety_router, crack_router, planning_router, valuation_router, assistant_router

app = FastAPI(
    title="ConstructIQ AI Backend",
    description="AI-Powered Multimodal Construction Intelligence Platform API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(safety_router.router, prefix="/api/safety", tags=["Safety Analysis"])
app.include_router(crack_router.router, prefix="/api/crack", tags=["Crack Analysis"])
app.include_router(planning_router.router, prefix="/api/planning", tags=["Planning & Estimation"])
app.include_router(valuation_router.router, prefix="/api/valuation", tags=["Real Estate Valuation"])
app.include_router(assistant_router.router, prefix="/api/assistant", tags=["Site Assistant"])

@app.get("/")
async def root():
    return {"status": "ConstructIQ AI Backend is running", "version": "2.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
