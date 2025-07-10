# src/transcribe.py

import os
import json
import whisper

VIDEO_DIR = "videos"
TRANSCRIPT_DIR = "transcripts"
MODEL_NAME = "base"  # or "small" for slightly better accuracy

model = whisper.load_model(MODEL_NAME)

def transcribe_all():
    os.makedirs(TRANSCRIPT_DIR, exist_ok=True)

    for fname in os.listdir(VIDEO_DIR):
        if not fname.lower().endswith(".mp4"):
            continue

        video_path = os.path.join(VIDEO_DIR, fname)
        transcript_path = os.path.join(TRANSCRIPT_DIR, f"{fname}.json")

        if os.path.exists(transcript_path):
            print(f"✅ Skipping '{fname}' — already transcribed.")
            continue

        print(f"🎤 Transcribing {fname}...")
        result = model.transcribe(video_path, verbose=True)

        with open(transcript_path, "w") as f:
            json.dump(result, f, indent=2)
        print(f"💾 Saved transcript to {transcript_path}")

# Optional CLI entry point
if __name__ == "__main__":
    transcribe_all()
