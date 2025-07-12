import fs from 'fs';
import path from 'path';

interface VideoFileInfo {
  id: string;
  title: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
}

export function getVideosInfo(): VideoFileInfo[] {
  const videosDir = path.join(process.cwd(), '..', 'videos');
  
  try {
    const files = fs.readdirSync(videosDir);
    
    return files
      .filter(file => {
        // Filter out hidden files and non-video files
        return !file.startsWith('.') && 
               file.toLowerCase().endsWith('.mp4');
      })
      .map(file => {
        const filePath = path.join(videosDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          id: Buffer.from(file).toString('base64'),
          title: file.replace(/\.[^/.]+$/, ""), // Remove extension
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
          // For now, we'll consider all existing videos as completed
          status: 'completed' as const
        };
      });
  } catch (error) {
    console.error('Error reading videos directory:', error);
    return [];
  }
}

export function getVideoStats() {
  const videos = getVideosInfo();
  
  return {
    totalVideos: videos.length,
    totalDuration: 0, // We'll need additional libraries to get actual duration
    processingVideos: videos.filter(v => v.status === 'processing').length,
    completedVideos: videos.filter(v => v.status === 'completed').length
  };
} 