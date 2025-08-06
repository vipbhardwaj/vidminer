# VidMiner Deployment Guide

Deploy your VidMiner application with Frontend on Vercel and Backend on Railway (both free tiers).

## 🚀 Architecture

- **Frontend**: Next.js → Vercel (Free)
- **Backend**: FastAPI + ML Models → Railway (Free)

## 📋 Prerequisites

1. GitHub repository with your code
2. [Vercel CLI](https://vercel.com/cli) installed: `npm i -g vercel`
3. [Railway CLI](https://docs.railway.app/develop/cli) installed: `npm i -g @railway/cli`
4. Vercel and Railway accounts (both free, no credit card required)

## 🔧 Backend Deployment (Railway)

### 1. Setup Railway

```bash
# Login to Railway
railway login

# Link to your project (from project root)
railway link

# Or create a new project
railway init
```

### 2. Deploy Backend

```bash
# Deploy to Railway
railway up

# Check deployment status
railway status

# View logs
railway logs
```

Your backend will be available at: `https://your-app-name.up.railway.app`

### 3. Test Backend

```bash
curl https://your-app-name.up.railway.app/
```

## 🎨 Frontend Deployment (Vercel)

### 1. Setup Environment Variables

In your Vercel dashboard or using CLI, set:

```bash
# Set backend URL
vercel env add NEXT_PUBLIC_BACKEND_URL production
# Enter: https://your-app-name.up.railway.app
```

### 2. Deploy Frontend

```bash
# Navigate to frontend directory
cd frontend

# Deploy to Vercel
vercel --prod

# Or deploy from root
vercel frontend --prod
```

Your frontend will be available at: `https://your-project.vercel.app`

## 🔄 Update CORS (Important!)

After getting your Vercel domain, update the backend CORS settings:

1. Edit `src/app.py`:
```python
allow_origins=[
    "http://localhost:3000",  # Local development
    "https://*.vercel.app",  # Vercel deployments
    "https://your-project.vercel.app",  # Your actual domain
],
```

2. Redeploy backend:
```bash
railway up
```

## 🧪 Testing the Full Stack

1. **Test backend health**: `https://your-app-name.up.railway.app/`
2. **Test frontend**: `https://your-project.vercel.app`
3. **Test search functionality**: Upload a video and try searching

## 📊 Free Tier Limitations

### Railway (Backend)
- **Compute**: 512MB RAM, 1 vCPU
- **Storage**: 1GB persistent storage
- **Bandwidth**: Unlimited
- **Sleep**: Apps sleep after 30min inactivity, wake on request
- **Build Time**: 500 hours/month

### Vercel (Frontend)
- **Bandwidth**: 100GB/month
- **Function Execution**: 100GB-Hrs/month
- **Builds**: Unlimited
- **No sleep**: Always available

## 🛠️ Local Development

```bash
# Start backend (from project root)
cd src && python app.py

# Start frontend (new terminal)
cd frontend && npm run dev
```

## 🔍 Troubleshooting

### Backend Issues
```bash
# Check logs
railway logs

# Connect to shell
railway shell

# Check resource usage
railway status
```

### Frontend Issues
```bash
# Check build logs
vercel logs

# Local debug
cd frontend && npm run build
```

### CORS Issues
- Ensure your Vercel domain is added to CORS origins
- Check browser developer tools for exact error messages

## 📝 Environment Variables

### Frontend (Vercel)
- `NEXT_PUBLIC_BACKEND_URL`: Your Railway app URL

### Backend (Railway)
- Set in Railway dashboard or CLI
- Add secrets: `railway variables set KEY=value`

## 🚀 Automatic Deployments

### GitHub Integration

1. **Vercel**: Connects automatically when you deploy
2. **Railway**: Set up GitHub Actions for auto-deploy:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Railway
on: 
  push:
    branches: [main]
    paths: ['src/**', 'requirements.txt', 'railway.json']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @railway/cli
      - run: railway login --browserless
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      - run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

Add `RAILWAY_TOKEN` to your GitHub repository secrets.

## 💡 Production Tips

1. **Monitor costs**: Both platforms have usage dashboards
2. **Optimize cold starts**: Keep your app warm with health checks
3. **Use environment variables**: Never commit API keys
4. **Monitor logs**: Set up alerts for errors
5. **Backup data**: Export your video indices regularly

## 🆘 Support

- **Railway**: [Discord Community](https://discord.gg/railway) & [Documentation](https://docs.railway.app)
- **Vercel**: [Documentation](https://vercel.com/docs) & [Discord](https://vercel.com/discord)
- **VidMiner**: Create an issue in your GitHub repository