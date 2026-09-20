from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import Base, engine, init_db
from app.api.health import router as health_router
from app.api.receipts import router as receipts_router
from app.api.chat import router as chat_router
from app.api.orders import router as orders_router
from app.api.audit import router as audit_router
from app.websockets.progress import router as ws_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Non-destructive DB schema setup on cold start
    try:
        init_db()
    except Exception as e:
        print(f"Database init notice: {e}")

    # Run seed_database only if explicitly requested via DEMO_MODE or in local SQLite
    if settings.DEMO_MODE or (settings.DATABASE_URL.startswith("sqlite") and not settings.IS_SERVERLESS):
        try:
            from app.seed_data import seed_database
            seed_database()
        except Exception as e:
            print(f"Seed database notice: {e}")

    print("ReceiptGuard AI backend initialization complete.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ReceiptGuard AI: Your Personal Purchase Protection Agent API",
    lifespan=lifespan
)

# CORS Configuration with Vercel deployment support
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(receipts_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(orders_router, prefix=settings.API_V1_STR)
app.include_router(audit_router, prefix=settings.API_V1_STR)
app.include_router(ws_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to ReceiptGuard AI - Personal Purchase Protection Agent API",
        "docs": "/docs",
        "version": settings.VERSION
    }
