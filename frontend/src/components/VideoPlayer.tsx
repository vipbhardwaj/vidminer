'use client';

import { useState, useRef, useEffect } from 'react';

interface Segment {
  id: string;
  start: number;
  end: number;
  text: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  transcript: Segment[];
}

export default function VideoPlayer({ videoUrl, transcript }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null);

  // Update current time and segment
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      const segment = transcript.find(seg => 
        time >= seg.start && time <= seg.end
      );
      
      if (segment && (!currentSegment || segment.id !== currentSegment.id)) {
        setCurrentSegment(segment);
      }
    }
  };

  // Jump to specific timestamp
  const jumpToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  // Format timestamp from seconds to MM:SS
  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full rounded-lg"
          controls
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      {/* Current Segment */}
      {currentSegment && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-gray-900">{currentSegment.text}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatTimestamp(currentSegment.start)} - {formatTimestamp(currentSegment.end)}
          </p>
        </div>
      )}

      {/* Transcript Timeline */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Transcript</h2>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {transcript.map((segment) => (
            <div
              key={segment.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                currentSegment?.id === segment.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => jumpToTimestamp(segment.start)}
            >
              <p className="text-gray-900">{segment.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatTimestamp(segment.start)} - {formatTimestamp(segment.end)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 