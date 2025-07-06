import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon } from 'react-leaflet';
import { FireRiskData } from '../types';
import 'leaflet/dist/leaflet.css';

interface RiskMapProps {
  riskData: FireRiskData[];
  selectedRegion?: string;
  onRegionSelect: (regionId: string) => void;
}

export const RiskMap: React.FC<RiskMapProps> = ({ riskData, selectedRegion, onRegionSelect }) => {
  const mapRef = useRef<any>(null);

  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'moderate': return '#d97706';
      case 'low': return '#65a30d';
      case 'nil': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getBufferZone = (lat: number, lng: number, riskLevel: string) => {
    const radius = riskLevel === 'critical' ? 0.03 : riskLevel === 'high' ? 0.02 : 0.01;
    const points = [];
    for (let i = 0; i < 32; i++) {
      const angle = (i * 360) / 32;
      const x = lat + radius * Math.cos(angle * Math.PI / 180);
      const y = lng + radius * Math.sin(angle * Math.PI / 180);
      points.push([x, y]);
    }
    return points;
  };

  useEffect(() => {
    if (mapRef.current && selectedRegion) {
      const region = riskData.find(r => r.id === selectedRegion);
      if (region) {
        mapRef.current.setView([region.lat, region.lng], 12);
      }
    }
  }, [selectedRegion, riskData]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        ref={mapRef}
        center={[29.9457, 78.1642]}
        zoom={8}
        className="h-full w-full"
        zoomControl={true}
        style={{ minHeight: '300px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {riskData.map((region) => (
          <React.Fragment key={region.id}>
            {/* Buffer Zone */}
            {(region.riskLevel === 'critical' || region.riskLevel === 'high') && (
              <Polygon
                positions={getBufferZone(region.lat, region.lng, region.riskLevel) as any}
                pathOptions={{
                  color: getRiskColor(region.riskLevel),
                  fillColor: getRiskColor(region.riskLevel),
                  fillOpacity: 0.1,
                  weight: 1,
                  dashArray: '5, 5'
                }}
              />
            )}
            
            {/* Risk Point */}
            <CircleMarker
              center={[region.lat, region.lng]}
              radius={region.riskLevel === 'critical' ? 15 : region.riskLevel === 'high' ? 12 : 8}
              pathOptions={{
                color: getRiskColor(region.riskLevel),
                fillColor: getRiskColor(region.riskLevel),
                fillOpacity: 0.8,
                weight: 3
              }}
              eventHandlers={{
                click: () => onRegionSelect(region.id)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-2">{region.id.replace('-', ' ').toUpperCase()}</h3>
                  <p className={`font-semibold mb-3 ${
                    region.riskLevel === 'critical' ? 'text-red-600' : 
                    region.riskLevel === 'high' ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    Risk: {region.riskLevel.toUpperCase()} ({region.confidence}%)
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Temperature:</p>
                      <p className="text-red-600">{region.temperature}°C</p>
                    </div>
                    <div>
                      <p className="font-medium">Humidity:</p>
                      <p className="text-blue-600">{region.humidity}%</p>
                    </div>
                    <div>
                      <p className="font-medium">Wind:</p>
                      <p className="text-green-600">{region.windSpeed} km/h</p>
                    </div>
                    <div>
                      <p className="font-medium">Vegetation:</p>
                      <p className="text-emerald-600">{region.vegetation}%</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      Last updated: {region.lastUpdated.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};