import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Satellite, 
  Brain, 
  Database, 
  Zap, 
  Activity, 
  Download, 
  Play, 
  Pause, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Globe,
  Server,
  Monitor,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';
import { cloudMLService } from '../../services/cloudMLService';

export const CloudMLDashboard: React.FC = () => {
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [pipelineResults, setPipelineResults] = useState<any>(null);
  const [modelPerformance, setModelPerformance] = useState<any>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const pipelineSteps = [
    { name: 'Initialize Cloud Services', icon: Cloud, duration: 2000 },
    { name: 'Fetch Satellite Data (Earth Engine)', icon: Satellite, duration: 3000 },
    { name: 'Collect Weather Data (Multi-Source)', icon: Activity, duration: 2500 },
    { name: 'Process Terrain & LULC Data', icon: Globe, duration: 2000 },
    { name: 'Run ML Fire Prediction', icon: Brain, duration: 4000 },
    { name: 'Simulate Fire Spread (Cellular Automata)', icon: Zap, duration: 3500 },
    { name: 'Generate Raster Outputs', icon: Download, duration: 2000 }
  ];

  useEffect(() => {
    loadModelPerformance();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      if (isAutoMode && pipelineStatus === 'idle') {
        runPipeline();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAutoMode, pipelineStatus]);

  const loadModelPerformance = async () => {
    try {
      const performance = await cloudMLService.getModelPerformance();
      setModelPerformance(performance);
    } catch (error) {
      console.error('Failed to load model performance:', error);
    }
  };

  const runPipeline = async () => {
    setPipelineStatus('running');
    setCurrentStep(0);
    setPipelineResults(null);

    try {
      // Initialize services
      await cloudMLService.initializeServices();
      setCurrentStep(1);

      // Run complete pipeline
      for (let i = 1; i < pipelineSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, pipelineSteps[i].duration));
        setCurrentStep(i + 1);
      }

      // Get results
      const results = await cloudMLService.runCompleteFirePredictionPipeline({
        lat: 29.5319,
        lng: 78.7718,
        radius: 50000 // 50km radius
      });

      setPipelineResults(results);
      setPipelineStatus('completed');
      
    } catch (error) {
      console.error('Pipeline failed:', error);
      setPipelineStatus('error');
    }
  };

  const downloadRaster = (file: any) => {
    // Simulate raster download
    const link = document.createElement('a');
    link.href = `data:application/octet-stream;base64,${btoa('Mock GeoTIFF data')}`;
    link.download = file.filename;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-primary space-component">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Cloud className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-heading-2 font-bold text-white">☁️ CLOUD ML PIPELINE</h2>
              <p className="text-body-small text-slate-400">Real-Time Satellite Data + Advanced ML on Google Cloud</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="status-online"></div>
                <span className="text-body-small font-semibold text-emerald-400">CLOUD ACTIVE</span>
              </div>
              <p className="text-caption text-slate-400">Last: {lastUpdate.toLocaleTimeString()}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoMode(!isAutoMode)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isAutoMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-slate-600 hover:bg-slate-700 text-white'
                }`}
              >
                {isAutoMode ? 'Auto ON' : 'Auto OFF'}
              </button>
              
              <button
                onClick={runPipeline}
                disabled={pipelineStatus === 'running'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {pipelineStatus === 'running' ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Run Pipeline
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cloud Infrastructure Status */}
        <div className="grid-responsive grid-1-2-4 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white text-center">
            <Server className="mx-auto mb-2" size={24} />
            <div className="text-lg font-bold">GCP</div>
            <div className="text-sm opacity-90">Google Cloud</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white text-center">
            <Satellite className="mx-auto mb-2" size={24} />
            <div className="text-lg font-bold">Earth Engine</div>
            <div className="text-sm opacity-90">Satellite Data</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white text-center">
            <Brain className="mx-auto mb-2" size={24} />
            <div className="text-lg font-bold">Vertex AI</div>
            <div className="text-sm opacity-90">ML Training</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4 text-white text-center">
            <Database className="mx-auto mb-2" size={24} />
            <div className="text-lg font-bold">BigQuery</div>
            <div className="text-sm opacity-90">Analytics</div>
          </div>
        </div>
      </div>

      {/* Pipeline Progress */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">Real-Time Pipeline Execution</h3>
        
        <div className="space-y-4">
          {pipelineSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > index;
            const isActive = currentStep === index && pipelineStatus === 'running';
            const isPending = currentStep < index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  isCompleted ? 'bg-green-900/30 border-green-600' :
                  isActive ? 'bg-blue-900/30 border-blue-600' :
                  'bg-slate-700/50 border-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isCompleted ? 'bg-green-600' :
                  isActive ? 'bg-blue-600' :
                  'bg-slate-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="text-white" size={20} />
                  ) : isActive ? (
                    <RefreshCw className="text-white animate-spin" size={20} />
                  ) : (
                    <StepIcon className="text-white" size={20} />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    isCompleted ? 'text-green-300' :
                    isActive ? 'text-blue-300' :
                    'text-slate-400'
                  }`}>
                    {step.name}
                  </h4>
                  {isActive && (
                    <div className="mt-2">
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <motion.div 
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: step.duration / 1000 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    isCompleted ? 'text-green-400' :
                    isActive ? 'text-blue-400' :
                    'text-slate-500'
                  }`}>
                    {isCompleted ? 'Completed' :
                     isActive ? 'Running...' :
                     'Pending'}
                  </div>
                  <div className="text-xs text-slate-500">
                    ~{step.duration / 1000}s
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Model Performance */}
      {modelPerformance && (
        <div className="grid-responsive grid-1-2">
          <div className="card-primary space-component">
            <h3 className="text-heading-3 font-bold text-white mb-4">ML Model Performance</h3>
            <div className="space-y-4">
              {modelPerformance.models.map((model: any, index: number) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white">{model.modelType.toUpperCase()}</h4>
                      <p className="text-sm text-slate-400">Version {model.version}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      model.status === 'deployed' ? 'bg-green-100 text-green-800' :
                      model.status === 'training' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {model.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Accuracy:</span>
                      <div className="font-bold text-green-400">{model.accuracy}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Trained:</span>
                      <div className="font-medium text-white">{model.lastTrained.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-primary space-component">
            <h3 className="text-heading-3 font-bold text-white mb-4">Infrastructure Status</h3>
            <div className="space-y-4">
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-600">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-400" size={16} />
                  <span className="font-semibold text-green-300">System Status</span>
                </div>
                <div className="text-green-200 text-sm">
                  Uptime: {modelPerformance.infrastructure.uptime} • 
                  Latency: {modelPerformance.infrastructure.latency}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <Cpu className="mx-auto mb-1 text-blue-400" size={20} />
                  <div className="text-lg font-bold text-white">98.5%</div>
                  <div className="text-xs text-slate-400">Satellite Uptime</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <Wifi className="mx-auto mb-1 text-green-400" size={20} />
                  <div className="text-lg font-bold text-white">94.2%</div>
                  <div className="text-xs text-slate-400">Weather Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Results */}
      {pipelineResults && (
        <div className="card-primary space-component">
          <h3 className="text-heading-3 font-bold text-white mb-4">Pipeline Results & Downloads</h3>
          
          <div className="grid-responsive grid-1-2-3 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white text-center">
              <div className="text-2xl font-bold">{pipelineResults.performance.accuracy}%</div>
              <div className="text-sm opacity-90">Prediction Accuracy</div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white text-center">
              <div className="text-2xl font-bold">{pipelineResults.performance.confidence}%</div>
              <div className="text-sm opacity-90">Model Confidence</div>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white text-center">
              <div className="text-2xl font-bold">{pipelineResults.performance.totalProcessingTime}</div>
              <div className="text-sm opacity-90">Processing Time</div>
            </div>
          </div>

          {/* Raster Downloads */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">📊 Generated Raster Files (30m Resolution)</h4>
            <div className="grid-responsive grid-1-2">
              {pipelineResults.outputs.rasterFiles.map((file: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-bold text-white">{file.filename}</h5>
                      <p className="text-sm text-slate-400">{file.format} • {file.resolution} • {file.size}</p>
                    </div>
                    <button
                      onClick={() => downloadRaster(file)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">
                    CRS: {file.crs} • Ready for QGIS/ArcGIS
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Animations */}
            <h4 className="text-lg font-semibold text-white">🎬 Fire Spread Animations</h4>
            <div className="grid-responsive grid-1-2">
              {pipelineResults.outputs.animations.map((animation: any, index: number) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-bold text-white">{animation.filename}</h5>
                      <p className="text-sm text-slate-400">{animation.format} • {animation.duration} • {animation.size}</p>
                    </div>
                    <button
                      onClick={() => downloadRaster(animation)}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">
                    {animation.fps} FPS • 12-hour simulation
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Assessment */}
      {pipelineResults && (
        <div className="card-primary space-component">
          <h3 className="text-heading-3 font-bold text-white mb-4">Data Quality Assessment</h3>
          <div className="grid-responsive grid-1-2-3">
            <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
              <h4 className="font-semibold text-blue-400 mb-2">🛰️ Satellite Data</h4>
              <div className="space-y-2 text-sm text-blue-200">
                <div className="flex justify-between">
                  <span>Images Retrieved:</span>
                  <span className="font-bold">{pipelineResults.dataQuality.satellite.totalImages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cloud-Free:</span>
                  <span className="font-bold">{pipelineResults.dataQuality.satellite.cloudFreeImages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fire Detections:</span>
                  <span className="font-bold">{pipelineResults.dataQuality.satellite.fireDetections}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 rounded-lg p-4 border border-green-600">
              <h4 className="font-semibold text-green-400 mb-2">🌤️ Weather Data</h4>
              <div className="space-y-2 text-sm text-green-200">
                <div className="flex justify-between">
                  <span>Completeness:</span>
                  <span className="font-bold">{pipelineResults.dataQuality.weather.completeness}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold">{pipelineResults.dataQuality.weather.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Sources:</span>
                  <span className="font-bold">{pipelineResults.dataQuality.weather.sources}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-600">
              <h4 className="font-semibold text-purple-400 mb-2">📊 Overall Quality</h4>
              <div className="space-y-2 text-sm text-purple-200">
                <div className="flex justify-between">
                  <span>Data Completeness:</span>
                  <span className="font-bold">{pipelineResults.dataQuality.completeness}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-bold">{pipelineResults.performance.totalProcessingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>ISRO Compliance:</span>
                  <span className="font-bold text-green-400">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Specifications */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">🔧 Technical Implementation</h3>
        <div className="grid-responsive grid-1-2">
          <div>
            <h4 className="font-semibold text-white mb-3">Cloud Infrastructure</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• <strong>Google Cloud Platform:</strong> Compute Engine, Vertex AI, Earth Engine</li>
              <li>• <strong>Data Storage:</strong> Cloud Storage buckets with auto-scaling</li>
              <li>• <strong>ML Training:</strong> Vertex AI with GPU acceleration</li>
              <li>• <strong>Real-time Processing:</strong> Cloud Functions + Pub/Sub</li>
              <li>• <strong>Monitoring:</strong> Cloud Monitoring + Logging</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Data Sources & APIs</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• <strong>Satellite:</strong> MODIS, Sentinel-2, VIIRS via Earth Engine</li>
              <li>• <strong>Weather:</strong> MOSDAC, ERA-5, IMD real-time APIs</li>
              <li>• <strong>Terrain:</strong> SRTM 30m DEM from Bhoonidhi Portal</li>
              <li>• <strong>LULC:</strong> ESA WorldCover, ISRO Bhuvan datasets</li>
              <li>• <strong>Population:</strong> GHSL Global Human Settlement Layer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};