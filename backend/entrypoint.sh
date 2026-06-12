#!/bin/sh

python seed_levels.py #execute seed automatically

uvicorn app.main:app --host 0.0.0.0 --port 8000 