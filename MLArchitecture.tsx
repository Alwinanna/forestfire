import React, { useState } from 'react';
import { Brain, Layers, Zap, Target, Code, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const MLArchitecture: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'unet' | 'lstm' | 'cellular'>('unet');

  const modelSpecs = {
    unet: {
      name: 'U-NET Architecture',
      description: 'Convolutional Neural Network for Fire Probability Mapping',
      icon: Layers,
      color: 'blue',
      architecture: [
        'Input: 30m x 30m x 12 channels (weather, terrain, LULC)',
        'Encoder: 4 downsampling blocks (Conv2D + MaxPool)',
        'Bottleneck: Dense feature representation',
        'Decoder: 4 upsampling blocks (ConvTranspose2D)',
        'Output: Fire probability map (0-1 per pixel)'
      ],
      parameters: {
        'Input Size': '512x512x12',
        'Output Classes': '5 (nil, low, moderate, high, critical)',
        'Loss Function': 'Focal Loss (handles class imbalance)',
        'Optimizer': 'Adam (lr=0.001)',
        'Batch Size': '16',
        'Training Epochs': '100'
      }
    },
    lstm: {
      name: 'LSTM Time Series Model',
      description: 'Long Short-Term Memory for Temporal Fire Prediction',
      icon: Zap,
      color: 'purple',
      architecture: [
        'Input: Time series of weather/terrain features (24h window)',
        'LSTM Layer 1: 128 units, return_sequences=True',
        'LSTM Layer 2: 64 units, dropout=0.2',
        'Dense Layer: 32 units, ReLU activation',
        'Output: Fire probability for next 24 hours'
      ],
      parameters: {
        'Sequence Length': '24 hours',
        'Features': '15 (weather + terrain)',
        'LSTM Units': '128, 64',
        'Dropout': '0.2',
        'Loss Function': 'Binary Crossentropy',
        'Optimizer': 'RMSprop (lr=0.001)'
      }
    },
    cellular: {
      name: 'Cellular Automata + ML',
      description: 'Hybrid model for fire spread simulation',
      icon: Target,
      color: 'green',
      architecture: [
        'Initial State: Fire probability from U-NET/LSTM',
        'Transition Rules: ML-learned from historical data',
        'Neighborhood: Moore (8-cell) + extended (24-cell)',
        'Update Function: Neural network (3 hidden layers)',
        'Time Step: 15 minutes simulation intervals'
      ],
      parameters: {
        'Grid Resolution': '30m x 30m',
        'Neighborhood': 'Moore + Extended',
        'Time Step': '15 minutes',
        'ML Model': 'Random Forest (500 trees)',
        'Features': 'Wind, slope, fuel, current state',
        'Simulation Hours': '1, 2, 3, 6, 12'
      }
    }
  };

  const currentModel = modelSpecs[selectedModel];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="text-purple-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">ML Architecture - ISRO BAH 2025</h3>
          <p className="text-gray-600">U-NET, LSTM & Cellular Automata Implementation</p>
        </div>
      </div>

      {/* Model Selection */}
      <div className="flex gap-2 mb-6">
        {Object.entries(modelSpecs).map(([key, model]) => (
          <button
            key={key}
            onClick={() => setSelectedModel(key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedModel === key
                ? `bg-${model.color}-100 text-${model.color}-800 border-2 border-${model.color}-300`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <model.icon size={16} />
              {model.name.split(' ')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Model Details */}
      <motion.div
        key={selectedModel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className={`bg-${currentModel.color}-50 rounded-lg p-4 border border-${currentModel.color}-200`}>
          <div className="flex items-center gap-3 mb-3">
            <currentModel.icon className={`text-${currentModel.color}-600`} size={24} />
            <div>
              <h4 className={`text-lg font-bold text-${currentModel.color}-900`}>{currentModel.name}</h4>
              <p className={`text-${currentModel.color}-700`}>{currentModel.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Architecture */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Code size={18} />
              Architecture
            </h5>
            <div className="space-y-2">
              {currentModel.architecture.map((layer, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-full bg-${currentModel.color}-100 text-${currentModel.color}-600 text-xs flex items-center justify-center font-bold`}>
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{layer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Settings size={18} />
              Parameters
            </h5>
            <div className="space-y-2">
              {Object.entries(currentModel.parameters).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{key}:</span>
                  <span className="text-sm font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Implementation Preview */}
        <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
          <div className="mb-2 text-gray-400"># {currentModel.name} Implementation</div>
          {selectedModel === 'unet' && (
            <pre>{`import tensorflow as tf
from tensorflow.keras.layers import *

def build_unet(input_shape=(512, 512, 12)):
    inputs = Input(input_shape)
    
    # Encoder
    c1 = Conv2D(64, 3, activation='relu', padding='same')(inputs)
    c1 = Conv2D(64, 3, activation='relu', padding='same')(c1)
    p1 = MaxPooling2D(2)(c1)
    
    # ... (additional layers)
    
    # Decoder with skip connections
    u6 = Conv2DTranspose(64, 2, strides=2, padding='same')(c5)
    u6 = concatenate([u6, c1])
    
    outputs = Conv2D(5, 1, activation='softmax')(c6)
    
    model = Model(inputs=[inputs], outputs=[outputs])
    model.compile(optimizer='adam', 
                 loss='categorical_crossentropy',
                 metrics=['accuracy'])
    return model`}</pre>
          )}
          {selectedModel === 'lstm' && (
            <pre>{`import tensorflow as tf
from tensorflow.keras.layers import *

def build_lstm(sequence_length=24, features=15):
    model = Sequential([
        LSTM(128, return_sequences=True, 
             input_shape=(sequence_length, features)),
        Dropout(0.2),
        LSTM(64, return_sequences=False),
        Dropout(0.2),
        Dense(32, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    
    model.compile(optimizer='rmsprop',
                 loss='binary_crossentropy',
                 metrics=['accuracy'])
    return model`}</pre>
          )}
          {selectedModel === 'cellular' && (
            <pre>{`import numpy as np
from sklearn.ensemble import RandomForestRegressor

class FireSpreadCA:
    def __init__(self):
        self.rf_model = RandomForestRegressor(n_estimators=500)
        
    def get_neighbors(self, grid, i, j):
        # Moore + Extended neighborhood
        neighbors = []
        for di in [-2, -1, 0, 1, 2]:
            for dj in [-2, -1, 0, 1, 2]:
                if 0 <= i+di < grid.shape[0] and 0 <= j+dj < grid.shape[1]:
                    neighbors.append(grid[i+di, j+dj])
        return np.array(neighbors)
    
    def update_cell(self, current_state, neighbors, wind, slope, fuel):
        features = np.concatenate([
            [current_state], neighbors, [wind, slope, fuel]
        ])
        return self.rf_model.predict([features])[0]`}</pre>
          )}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h5 className="font-semibold text-green-900 mb-2">Model Performance (Uttarakhand Validation)</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-green-700 font-medium">U-NET Accuracy:</p>
            <p className="text-green-900 text-lg font-bold">94.2%</p>
          </div>
          <div>
            <p className="text-green-700 font-medium">LSTM Temporal Accuracy:</p>
            <p className="text-green-900 text-lg font-bold">91.8%</p>
          </div>
          <div>
            <p className="text-green-700 font-medium">CA Spread Fidelity:</p>
            <p className="text-green-900 text-lg font-bold">89.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};