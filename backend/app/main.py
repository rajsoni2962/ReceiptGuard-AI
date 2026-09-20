from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, init_db
from app.api.health import router as health_router
from app.api.receipts import router as receipts_router
from app.api.chat import router as chat_router
from app.api.orders import router as orders_router
from app.api.audit import router as audit_router

# Lazy database initialization without ASGI lifespan dependencies (100% Vercel Serverless compliant)
_db_initialized = False

def ensure_db_ready():
    global _db_initialized
    if not _db_initialized:
        try:
            init_db()
            if settings.DEMO_MODE or (settings.DATABASE_URL.startswith("sqlite") and not settings.IS_SERVERLESS):
                try:
                    from app.seed_data import seed_database
                    seed_database()
                except Exception as e:
                    print(f"Seed database notice: {e}")
            _db_initialized = True
        except Exception as e:
            print(f"Database init notice: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ReceiptGuard AI: Your Personal Purchase Protection Agent API"
)

# Non-blocking middleware ensuring database is initialized on first request
@app.middleware("http")
async def db_init_middleware(request: Request, call_next):
    ensure_db_ready()
    return await call_next(request)

# CORS Configuration with Vercel deployment support
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers with and without prefix for flexible serverless routing
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(health_router)
app.include_router(receipts_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(orders_router, prefix=settings.API_V1_STR)
app.include_router(audit_router, prefix=settings.API_V1_STR)

# Register WebSockets only in non-serverless local/Docker environments
if not settings.IS_SERVERLESS:
    try:
        from app.websockets.progress import router as ws_router
        app.include_router(ws_router)
    except Exception as e:
        print(f"WebSocket router notice: {e}")

@app.get("/")
def root():
    return {
        "message": "Welcome to ReceiptGuard AI - Personal Purchase Protection Agent API",
        "docs": "/docs",
        "version": settings.VERSION,
        "status": "online"
    }
