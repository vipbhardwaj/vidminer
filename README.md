# Video Transcript Search Tool

This tool allows you to transcribe videos, create searchable embeddings, and perform semantic search through video transcripts. It uses OpenAI's Whisper for transcription and sentence transformers for semantic search capabilities.

## Dependencies

Key libraries used:
- `openai-whisper`: For accurate video transcription
- `sentence-transformers`: For creating semantic embeddings
- `faiss-cpu`: For efficient similarity search
- `torch`: Required for ML models
- `ffmpeg-python`: For video processing
- Additional dependencies are listed in `requirements.txt`

## Setup

1. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Project Structure

```
my_project/
├── videos/         # Place your .mp4 videos here
├── transcripts/    # Generated transcripts (JSON)
├── index/         # Generated FAISS index and metadata
├── src/           # Source code
└── run.py         # Main script
```

## Usage

The tool provides three main commands:

### 1. Transcribe Videos

Place your `.mp4` videos in the `videos/` directory, then run:
```bash
python run.py transcribe
```
This will:
- Load the Whisper model
- Process all new videos in the `videos/` directory
- Save transcripts as JSON files in `transcripts/`
- Skip already transcribed videos

### 2. Create Searchable Index

After transcription, create the search index:
```bash
python run.py embed
```
This will:
- Process all transcripts in `transcripts/`
- Create embeddings using sentence transformers
- Build a FAISS index for efficient similarity search
- Save the index and metadata in `index/`

### 3. Search Through Transcripts

To search through your video transcripts:
```bash
python run.py query
```

This will start an interactive query interface where you can:
- Type natural language queries to find relevant video segments
- See timestamps, video sources, and relevance scores
- Get quick access to specific moments in your videos

To exit the query interface:
- Type `:q` or `:quit`
- Or use Ctrl+C

Example query session:
```
> what did obama say about hope
[Results showing relevant transcript segments...]

> how many people were injured
[Results showing relevant transcript segments...]
```

## Search Results Format

Each search result shows:
- 🎥 Source video file
- ⏱️ Timestamp (MM:SS format)
- 💬 Transcript text
- 📊 Relevance score

## Performance Metrics

The tool provides timing breakdowns for searches:
- Embedding time: Converting query to vector
- FAISS search time: Finding similar segments
- Result formatting: Preparing output
- Total processing time

## Notes

- Supports `.mp4` video files
- Uses Whisper's base model (can be configured to small/medium)
- Provides semantic search (meaning-based, not just keyword matching)
- Maintains original video files untouched
