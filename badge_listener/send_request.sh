#!/bin/bash
curl -X POST http://localhost:8000/relay \
     -H "Content-Type: application/json" \
     -d "{\"badge_id\": \"$1\", \"reader_id\": \"$2\"}"