#!/usr/bin/env python3
"""
VidMiner Backend Server
Handles video processing, transcription, and search functionality
"""

import os
import sys
import json
import logging
from pathlib import Path
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import tempfile
import shutil

# Add src to path for imports
sys.path.append(str(Path(__file__).parent / 'src'))

from transcribe import transcribe_video
from embed import embed_video
from query import search_videos
from utils import get_video_info, get_video_stats

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
UPLOAD_FOLDER = Path('videos')
PROCESSED_FOLDER = Path('processed')
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}

# Ensure directories exist
UPLOAD_FOLDER.mkdir(exist_ok=True)
PROCESSED_FOLDER.mkdir(exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health')
def health_check():
    """Health check endpoint for Render"""
    return jsonify({'status': 'healthy', 'service': 'vidminer-backend'})

@app.route('/api/videos', methods=['GET'])
def get_videos():
    """Get list of all videos with their metadata"""
    try:
        videos = get_video_info()
        return jsonify({'videos': videos})
    except Exception as e:
        logger.error(f"Error getting videos: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/videos/<video_id>', methods=['GET'])
def get_video(video_id):
    """Serve video file"""
    try:
        # Decode base64 video ID to get filename
        import base64
        filename = base64.b64decode(video_id).decode('utf-8')
        file_path = UPLOAD_FOLDER / filename
        
        if not file_path.exists():
            return jsonify({'error': 'Video not found'}), 404
            
        return send_file(file_path, mimetype='video/mp4')
    except Exception as e:
        logger.error(f"Error serving video {video_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_video():
    """Upload a new video file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
            
        # Save file with timestamp
        import time
        timestamp = int(time.time() * 1000)
        filename = f"{timestamp}_{secure_filename(file.filename)}"
        file_path = UPLOAD_FOLDER / filename
        
        file.save(file_path)
        
        # Start processing in background
        try:
            # Transcribe video
            transcribe_video(str(file_path))
            
            # Create embeddings
            embed_video(str(file_path))
            
        except Exception as e:
            logger.error(f"Error processing video {filename}: {e}")
            # Continue anyway - video is uploaded
        
        return jsonify({
            'success': True,
            'filename': filename,
            'originalName': file.filename,
            'size': file_path.stat().st_size,
            'uploadedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ')
        })
        
    except Exception as e:
        logger.error(f"Error uploading video: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/transcribe/<video_id>', methods=['POST'])
def transcribe_video_endpoint(video_id):
    """Transcribe a specific video"""
    try:
        import base64
        filename = base64.b64decode(video_id).decode('utf-8')
        file_path = UPLOAD_FOLDER / filename
        
        if not file_path.exists():
            return jsonify({'error': 'Video not found'}), 404
            
        # Run transcription
        transcribe_video(str(file_path))
        
        return jsonify({'success': True, 'message': 'Transcription completed'})
        
    except Exception as e:
        logger.error(f"Error transcribing video {video_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/embed/<video_id>', methods=['POST'])
def embed_video_endpoint(video_id):
    """Create embeddings for a specific video"""
    try:
        import base64
        filename = base64.b64decode(video_id).decode('utf-8')
        file_path = UPLOAD_FOLDER / filename
        
        if not file_path.exists():
            return jsonify({'error': 'Video not found'}), 404
            
        # Create embeddings
        embed_video(str(file_path))
        
        return jsonify({'success': True, 'message': 'Embeddings created'})
        
    except Exception as e:
        logger.error(f"Error creating embeddings for video {video_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['POST'])
def search_endpoint():
    """Search through video transcripts"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
            
        # Perform search
        results = search_videos(query)
        
        return jsonify({'results': results})
        
    except Exception as e:
        logger.error(f"Error searching: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard', methods=['GET'])
def dashboard_data():
    """Get dashboard statistics and recent data"""
    try:
        stats = get_video_stats()
        videos = get_video_info()
        
        # Mock recent searches and activity
        recent_searches = [
            {
                'id': '1',
                'query': 'machine learning',
                'timestamp': '2024-01-15T10:30:00Z',
                'resultCount': 5
            }
        ]
        
        recent_activity = [
            {
                'id': '1',
                'type': 'upload',
                'description': f'Video "{videos[0]["title"]}" uploaded' if videos else 'No videos yet',
                'timestamp': videos[0]['uploadedAt'] if videos else '2024-01-15T10:30:00Z',
                'status': 'completed'
            }
        ]
        
        dashboard_data = {
            'stats': stats,
            'recentVideos': videos[:10],  # Latest 10 videos
            'recentSearches': recent_searches,
            'recentActivity': recent_activity
        }
        
        return jsonify(dashboard_data)
        
    except Exception as e:
        logger.error(f"Error getting dashboard data: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 