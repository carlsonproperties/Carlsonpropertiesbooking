import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface DiagnosticImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  showDebug?: boolean; // Show diagnostic overlay
}

/**
 * DiagnosticImage Component
 * 
 * Wrapper around <img> that shows loading/error states for debugging.
 * Use this temporarily to diagnose which images are failing.
 * 
 * Set showDebug={true} to see visual indicators (remove in production).
 */
export function DiagnosticImage({ 
  src, 
  alt, 
  className = '', 
  showDebug = false,
  ...props 
}: DiagnosticImageProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoad = () => {
    console.log('✅ Image loaded:', src);
    setStatus('success');
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const error = `Failed to load: ${src}`;
    console.error('❌', error);
    setErrorMsg(error);
    setStatus('error');
    
    // Log detailed diagnosis
    console.group('🔍 Image Load Failure Diagnosis');
    console.log('URL:', src);
    console.log('Alt Text:', alt);
    console.log('Possible causes:');
    console.log('  1. Supabase bucket "Website Media" is PRIVATE (most common)');
    console.log('  2. File does not exist in Supabase Storage');
    console.log('  3. Filename mismatch (check case sensitivity)');
    console.log('  4. Network/CORS issue');
    console.log('\n💡 Solution: Make bucket public in Supabase Dashboard');
    console.groupEnd();
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Debug Overlay - Only visible when showDebug={true} */}
      {showDebug && (
        <>
          {status === 'loading' && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-lg">
              <Loader2 size={12} className="animate-spin" />
              Loading...
            </div>
          )}
          
          {status === 'success' && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-lg opacity-0 hover:opacity-100 transition-opacity">
              <CheckCircle size={12} />
              OK
            </div>
          )}
          
          {status === 'error' && (
            <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-4 max-w-sm text-center">
                <AlertCircle className="text-red-500 mx-auto mb-2" size={32} />
                <h3 className="font-bold text-red-900 mb-2">Image Failed to Load</h3>
                <p className="text-xs text-red-700 mb-3 break-all">{src}</p>
                <div className="text-xs text-left space-y-1 bg-red-50 p-2 rounded">
                  <p className="font-bold">Possible fixes:</p>
                  <p>1. Make "Website Media" bucket PUBLIC</p>
                  <p>2. Check if file exists in Storage</p>
                  <p>3. Verify filename is correct</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
