from collections import deque
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

from scanner import NextJsScanner, ScannerError, settings

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
scanner = NextJsScanner(settings)
history: deque[dict[str, Any]] = deque(maxlen=100)


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await scanner.close()


app = FastAPI(title="RFID Reader Simulator", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")


class SimulatedScan(BaseModel):
    badge_id: str = Field(min_length=1, max_length=128)
    reader_id: int = Field(gt=0)


def scanner_failure(error: ScannerError) -> HTTPException:
    return HTTPException(
        status_code=error.status_code,
        detail={"message": error.message, "upstream": error.payload},
    )


@app.get("/", response_class=HTMLResponse)
async def simulator(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request,
            "nextjs_url": settings.nextjs_base_url,
            "poll_interval_ms": settings.poll_interval_ms,
            "poll_timeout_ms": settings.poll_timeout_ms,
        },
    )


@app.post("/api/simulate-scan", status_code=201)
async def simulate_scan(scan: SimulatedScan):
    badge_id = scan.badge_id.strip()
    if not badge_id:
        raise HTTPException(status_code=422, detail="Badge ID cannot be blank")
    try:
        upstream = await scanner.create_scan(badge_id, scan.reader_id)
    except ScannerError as error:
        raise scanner_failure(error)

    event = {
        "scan_id": upstream["id"],
        "badge_id": badge_id,
        "reader_id": scan.reader_id,
        "status": "PENDING",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    history.appendleft(event)
    return event


@app.get("/api/organizations")
async def available_organizations():
    try:
        organizations = await scanner.get_organizations()
    except ScannerError as error:
        raise scanner_failure(error)
    return {"organizations": organizations}


@app.get("/api/scans/{scan_id}")
async def scan_status(scan_id: int):
    if scan_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid scan ID")
    try:
        scan = await scanner.get_scan(scan_id)
    except ScannerError as error:
        raise scanner_failure(error)

    for event in history:
        if event["scan_id"] == scan_id:
            event["status"] = scan["status"]
            event["updated_at"] = datetime.now(timezone.utc).isoformat()
            break
    return scan


@app.get("/api/history")
async def recent_history():
    return {"events": list(history)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True)
