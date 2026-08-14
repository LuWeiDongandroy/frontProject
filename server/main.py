from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

try:
    from form_store import DATA_FILE, FormStore, validate_submission
except ImportError:
    from server.form_store import DATA_FILE, FormStore, validate_submission

app = FastAPI(title="Demo API")
store = FormStore(DATA_FILE)

# 本地开发时允许 Vue 开发服务器跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DIST_DIR = Path(__file__).resolve().parent.parent / "client" / "dist"


@app.get("/api/hello")
def hello():
    return {
        "message": "Hello from FastAPI",
        "time": datetime.now(timezone.utc).isoformat(),
        "status": "ok",
    }


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.post("/api/form")
def create_form(payload: dict):
    errors = validate_submission(payload)
    if errors:
        raise HTTPException(status_code=422, detail=errors)
    item = store.append(payload)
    return {"ok": True, "message": "提交成功", "item": item}


@app.get("/api/form")
def list_forms():
    return {"items": store.list_all()}


# 生产环境：托管前端构建产物，一个端口同时提供页面和接口
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def spa(full_path: str):
        index = DIST_DIR / "index.html"
        file_path = DIST_DIR / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(index)
