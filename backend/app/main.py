import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles

from app.common.error import (
    BadRequest,
    UnauthorizedError,
    NotFoundError,
    InternalError,
    UnprocessableError,
)
from app.conf.config import Config
from app.conf.logging import setup_logging
from app.db.db import connect_and_init_db, close_db_connect
from app.api import health
from app.api.v1 import sample_resource as sample_resource_v1
from app.api.v1 import auth as auth_v1
from fastapi.middleware.cors import CORSMiddleware

# Logging
setup_logging()

# app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # FE của bạn
    allow_credentials=True,
    allow_methods=["*"],  # phải có OPTIONS
    allow_headers=["*"],  # Content-Type, Authorization...
)

# mounting static folder on serve for fetching static files
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")


# ensure_indexes runs after connect_and_init_db so db_client is available
async def _ensure_indexes():
    from app.db.db import get_db
    from app.schemas.auth import ensure_indexes
    db = await get_db()
    await ensure_indexes(db)


# DB Events  (order matters: validate → connect → indexes)
app.add_event_handler("startup", Config.app_settings_validate)
app.add_event_handler("startup", connect_and_init_db)
app.add_event_handler("startup", _ensure_indexes)
app.add_event_handler("shutdown", close_db_connect)


# openapi schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=Config.title,
        version=Config.version,
        routes=app.routes
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


# HTTP error responses
@app.exception_handler(BadRequest)
async def bad_request_handler(req: Request, exc: BadRequest) -> JSONResponse:
    return exc.gen_err_resp()


@app.exception_handler(UnauthorizedError)
async def unauthorized_handler(
    req: Request, exc: UnauthorizedError
) -> JSONResponse:
    return exc.gen_err_resp()


@app.exception_handler(NotFoundError)
async def not_found_handler(req: Request, exc: NotFoundError) -> JSONResponse:
    return exc.gen_err_resp()


@app.exception_handler(InternalError)
async def internal_error_handler(
    req: Request, exc: InternalError
) -> JSONResponse:
    return exc.gen_err_resp()


@app.exception_handler(RequestValidationError)
async def invalid_req_handler(
    req: Request,
    exc: RequestValidationError
) -> JSONResponse:
    logging.error(f'Request invalid. {str(exc)}')
    return JSONResponse(
        status_code=400,
        content={
            "type": "about:blank",
            'title': 'Bad Request',
            'status': 400,
            'detail': [str(exc)]
        }
    )


@app.exception_handler(UnprocessableError)
async def unprocessable_error_handler(
    req: Request,
    exc: UnprocessableError
) -> JSONResponse:
    return exc.gen_err_resp()


# API Path
app.include_router(
    health.router,
    prefix='/health',
    tags=["health"]
)
app.include_router(
    sample_resource_v1.router,
    prefix='/api/sample-resource-app/v1/sample-resource',
    tags=["sample resource v1"]
)
app.include_router(
    auth_v1.router,
    prefix='/api/v1/auth',
    tags=["auth v1"]
)

