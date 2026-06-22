from fastapi import FastAPI, Request, HTTPException
from datetime import datetime, UTC
import json
import uvicorn
import httpx

app = FastAPI()

@app.post("/relay")
async def receive_and_enrich_scan(request: Request):
    try:
        scan = await request.json()
    except json.JSONDecodeError:
        print("\n[!] WARNING: Dropped request. Payload is not valid JSON.")
        raise HTTPException(status_code=400, detail="Invalid JSON format")

    badge_id = scan.get("badge_id")
    reader_id = scan.get("reader_id")
    
    if not badge_id or not reader_id:
        print(f"\n[!] WARNING: Dropped invalid request. Missing data: {scan}")
        raise HTTPException(status_code=400, detail="Missing badge_id or reader_id")

    # current_time = datetime.now(UTC)
    enriched_metadata = {      
        "badge_id": badge_id,       
        "reader_id": reader_id,     
    }


    
    print("\n" + "="*50)
    print(f"      [METADATA READY] Reader: {reader_id}      ")
    print("="*50)
    print(json.dumps(enriched_metadata, indent=4))
    print("="*50 + "\n")
    # TODO: move into a .env file
    # 4. FORWARD TO NEXT.JS (Inside the function!)
    NEXTJS_URL = "http://localhost:3000/api/public/v1/scans"
    SECRET_KEY = "Bearer H3R0123"

    headers = {
        "Authorization": SECRET_KEY,
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(NEXTJS_URL, json=enriched_metadata, headers=headers)
            if response.status_code == 200 or response.status_code == 201:
                data = response.json()
                print(f"[SUCCESS] Data saved to Next.js database!, ID: {data["id"]}")
            else:
                print(f"[ERROR] Next.js rejected the payload: {response.status_code} — {response.text}")
        except httpx.RequestError as e:
            print(f"[ERROR] Could not connect to Next.js: {e}")
    
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)