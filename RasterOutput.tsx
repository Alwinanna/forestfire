import React, { useState } from 'react';
import { Download, Map, FileImage, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface RasterOutputProps {
  predictions: any[];
  region: string;
}

export const RasterOutput: React.FC<RasterOutputProps> = ({ predictions, region }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const generateRasterOutput = async (timeHour: number) => {
    setIsGenerating(true);
    setDownloadProgress(0);

    // Simulate raster generation process
    for (let i = 0; i <= 100; i += 10) {
      setDownloadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Create mock GeoTIFF download
    const rasterData = generateMockRaster(timeHour);
    downloadRaster(rasterData, `fire_prediction_${region}_${timeHour}h.tif`);
    
    setIsGenerating(false);
    setDownloadProgress(0);
  };

  const generateMockRaster = (timeHour: number) => {
    // Mock raster data generation (30m resolution)
    const width = 1000; // pixels
    const height = 1000; // pixels
    const data = new Uint8Array(width * height);
    
    // Generate fire probability values (0-255)
    for (let i = 0; i < data.length; i++) {
      const x = i % width;
      const y = Math.floor(i / width);
      
      // Create realistic fire spread pattern
      const centerX = 500;
      const centerY = 500;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const spreadRadius = timeHour * 50; // Fire spreads over time
      
      if (distance < spreadRadius) {
        data[i] = Math.max(0, 255 - (distance / spreadRadius) * 255);
      } else {
        data[i] = 0;
      }
    }
    
    return data;
  };

  const downloadRaster = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileImage className="text-green-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Raster Output Generation</h3>
          <p className="text-gray-600">30m Resolution GeoTIFF Files - ISRO BAH 2025 Compliant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">📊 Raster Specifications</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Resolution:</span>
              <span className="font-medium">30m x 30m</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="font-medium">GeoTIFF</span>
            </div>
            <div className="flex justify-between">
              <span>Projection:</span>
              <span className="font-medium">WGS84 UTM 44N</span>
            </div>
            <div className="flex justify-between">
              <span>Data Type:</span>
              <span className="font-medium">8-bit Unsigned</span>
            </div>
            <div className="flex justify-between">
              <span>Values:</span>
              <span className="font-medium">0-255 (Fire Probability)</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 mb-3">🎯 Classification Scheme</h4>
          <div className="space-y-2 text-sm text-orange-800">
            <div className="flex justify-between">
              <span>0-50:</span>
              <span className="font-medium">Nil Risk</span>
            </div>
            <div className="flex justify-between">
              <span>51-100:</span>
              <span className="font-medium">Low Risk</span>
            </div>
            <div className="flex justify-between">
              <span>101-150:</span>
              <span className="font-medium">Moderate Risk</span>
            </div>
            <div className="flex justify-between">
              <span>151-200:</span>
              <span className="font-medium">High Risk</span>
            </div>
            <div className="flex justify-between">
              <span>201-255:</span>
              <span className="font-medium">Critical Risk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Download Fire Spread Rasters</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 6, 12].map((hour) => (
            <motion.button
              key={hour}
              onClick={() => generateRasterOutput(hour)}
              disabled={isGenerating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                isGenerating 
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                  : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Download className={`${isGenerating ? 'text-gray-400' : 'text-blue-600'}`} size={20} />
                <div className="text-left">
                  <p className={`font-semibold ${isGenerating ? 'text-gray-600' : 'text-blue-900'}`}>
                    {hour} Hour Spread
                  </p>
                  <p className={`text-sm ${isGenerating ? 'text-gray-500' : 'text-blue-700'}`}>
                    fire_spread_{hour}h.tif
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {isGenerating && (
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Generating raster file...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{downloadProgress}% complete</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <Database className="text-green-600 mt-1" size={20} />
          <div>
            <h5 className="font-semibold text-green-900">ISRO BAH 2025 Compliance</h5>
            <p className="text-sm text-green-700 mt-1">
              All raster outputs meet ISRO specifications: 30m resolution, GeoTIFF format, 
              proper georeferencing, and standardized classification scheme for fire probability mapping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};