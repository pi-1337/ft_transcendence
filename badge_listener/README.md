# RFID Reader Simulator

This local FastAPI website simulates RFID readers sending badge scans to the

## Run it

```bash
cd badge_listener
python3 -m venv .simulator-venv
source .simulator-venv/bin/activate
pip install -r requirements.txt
cp .simulator.env.example .simulator.env
```

Edit `.simulator.env` and set `SCANNER_API_KEY` to the same value used by Next.js. Then:

```bash
python app.py
```

Open <http://localhost:8001>. Next.js must be running at `NEXTJS_BASE_URL`.
The simulator stores its latest 100 events in memory, so history resets on restart.
