# run.py

import sys
import time

if len(sys.argv) < 2:
    print("Usage: python run.py [transcribe|embed|query]")
    sys.exit(1)

cmd = sys.argv[1]

if cmd == "transcribe":
    print("🔹 Loading Whisper model...")
    start = time.time()
    from src.transcribe import transcribe_all
    print(f"🔹 Model loaded in {time.time() - start:.2f} sec")
    transcribe_all()
elif cmd == "embed":
    print("🔹 Running embedding and indexing...")
    from src.embed import embed_and_index
    embed_and_index()
elif cmd == "query":
    print("🔹 Starting query interface...")
    from src.query import search, print_results
    print("🔍 Ask a query (type ':q' or ':quit' to exit):")
    while True:
        try:
            query = input("> ").strip()
            if query.lower() in (":q", ":quit"):
                print("👋 Exiting.")
                break
            if not query:
                continue
            results = search(query)
            print_results(results)
        except KeyboardInterrupt:
            print("\n👋 Exiting.")
            break
else:
    print(f"❌ Unknown command: {cmd}")
