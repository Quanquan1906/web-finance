import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api import health
from app.api.v1 import auth as auth_v1
from app.api.v1 import sample_resource as sample_resource_v1
from app.common.error import (
    BadRequest,
    InternalError,
    NotFoundError,
    UnauthorizedError,
    UnprocessableError,
)
from app.conf.config import Config
from app.conf.logging import setup_logging
from app.db.db import close_db_connect, connect_and_init_db, get_db
from app.repository.auth_repository import ensure_indexes

# Logging
setup_logging()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="frontend/static"), name="static")


async def _ensure_indexes():
    db = await get_db()
    await ensure_indexes(db)


app.add_event_handler("startup", Config.app_settings_validate)
app.add_event_handler("startup", connect_and_init_db)
app.add_event_handler("startup", _ensure_indexes)
app.add_event_handler("shutdown", close_db_connect)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=Config.title,
        version=Config.version,
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.exception_handler(BadRequest)
async def bad_request_handler(req: Request, exc: BadRequest) -> JSONResponse:
    return exc.gen_err_resp()


@app.exception_handler(UnauthorizedError)
async def unauthorized_handler(req: Request, exc: UnauthorizedError) -> JSONResponse:
    return exc.gen_err_resp()


@app.exception_handler(NotFoundError)
async def not_found_handler(req: Request, exc: NotFoundError) -> JSONResponse:
    return exc.gen_err_resp()


@app.exception_handler(InternalError)
async def internal_error_handler(req: Request, exc: InternalError) -> JSONResponse:
    return exc.gen_err_resp()


@app.exception_handler(RequestValidationError)
async def invalid_req_handler(
    req: Request, exc: RequestValidationError
) -> JSONResponse:
    logging.error(f"Request invalid. {str(exc)}")
    return JSONResponse(
        status_code=400,
        content={
            "type": "about:blank",
            "title": "Bad Request",
            "status": 400,
            "detail": [str(exc)],
        },
    )


@app.exception_handler(UnprocessableError)
async def unprocessable_error_handler(
    req: Request, exc: UnprocessableError
) -> JSONResponse:
    return exc.gen_err_resp()


app.include_router(
    health.router,
    prefix="/health",
    tags=["health"],
)

app.include_router(
    sample_resource_v1.router,
    prefix="/api/sample-resource-app/v1/sample-resource",
    tags=["sample resource v1"],
)

app.include_router(
    auth_v1.router,
    prefix="/api/v1",
)
