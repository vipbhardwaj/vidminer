# VidMiner Deployment Guide for Render.com

This guide will help you deploy your VidMiner application to Render.com with both the Next.js frontend and Python backend.

## 🚀 Quick Start

### 1. Prepare Your Repository

Make sure your repository has the following structure:
```
vidminer/
├── frontend/          # Next.js frontend
├── src/              # Python backend source
├── videos/           # Video storage directory
├── processed/        # Processed data storage
├── requirements.txt  # Python dependencies
├── server.py         # Flask server
├── render.yaml       # Render configuration
├── Dockerfile        # Backend container
└── DEPLOYMENT.md     # This file
```

### 2. Deploy to Render.com

#### Option A: Using render.yaml (Recommended)

1. **Connect your GitHub repository** to Render.com
2. **Create a new Blueprint** in Render dashboard
3. **Upload your render.yaml** file or paste its contents
4. **Deploy automatically** - Render will create all services

#### Option B: Manual Deployment

**Backend Service:**
1. Create a new **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `vidminer-backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python server.py`
   - **Health Check Path**: `/health`

**Frontend Service:**
1. Create another **Web Service**
2. Configure:
   - **Name**: `vidminer-frontend`
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Health Check Path**: `/`

### 3. Environment Variables

Set these in your Render dashboard:

**Backend Environment Variables:**
```
PYTHON_VERSION=3.11
OPENAI_API_KEY=your_openai_api_key_here
```

**Frontend Environment Variables:**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
```

### 4. Storage Configuration

#### For Video Storage:
- **Local Storage**: Videos are stored in the `/videos` directory
- **Persistent Storage**: Consider using Render's persistent disk for production
- **External Storage**: For production, consider using AWS S3 or similar

#### For Processed Data:
- **Transcriptions**: Stored in `/processed/transcriptions/`
- **Embeddings**: Stored in `/processed/embeddings/`
- **Indices**: Stored in `/processed/indices/`

## 🔧 Configuration Details

### Backend API Endpoints

Your Flask server provides these endpoints:

- `GET /health` - Health check
- `GET /api/videos` - List all videos
- `GET /api/videos/<video_id>` - Serve video file
- `POST /api/upload` - Upload new video
- `POST /api/transcribe/<video_id>` - Transcribe video
- `POST /api/embed/<video_id>` - Create embeddings
- `POST /api/search` - Search videos
- `GET /api/dashboard` - Dashboard data

### Frontend Configuration

The frontend automatically detects the backend URL:
- **Development**: Uses `http://localhost:5000`
- **Production**: Uses `NEXT_PUBLIC_API_URL` environment variable

## 📁 Directory Structure

```
vidminer/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── next.config.js
├── src/                     # Python backend
│   ├── transcribe.py        # Video transcription
│   ├── embed.py            # Embedding generation
│   ├── query.py            # Search functionality
│   └── utils.py            # Utility functions
├── videos/                  # Video storage
├── processed/               # Processed data
│   ├── transcriptions/      # Video transcriptions
│   ├── embeddings/          # Video embeddings
│   └── indices/            # Search indices
├── server.py               # Flask server
├── requirements.txt         # Python dependencies
├── render.yaml             # Render configuration
└── Dockerfile              # Backend container
```

## 🔍 Monitoring and Logs

### Health Checks
- **Backend**: `https://your-backend.onrender.com/health`
- **Frontend**: `https://your-frontend.onrender.com/`

### Logs
Access logs in Render dashboard:
1. Go to your service
2. Click on "Logs" tab
3. Monitor application logs and errors

## 🚨 Troubleshooting

### Common Issues:

1. **Backend not starting:**
   - Check if all dependencies are installed
   - Verify Python version (3.11)
   - Check logs for import errors

2. **Frontend can't connect to backend:**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check CORS configuration
   - Ensure backend is running

3. **Video uploads failing:**
   - Check disk space
   - Verify file permissions
   - Check video format support

4. **Transcription not working:**
   - Verify OpenAI API key is set
   - Check if ffmpeg is installed
   - Monitor memory usage

### Performance Tips:

1. **Use persistent disk** for video storage
2. **Implement video compression** for large files
3. **Add caching** for frequently accessed data
4. **Monitor resource usage** in Render dashboard

## 🔐 Security Considerations

1. **API Keys**: Store sensitive keys as environment variables
2. **File Uploads**: Validate file types and sizes
3. **CORS**: Configure CORS properly for production
4. **Rate Limiting**: Consider adding rate limiting for API endpoints

## 📈 Scaling

For production use:
1. **Upgrade to paid plans** for better performance
2. **Use persistent disk** for data storage
3. **Implement caching** with Redis
4. **Add CDN** for video delivery
5. **Monitor usage** and scale accordingly

## 🎯 Next Steps

After deployment:
1. **Test all functionality** - upload, transcribe, search
2. **Monitor performance** - check logs and metrics
3. **Set up monitoring** - alerts for errors
4. **Configure backups** - for important data
5. **Set up CI/CD** - for automatic deployments

Your VidMiner application should now be live and accessible on the internet! 🎉 