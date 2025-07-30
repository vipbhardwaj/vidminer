from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from query import search
import os
from pathlib import Path

# Ensure paths are relative to the app directory
BASE_DIR = Path(__file__).resolve().parent.parent
INDEX_DIR = BASE_DIR / "index"
VIDEOS_DIR = BASE_DIR / "videos"
TRANSCRIPTS_DIR = BASE_DIR / "transcripts"

app = FastAPI()

# Configure CORS - update with your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://your-frontend-domain.vercel.app",  # Update this with your frontend domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    query: str
    top_k: int = 3

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "Video Search API is running",
        "stats": {
            "videos": len(list(VIDEOS_DIR.glob("*.mp4"))),
            "transcripts": len(list(TRANSCRIPTS_DIR.glob("*.json"))),
            "index": INDEX_DIR.exists()
        }
    }

@app.post("/search")
def search_transcripts(search_query: SearchQuery):
    try:
        results = search(search_query.query, search_query.top_k)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# For PythonAnywhere WSGI
app_wsgi = app

# Only run uvicorn in development
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)