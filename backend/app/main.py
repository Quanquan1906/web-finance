from fastapi import FastAPI
from app.api.router import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": f"{settings.app_name} is running"}
