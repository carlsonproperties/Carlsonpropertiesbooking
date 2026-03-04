import React from 'react';

/**
 * Simple Image Test - No dependencies, pure diagnostic
 */
export function SimpleImageTest() {
  const [testResults, setTestResults] = React.useState<any[]>([]);

  const testUrls = [
    {
      name: 'Hero Image',
      url: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/029_Open2view_ID584542-111_Jarden_Mile.jpg'
    },
    {
      name: 'Pool View',
      url: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/poolview.jpg'
    },
    {
      name: 'Street Facing',
      url: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/Street%20facing.jpg'
    },
    {
      name: 'Logo',
      url: 'https://hxprmevheigajzqehjgf.supabase.co/storage/v1/object/public/Website%20Media/AirBnB_Profile_Photo_9.png'
    }
  ];

  const testImage = async (name: string, url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        name,
        url,
        status: response.status,
        ok: response.ok,
        message: response.ok ? '✅ File exists and is accessible' : `❌ Error ${response.status}`
      };
    } catch (error) {
      return {
        name,
        url,
        status: 'ERROR',
        ok: false,
        message: `❌ Network error: ${error}`
      };
    }
  };

  const runTests = async () => {
    setTestResults([]);
    const results = [];
    for (const test of testUrls) {
      const result = await testImage(test.name, test.url);
      results.push(result);
      setTestResults([...results]);
    }
  };

  React.useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>🔍 Supabase Storage Diagnostic</h1>
      
      <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '2px solid #f59e0b' }}>
        <h2 style={{ marginTop: 0 }}>⚠️ 404 Error Detected</h2>
        <p>Your images are returning "Object not found" errors. This means:</p>
        <ol>
          <li><strong>Files haven't been uploaded to Supabase Storage</strong> (most likely)</li>
          <li>The "Website Media" bucket doesn't exist</li>
          <li>Filenames don't match exactly</li>
        </ol>
      </div>

      <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '2px solid #3b82f6' }}>
        <h3 style={{ marginTop: 0 }}>📋 Required Steps:</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Go to Supabase Storage:</strong>{' '}
            <a 
              href="https://supabase.com/dashboard/project/hxprmevheigajzqehjgf/storage/buckets" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'underline' }}
            >
              Open Supabase Dashboard →
            </a>
          </li>
          <li><strong>Check if "Website Media" bucket exists</strong> - If not, create it</li>
          <li><strong>Make the bucket PUBLIC</strong> - Click ⋮ menu → "Make bucket public"</li>
          <li><strong>Upload your images</strong> - Drag and drop all property photos into the bucket</li>
          <li><strong>Verify filenames match exactly</strong> - Check the test results below</li>
        </ol>
      </div>

      <h2>Test Results:</h2>
      
      {testResults.length === 0 ? (
        <div style={{ padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
          <p>Testing images...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {testResults.map((result, idx) => (
            <div 
              key={idx}
              style={{ 
                padding: '20px', 
                background: result.ok ? '#d1fae5' : '#fee2e2', 
                borderRadius: '8px',
                border: `2px solid ${result.ok ? '#10b981' : '#ef4444'}`
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>
                {result.ok ? '✅' : '❌'} {result.name}
              </h3>
              <p style={{ margin: '5px 0' }}>
                <strong>Status:</strong> {result.status}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Message:</strong> {result.message}
              </p>
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Show URL</summary>
                <code style={{ 
                  display: 'block', 
                  background: 'white', 
                  padding: '10px', 
                  borderRadius: '4px',
                  marginTop: '10px',
                  wordBreak: 'break-all',
                  fontSize: '12px'
                }}>
                  {result.url}
                </code>
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'underline', fontSize: '14px' }}
                >
                  Test URL in new tab →
                </a>
              </details>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h3>📸 Next Steps:</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>If all tests show ❌ - Your bucket is either private or empty</li>
          <li>If some tests show ✅ - Check filenames for the failing ones</li>
          <li>After making changes in Supabase, click the button below to re-test</li>
        </ul>
        <button 
          onClick={runTests}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          🔄 Re-test All Images
        </button>
      </div>
    </div>
  );
}
