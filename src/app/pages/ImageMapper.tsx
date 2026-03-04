import React, { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function ImageMapper() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapping, setMapping] = useState<any>({});

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-edef7798/list-storage-images`,
          {
            headers: { Authorization: `Bearer ${publicAnonKey}` }
          }
        );
        const data = await res.json();
        setImages(data.files || []);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const categories = {
    "Homepage": ["hero", "wellness"],
    "Gallery": ["kitchen", "pool", "living-room", "exterior", "sauna", "bbq"],
    "Bedrooms": ["bedroom-1", "bedroom-2", "bedroom-3", "bedroom-4", "bedroom-5"],
    "Bathrooms": ["ensuite-1", "ensuite-2", "ensuite-3", "main-bathroom"],
    "Family": ["family-group", "family-outdoor", "family-kids", "family-highfive", "family-playing"],
    "Logo": ["logo"]
  };

  const handleMap = (category: string, type: string, filename: string) => {
    setMapping({
      ...mapping,
      [`${category}-${type}`]: filename
    });
  };

  const generateCode = () => {
    let code = `// Update /src/app/lib/images.ts with these filenames:\n\n`;
    
    code += `export const HOME_IMAGES = {\n`;
    code += `  hero: getImageUrl("${mapping['Homepage-hero'] || 'hero-main.jpg'}"),\n`;
    code += `  wellness: getImageUrl("${mapping['Homepage-wellness'] || 'hero-wellness.jpg'}"),\n`;
    code += `};\n\n`;

    code += `export const GALLERY_IMAGES = {\n`;
    code += `  hero: getImageUrl("${mapping['Gallery-exterior'] || 'gallery-exterior.jpg'}"),\n`;
    code += `  kitchen: getImageUrl("${mapping['Gallery-kitchen'] || 'gallery-kitchen.jpg'}"),\n`;
    code += `  pool: getImageUrl("${mapping['Gallery-pool'] || 'gallery-pool.jpg'}"),\n`;
    code += `  livingRoom: getImageUrl("${mapping['Gallery-living-room'] || 'gallery-living-room.jpg'}"),\n`;
    code += `  exterior: getImageUrl("${mapping['Gallery-exterior'] || 'gallery-exterior-night.jpg'}"),\n`;
    code += `  sauna: getImageUrl("${mapping['Gallery-sauna'] || 'gallery-sauna.jpg'}"),\n`;
    code += `  bbq: getImageUrl("${mapping['Gallery-bbq'] || 'gallery-bbq.jpg'}"),\n`;
    code += `};\n\n`;

    code += `export const BEDROOM_IMAGES = {\n`;
    code += `  bedroom1: getImageUrl("${mapping['Bedrooms-bedroom-1'] || 'bedroom-1.jpg'}"),\n`;
    code += `  ensuite1: getImageUrl("${mapping['Bathrooms-ensuite-1'] || 'ensuite-1.jpg'}"),\n`;
    code += `  bedroom2: getImageUrl("${mapping['Bedrooms-bedroom-2'] || 'bedroom-2.jpg'}"),\n`;
    code += `  ensuite2: getImageUrl("${mapping['Bathrooms-ensuite-2'] || 'ensuite-2.jpg'}"),\n`;
    code += `  bedroom3: getImageUrl("${mapping['Bedrooms-bedroom-3'] || 'bedroom-3.jpg'}"),\n`;
    code += `  ensuite3: getImageUrl("${mapping['Bathrooms-ensuite-3'] || 'ensuite-3.jpg'}"),\n`;
    code += `  bedroom4: getImageUrl("${mapping['Bedrooms-bedroom-4'] || 'bedroom-4.jpg'}"),\n`;
    code += `  bedroom5: getImageUrl("${mapping['Bedrooms-bedroom-5'] || 'bedroom-5.jpg'}"),\n`;
    code += `  mainBathroom: getImageUrl("${mapping['Bathrooms-main-bathroom'] || 'main-bathroom.jpg'}"),\n`;
    code += `};\n\n`;

    code += `export const FAMILY_IMAGES = {\n`;
    code += `  group: getImageUrl("${mapping['Family-family-group'] || 'family-group.jpg'}"),\n`;
    code += `  outdoor: getImageUrl("${mapping['Family-family-outdoor'] || 'family-outdoor.jpg'}"),\n`;
    code += `  kids: getImageUrl("${mapping['Family-family-kids'] || 'family-kids.jpg'}"),\n`;
    code += `  highFive: getImageUrl("${mapping['Family-family-highfive'] || 'family-highfive.jpg'}"),\n`;
    code += `  playing: getImageUrl("${mapping['Family-family-playing'] || 'family-playing.jpg'}"),\n`;
    code += `};\n\n`;

    code += `export const LOGO_IMAGE = getImageUrl("${mapping['Logo-logo'] || 'logo.png'}");`;

    return code;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9DA07E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your images from Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-serif mb-2">Image Mapper</h1>
          <p className="text-gray-600 mb-6">
            Found {images.length} images in your Supabase Storage. Map them to your website locations below.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <p className="text-yellow-800 font-medium mb-2">No images found!</p>
            <p className="text-yellow-700 text-sm">
              Make sure you've created a bucket called "property-images" and uploaded your photos.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 mb-8">
              {Object.entries(categories).map(([category, types]) => (
                <div key={category} className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-serif mb-6 text-[#9DA07E]">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {types.map((type) => (
                      <div key={type} className="border border-gray-200 rounded-xl p-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                          {type.replace(/-/g, ' ')}
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                          value={mapping[`${category}-${type}`] || ""}
                          onChange={(e) => handleMap(category, type, e.target.value)}
                        >
                          <option value="">Select an image...</option>
                          {images.map((img) => (
                            <option key={img.name} value={img.name}>
                              {img.name}
                            </option>
                          ))}
                        </select>
                        {mapping[`${category}-${type}`] && (
                          <div className="mt-3">
                            <img
                              src={images.find(i => i.name === mapping[`${category}-${type}`])?.url}
                              alt={type}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 text-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-serif mb-4">Generated Code</h2>
              <p className="text-gray-400 text-sm mb-4">
                Copy this code and I'll update your images.ts file for you:
              </p>
              <pre className="bg-black rounded-xl p-6 overflow-x-auto text-xs">
                <code>{generateCode()}</code>
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateCode());
                  alert("Code copied to clipboard!");
                }}
                className="mt-4 bg-[#9DA07E] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#8A8D6D] transition-colors"
              >
                Copy Code to Clipboard
              </button>
            </div>
          </>
        )}

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-serif mb-4">Your Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.name} className="border border-gray-200 rounded-lg p-3">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-xs text-gray-600 truncate">{img.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
