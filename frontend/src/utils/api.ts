// API utility functions for making requests to the backend

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Dashboard data types
export interface DashboardData {
  stats: {
    totalVideos: number;
    totalDuration: number;
    processingVideos: number;
    completedVideos: number;
  };
  recentVideos: Array<{
    id: string;
    title: string;
    duration: number;
    uploadedAt: string;
    status: 'processing' | 'completed' | 'failed';
    thumbnailUrl?: string;
  }>;
  recentSearches: Array<{
    id: string;
    query: string;
    timestamp: string;
    resultCount: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'upload' | 'transcription' | 'search';
    description: string;
    timestamp: string;
    status?: string;
  }>;
}

// Dashboard API functions
export async function fetchDashboardData(): Promise<ApiResponse<DashboardData>> {
  return fetchApi<DashboardData>('/api/dashboard');
}

// Dashboard preferences update function
export async function updateDashboardPreferences(
  preferences: Record<string, unknown>
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi<{ success: boolean }>('/api/dashboard', {
    method: 'POST',
    body: JSON.stringify(preferences),
  });
} 