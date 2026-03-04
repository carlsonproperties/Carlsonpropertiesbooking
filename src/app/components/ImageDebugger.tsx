import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

interface ImageDebuggerProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * ImageDebugger Component
 * 
 * A diagnostic wrapper for images that shows loading state and errors.
 * Helps debug Supabase Storage bucket permission issues.
 */
export function ImageDebugger({ src, alt, className = '' }: ImageDebuggerProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorDetails, setErrorDetails] = useState<string>('');

  const handleLoad = () => {
    console.log('✅ Image loaded:', src);
    setStatus('success');
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Image failed to load:', src);
    setStatus('error');
    setErrorDetails(`Failed to load: ${src}`);
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Loading/Error Overlay - Only visible during development */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <Loader className="animate-spin" size={16} />
            <span className="text-xs font-bold">Loading...</span>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-red-500 text-white p-4 rounded-lg max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <XCircle size={20} />
              <span className="font-bold">Image Load Failed</span>
            </div>
            <p className="text-xs opacity-90 mb-2">Check Supabase Storage bucket permissions</p>
            <code className="text-xs bg-black/20 p-2 rounded block overflow-x-auto">
              {src}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
