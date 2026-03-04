import React from 'react';
import { HOME_IMAGES, GALLERY_IMAGES, BEDROOM_IMAGES, DRONE_VIDEO, LOGO_IMAGE } from '../lib/images';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/**
 * Image Test Page
 * 
 * Diagnostic page to verify all Supabase Storage images are loading correctly.
 * Navigate to /image-test to use this tool.
 */
export function ImageTest() {
  const [results, setResults] = React.useState<Record<string, 'success' | 'error' | 'loading'>>({});

  const testImages = {
    'Logo': LOGO_IMAGE,
    'Home - Hero': HOME_IMAGES.hero,
    'Home - Wellness': HOME_IMAGES.wellness,
    'Gallery - Hero': GALLERY_IMAGES.hero,
    'Gallery - Kitchen': GALLERY_IMAGES.kitchen,
    'Gallery - Pool': GALLERY_IMAGES.pool,
    'Gallery - Living': GALLERY_IMAGES.livingRoom,
    'Gallery - Exterior': GALLERY_IMAGES.exterior,
    'Gallery - Sauna': GALLERY_IMAGES.sauna,
    'Gallery - BBQ': GALLERY_IMAGES.bbq,
    'Bedroom 1': BEDROOM_IMAGES.bedroom1,
    'Ensuite 1': BEDROOM_IMAGES.ensuite1,
  };

  const handleImageLoad = (key: string) => {
    console.log(`✅ ${key} loaded successfully`);
    setResults(prev => ({ ...prev, [key]: 'success' }));
  };

  const handleImageError = (key: string, url: string) => {
    console.error(`❌ ${key} failed to load:`, url);
    setResults(prev => ({ ...prev, [key]: 'error' }));
  };

  React.useEffect(() => {
    // Initialize all as loading
    const initial: Record<string, 'loading'> = {};
    Object.keys(testImages).forEach(key => {
      initial[key] = 'loading';
    });
    setResults(initial);
  }, []);

  const successCount = Object.values(results).filter(r => r === 'success').length;
  const errorCount = Object.values(results).filter(r => r === 'error').length;
  const totalCount = Object.keys(testImages).length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">🧪 Supabase Storage Image Test</h1>
          <p className="text-slate-600 mb-6">
            Testing all images from the "Website Media" bucket to verify they load correctly.
          </p>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-800 font-medium">Total Images</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-green-800 font-medium">Loaded ✅</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-red-800 font-medium">Failed ❌</div>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          {errorCount > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 mt-1" size={20} />
                <div>
                  <h3 className="font-bold text-yellow-900 mb-2">⚠️ {errorCount} Image{errorCount > 1 ? 's' : ''} Failed to Load</h3>
                  <p className="text-sm text-yellow-800 mb-3">The most common issue is that your Supabase Storage bucket is PRIVATE.</p>
                  <div className="bg-yellow-100 rounded-lg p-4 space-y-2">
                    <p className="font-bold text-yellow-900 text-sm">🔧 Quick Fix (60 seconds):</p>
                    <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                      <li>Go to <a href="https://supabase.com/dashboard/project/hxprmevheigajzqehjgf/storage/buckets" target="_blank" rel="noopener noreferrer" className="underline font-medium">Supabase Storage Dashboard</a></li>
                      <li>Find the <strong>"Website Media"</strong> bucket</li>
                      <li>Click the <strong>⋮</strong> (three dots) menu next to it</li>
                      <li>Select <strong>"Make bucket public"</strong></li>
                      <li>Confirm the action</li>
                      <li>Refresh this page - all images should load! ✨</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successCount === totalCount && totalCount > 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 mt-1" size={20} />
                <div>
                  <h3 className="font-bold text-green-900 mb-2">🎉 All Images Loading Successfully!</h3>
                  <p className="text-sm text-green-800">Your Supabase Storage is configured correctly. All {totalCount} images are accessible.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(testImages).map(([key, url]) => {
            const status = results[key] || 'loading';
            
            return (
              <div key={key} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative aspect-video bg-slate-100">
                  <img
                    src={url}
                    alt={key}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(key)}
                    onError={() => handleImageError(key, url)}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {status === 'loading' && (
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading
                      </div>
                    )}
                    {status === 'success' && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle size={14} />
                        OK
                      </div>
                    )}
                    {status === 'error' && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <XCircle size={14} />
                        Failed
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-2">{key}</h3>
                  <code className="text-xs text-slate-500 break-all block bg-slate-50 p-2 rounded">
                    {url}
                  </code>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Test */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-slate-800 text-white">
            <h3 className="font-bold">🎥 Drone Video Test</h3>
          </div>
          <div className="p-4">
            <video
              src={DRONE_VIDEO}
              controls
              className="w-full rounded-lg"
              onLoadedData={() => console.log('✅ Video loaded successfully')}
              onError={(e) => console.error('❌ Video failed to load:', DRONE_VIDEO)}
            />
            <code className="text-xs text-slate-500 block mt-2 bg-slate-50 p-2 rounded break-all">
              {DRONE_VIDEO}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}