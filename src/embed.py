# src/embed.py

import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

TRANSCRIPT_DIR = "transcripts"
INDEX_DIR = "index"
EMBED_MODEL = "all-MiniLM-L6-v2"

model = SentenceTransformer(EMBED_MODEL)

def embed_and_index():
    all_embeddings = []
    all_metadata = []

    print(f"🔍 Scanning transcripts in '{TRANSCRIPT_DIR}'...")

    for fname in os.listdir(TRANSCRIPT_DIR):
        if not fname.endswith(".json"):
            continue

        video_path = fname.replace(".json", "")
        transcript_path = os.path.join(TRANSCRIPT_DIR, fname)

        with open(transcript_path, "r") as f:
            data = json.load(f)

        for segment in data["segments"]:
            text = segment["text"].strip()
            if not text:
                continue

            embedding = model.encode(text, convert_to_numpy=True)
            all_embeddings.append(embedding)

            all_metadata.append({
                "video": video_path,
                "start": segment["start"],
                "end": segment["end"],
                "text": text
            })

    print(f"✅ Loaded {len(all_metadata)} segments from {len(os.listdir(TRANSCRIPT_DIR))} transcript(s).")

    # Convert embeddings to FAISS index
    dimension = all_embeddings[0].shape[0]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(all_embeddings))

    # Save index + metadata
    os.makedirs(INDEX_DIR, exist_ok=True)
    faiss.write_index(index, f"{INDEX_DIR}/index.faiss")

    with open(f"{INDEX_DIR}/metadata.json", "w") as f:
        json.dump(all_metadata, f, indent=2)

    print(f"💾 Saved FAISS index and metadata to '{INDEX_DIR}'")

# Optional: allow direct script use
if __name__ == "__main__":
    embed_and_index()
