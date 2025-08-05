import { NextResponse } from 'next/server';

// GET handler for dashboard data
export async function GET() {
  try {
    // Mock data for now - in production this would come from the backend
    const videos = [
      {
        id: '1',
        title: 'Sample Video',
        size: 1024000,
        uploadedAt: new Date().toISOString(),
        status: 'completed' as const,
      }
    ];

    const stats = {
      totalVideos: videos.length,
      totalDuration: 0,
      processingVideos: 0,
      completedVideos: videos.length,
    };

    const mockSearches = [
      {
        id: '1',
        query: 'machine learning',
        timestamp: new Date().toISOString(),
        resultCount: 5,
      },
    ];

    const recentActivity = videos.map(video => ({
      id: video.id,
      type: 'upload' as const,
      description: `Video "${video.title}" uploaded`,
      timestamp: video.uploadedAt,
      status: video.status,
    }));

    const dashboardData = {
      stats,
      recentVideos: videos.map(video => ({
        ...video,
        duration: 0, // We'll need additional libraries to get actual duration
        thumbnailUrl: undefined, // We'll need to generate thumbnails
      })),
      recentSearches: mockSearches,
      recentActivity,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

// POST handler for updating dashboard preferences (if needed)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Implement dashboard preferences update logic
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Dashboard preferences update error:', error);
    return NextResponse.json(
      { error: 'Failed to update dashboard preferences' },
      { status: 500 }
    );
  }
} 