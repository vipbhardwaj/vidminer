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
        // Filter out hidden files and video files
        return !file.startsWith('.') && 
               (file.toLowerCase().endsWith('.mp4') || 
                file.toLowerCase().endsWith('.avi') ||
                file.toLowerCase().endsWith('.mov') ||
                file.toLowerCase().endsWith('.mkv'));
      })
      .map(file => {
        const filePath = path.join(videosDir, file);
        const stats = fs.statSync(filePath);
        
        // Extract original name from timestamp_filename format
        let title = file;
        if (file.includes('_')) {
          const parts = file.split('_');
          if (parts.length > 1) {
            // Remove timestamp and get original name
            title = parts.slice(1).join('_').replace(/\.[^/.]+$/, "");
          }
        } else {
          title = file.replace(/\.[^/.]+$/, ""); // Remove extension
        }
        
        return {
          id: Buffer.from(file).toString('base64'),
          title: title,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
          // For now, we'll consider all existing videos as completed
          status: 'completed' as const
        };
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()); // Sort by newest first
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