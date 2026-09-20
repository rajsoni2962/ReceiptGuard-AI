import sys
import os

# Resolve paths so backend modules import cleanly on Vercel
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

for p in [backend_dir, root_dir, current_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from app.main import app
except Exception as e:
    import traceback
    err_tb = traceback.format_exc()
    print(f"CRITICAL BACKEND STARTUP ERROR:\n{err_tb}", file=sys.stderr)
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    app = FastAPI()

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
    async def fallback_handler(path: str):
        return JSONResponse(
            status_code=500,
            content={
                "error": "Backend Startup Failed",
                "message": str(e),
                "traceback": err_tb
            }
        )

# Expose FastAPI application instance for Vercel serverless functions
__all__ = ["app"]
