import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".simulator.env")


@dataclass(frozen=True)
class Settings:
    nextjs_base_url: st
    scanner_api_key: st
    poll_interval_ms: int
    poll_timeout_ms: int


settings = Settings(
    nextjs_base_url=os.getenv("NEXTJS_BASE_URL", "http://localhost:3000").rstrip("/"),
    scanner_api_key=os.getenv("SCANNER_API_KEY", ""),
    poll_interval_ms=int(os.getenv("POLL_INTERVAL_MS", "1000")),
    poll_timeout_ms=int(os.getenv("POLL_TIMEOUT_MS", "30000")),
)


class ScannerError(Exception):
    def __init__(self, message: str, status_code: int = 502, payload: Any = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload


class NextJsScanner:
    def __init__(self, config: Settings):
        self.config = config
        self.client = httpx.AsyncClient(timeout=10.0)

    @property
    def headers(self) -> dict[str, str]:
        if not self.config.scanner_api_key:
            raise ScannerError("SCANNER_API_KEY is missing in badge_listener/.simulator.env", 500)
        return {
            "Authorization": f"Bearer {self.config.scanner_api_key}",
            "Content-Type": "application/json",
        }

    async def request(self, method: str, path: str, json: dict[str, Any] = None):
        try:
            response = await self.client.request(
                method,
                f"{self.config.nextjs_base_url}{path}",
                headers=self.headers,
                json=json,
            )
        except httpx.RequestError as error:
            raise ScannerError(
                f"Could not connect to Next.js at {self.config.nextjs_base_url}"
            ) from erro

        try:
            payload = response.json()
        except ValueError as error:
            raise ScannerError("Next.js returned non-JSON data", 502, response.text[:500]) from erro

        # The current Next.js routes sometimes return errors with HTTP 200,
        # so inspect both the HTTP status and the JSON body.
        if not response.is_success or payload.get("error"):
            code = response.status_code if response.status_code >= 400 else 422
            raise ScannerError(payload.get("error", "Next.js rejected the request"), code, payload)
        return payload

    async def create_scan(self, badge_id: str, reader_id: int):
        payload = await self.request(
            "POST", "/api/public/v1/scans", {"badge_id": badge_id, "reader_id": reader_id}
        )
        if "id" not in payload:
            raise ScannerError("Next.js did not return a scan ID", payload=payload)
        return payload

    async def get_organizations(self):
        payload = await self.request("GET", "/api/public/v1/organizations")
        organizations = payload.get("organizations")
        if not isinstance(organizations, list):
            raise ScannerError("Next.js did not return organization data", payload=payload)
        return organizations

    async def get_scan(self, scan_id: int):
        payload = await self.request("GET", f"/api/public/v1/scans/{scan_id}")
        if "scan" not in payload:
            raise ScannerError("Next.js did not return scan data", payload=payload)
        return payload["scan"]

    async def close(self):
        await self.client.aclose()
