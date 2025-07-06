import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Home, School, Guitar as Hospital, MapPin, AlertTriangle, Shield, Navigation } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PopulationData {
  district: string;
  totalPopulation: number;
  atRiskPopulation: number;
  vulnerableGroups: {
    children: number;
    elderly: number;
    disabled: number;
  };
  infrastructure: {
    schools: number;
    hospitals: number;
    emergencyServices: number;
  };
  evacuationCapacity: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const PopulationRiskAssessment: React.FC = () => {
  const [populationData, setPopulationData] = useState<PopulationData[]>([
    {
      district: 'Nainital',
      totalPopulation: 954605,
      atRiskPopulation: 45000,
      vulnerableGroups: { children: 12000, elderly: 8000, disabled: 2500 },
      infrastructure: { schools: 45, hospitals: 8, emergencyServices: 12 },
      evacuationCapacity: 35000,
      riskLevel: 'critical'
    },
    {
      district: 'Pauri Garhwal',
      totalPopulation: 687271,
      atRiskPopulation: 32000,
      vulnerableGroups: { children: 9000, elderly: 6500, disabled: 1800 },
      infrastructure: { schools: 38, hospitals: 6, emergencyServices: 9 },
      evacuationCapacity: 28000,
      riskLevel: 'high'
    },
    {
      district: 'Almora',
      totalPopulation: 622506,
      atRiskPopulation: 28000,
      vulnerableGroups: { children: 7500, elderly: 5800, disabled: 1600 },
      infrastructure: { schools: 42, hospitals: 5, emergencyServices: 8 },
      evacuationCapacity: 25000,
      riskLevel: 'high'
    },
    {
      district: 'Tehri Garhwal',
      totalPopulation: 618931,
      atRiskPopulation: 35000,
      vulnerableGroups: { children: 9500, elderly: 7200, disabled: 2000 },
      infrastructure: { schools: 40, hospitals: 7, emergencyServices: 10 },
      evacuationCapacity: 30000,
      riskLevel: 'medium'
    }
  ]);

  const [totalAtRisk, setTotalAtRisk] = useState(0);
  const [evacuationDeficit, setEvacuationDeficit] = useState(0);

  useEffect(() => {
    const total = populationData.reduce((sum, district) => sum + district.atRiskPopulation, 0);
    const capacity = populationData.reduce((sum, district) => sum + district.evacuationCapacity, 0);
    setTotalAtRisk(total);
    setEvacuationDeficit(Math.max(0, total - capacity));
  }, [populationData]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const vulnerabilityData = populationData.map(district => ({
    name: district.district,
    children: district.vulnerableGroups.children,
    elderly: district.vulnerableGroups.elderly,
    disabled: district.vulnerableGroups.disabled,
    total: district.atRiskPopulation
  }));

  const riskDistribution = [
    { name: 'Critical Risk', value: populationData.filter(d => d.riskLevel === 'critical').length, color: '#dc2626' },
    { name: 'High Risk', value: populationData.filter(d => d.riskLevel === 'high').length, color: '#ea580c' },
    { name: 'Medium Risk', value: populationData.filter(d => d.riskLevel === 'medium').length, color: '#d97706' },
    { name: 'Low Risk', value: populationData.filter(d => d.riskLevel === 'low').length, color: '#16a34a' }
  ].filter(item => item.value > 0);

  return (
    <div className="card-primary space-component">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-heading-2 font-bold text-white">Population Risk Assessment</h2>
            <p className="text-body-small text-slate-400">Uttarakhand forest fire vulnerable population analysis</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-red-400">{totalAtRisk.toLocaleString()}</div>
          <p className="text-caption text-slate-400">People at Risk</p>
        </div>
      </div>

      {/* Critical Statistics */}
      <div className="grid-responsive grid-1-2-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{totalAtRisk.toLocaleString()}</div>
          <div className="text-sm opacity-90">Total at Risk</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">
            {populationData.reduce((sum, d) => sum + d.vulnerableGroups.children + d.vulnerableGroups.elderly + d.vulnerableGroups.disabled, 0).toLocaleString()}
          </div>
          <div className="text-sm opacity-90">Vulnerable Groups</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{evacuationDeficit.toLocaleString()}</div>
          <div className="text-sm opacity-90">Evacuation Deficit</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">
            {populationData.reduce((sum, d) => sum + d.infrastructure.schools + d.infrastructure.hospitals + d.infrastructure.emergencyServices, 0)}
          </div>
          <div className="text-sm opacity-90">Critical Infrastructure</div>
        </motion.div>
      </div>

      <div className="grid-responsive grid-1-2 gap-6">
        {/* Vulnerable Population Chart */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Vulnerable Population by District</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vulnerabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Bar dataKey="children" stackId="a" fill="#3b82f6" name="Children" />
                <Bar dataKey="elderly" stackId="a" fill="#f59e0b" name="Elderly" />
                <Bar dataKey="disabled" stackId="a" fill="#ef4444" name="Disabled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Level Distribution */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">District Risk Level Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* District Details */}
      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-semibold text-white">District-wise Risk Assessment</h4>
        {populationData.map((district, index) => (
          <motion.div
            key={district.district}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <MapPin className="text-purple-400" size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-white">{district.district} District</h5>
                  <p className="text-sm text-slate-400">Population: {district.totalPopulation.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span 
                  className="px-3 py-1 rounded-lg text-white font-bold text-sm"
                  style={{ backgroundColor: getRiskColor(district.riskLevel) }}
                >
                  {district.riskLevel.toUpperCase()} RISK
                </span>
                <span className="text-red-400 font-bold">
                  {district.atRiskPopulation.toLocaleString()} at risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                <School className="mx-auto mb-1 text-blue-400" size={20} />
                <div className="text-lg font-bold text-white">{district.infrastructure.schools}</div>
                <div className="text-xs text-slate-400">Schools</div>
              </div>
              <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                <Hospital className="mx-auto mb-1 text-red-400" size={20} />
                <div className="text-lg font-bold text-white">{district.infrastructure.hospitals}</div>
                <div className="text-xs text-slate-400">Hospitals</div>
              </div>
              <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                <Shield className="mx-auto mb-1 text-green-400" size={20} />
                <div className="text-lg font-bold text-white">{district.infrastructure.emergencyServices}</div>
                <div className="text-xs text-slate-400">Emergency Services</div>
              </div>
              <div className="bg-slate-600/50 rounded-lg p-3 text-center">
                <Navigation className="mx-auto mb-1 text-yellow-400" size={20} />
                <div className="text-lg font-bold text-white">{district.evacuationCapacity.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Evacuation Capacity</div>
              </div>
            </div>

            {/* Evacuation Capacity Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>Evacuation Coverage</span>
                <span>{Math.round((district.evacuationCapacity / district.atRiskPopulation) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-3">
                <motion.div 
                  className={`h-3 rounded-full ${
                    district.evacuationCapacity >= district.atRiskPopulation 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-red-500 to-orange-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (district.evacuationCapacity / district.atRiskPopulation) * 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>

            {district.evacuationCapacity < district.atRiskPopulation && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle size={16} />
                <span>
                  Evacuation deficit: {(district.atRiskPopulation - district.evacuationCapacity).toLocaleString()} people
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Emergency Response Protocol */}
      <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-600">
        <h4 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
          <Shield size={16} />
          Emergency Response Protocol
        </h4>
        <div className="grid-responsive grid-1-2-3 text-sm text-purple-200">
          <div>
            <p className="font-medium mb-1">🚨 Immediate Actions:</p>
            <ul className="space-y-1 text-xs">
              <li>• Activate emergency alert system</li>
              <li>• Deploy evacuation teams</li>
              <li>• Secure critical infrastructure</li>
              <li>• Coordinate with local authorities</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">👥 Vulnerable Group Priority:</p>
            <ul className="space-y-1 text-xs">
              <li>• Children and elderly first</li>
              <li>• Disabled persons assistance</li>
              <li>• Medical facility patients</li>
              <li>• Tourist evacuation</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">📍 Evacuation Centers:</p>
            <ul className="space-y-1 text-xs">
              <li>• District headquarters</li>
              <li>• Sports complexes</li>
              <li>• Community centers</li>
              <li>• Temporary relief camps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};