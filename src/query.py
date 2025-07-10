import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import time

INDEX_DIR = "index"
EMBED_MODEL = "all-MiniLM-L6-v2"

start_time = time.perf_counter()
model = SentenceTransformer(EMBED_MODEL)
print(f"🔹 Model loaded in {(time.perf_counter() - start_time):.2f} sec")
start_index = time.perf_counter()
index = faiss.read_index(f"{INDEX_DIR}/index.faiss")
print(f"🔹 FAISS index loaded in {(time.perf_counter() - start_index):.2f} sec")
with open(f"{INDEX_DIR}/metadata.json", "r") as f:
    metadata = json.load(f)

# def load_index():
    
#     return index, metadata

def search(query, top_k=3):
    t0 = time.perf_counter()
    query_vec = model.encode([query], convert_to_numpy=True)
    t1 = time.perf_counter()

    D, I = index.search(query_vec, top_k)
    t2 = time.perf_counter()

    results = []
    for score, idx in zip(D[0], I[0]):
        match = metadata[idx]
        results.append({
            "video": match["video"],
            "start": match["start"],
            "end": match["end"],
            "text": match["text"],
            "score": float(score)
        })

    t3 = time.perf_counter()

    print(f"\n⏱️  Timing breakdown:")
    print(f"  🔹 Embedding time      : {(t1 - t0)*1000:.2f} ms")
    print(f"  🔹 FAISS search time   : {(t2 - t1)*1000:.2f} ms")
    print(f"  🔹 Result formatting   : {(t3 - t2)*1000:.2f} ms")
    print(f"  🔸 Total               : {(t3 - t0):.3f} s\n")

    return results


def print_results(results):
    print("\nTop Results:")
    for r in results:
        print(f"\n🎥 {r['video']}")
        print(f"⏱️  {format_time(r['start'])} — {format_time(r['end'])}")
        print(f"💬 \"{r['text']}\"")
        print(f"📊 Score: {r['score']:.2f}")


def format_time(seconds):
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{mins:02}:{secs:02}"


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python run.py query \"your search query here\"")
        exit(1)

    query = " ".join(sys.argv[1:])
    results = search(query)
    print_results(results)
