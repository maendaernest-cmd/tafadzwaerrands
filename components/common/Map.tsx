
import React from 'react';

export interface MapPin {
  id?: string;
  lat: number; 
  lng: number; 
  type: 'WORKER' | 'ERRAND' | 'MERCHANT'; 
  label?: string;
  sublabel?: string;
}

interface MapProps {
  className?: string;
  pins?: MapPin[];
  onPinClick?: (pin: MapPin) => void;
  selectedPinId?: string;
  showRoute?: boolean;
  routeStart?: MapPin;
  routeEnd?: MapPin;
}

const Map: React.FC<MapProps> = ({ className = "h-64", pins = [], onPinClick, selectedPinId, showRoute, routeStart, routeEnd }) => {
  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'WORKER': return 'Live Agent';
      case 'ERRAND': return 'Active Errand';
      case 'MERCHANT': return 'Merchant Partner';
      default: return type;
    }
  };

  return (
    <div className={`relative bg-gray-100 rounded-[2rem] overflow-hidden border border-gray-200 shadow-2xl ${className}`}>
      {/* Google Maps Style Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        {/* Street Network Simulation */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
              linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
              linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />

        {/* Building Blocks */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute bg-gray-200 border border-gray-300 rounded-sm opacity-40"
              style={{
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 40 + 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 10 - 5}deg)`
              }}
            />
          ))}
        </div>

        {/* Park Areas */}
        <div className="absolute top-1/4 left-1/3 w-16 h-12 bg-green-200 rounded-lg opacity-30 border border-green-300" />
        <div className="absolute bottom-1/4 right-1/4 w-20 h-14 bg-green-200 rounded-lg opacity-30 border border-green-300" />

        {/* Street Names */}
        <div className="absolute top-1/4 left-8 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm">
          Samora Machel Ave
        </div>
        <div className="absolute bottom-1/3 right-12 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm">
          Borrowdale Rd
        </div>
        <div className="absolute top-3/4 left-1/4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm">
          Nelson Mandela Ave
        </div>
        <div className="absolute top-1/2 right-1/3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-700 shadow-sm">
          Harare Drive
        </div>
      </div>

      {/* Route Line Layer */}
      {(showRoute || true) && routeStart && routeEnd && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Blue Route Line - Simulated path */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7"
                refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
              </marker>
            </defs>
            {/* Curved route path */}
            <path
              d={`M ${routeStart.lng}% ${routeStart.lat}% Q 50% 40% ${routeEnd.lng}% ${routeEnd.lat}%`}
              stroke="#2563eb"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="none"
              markerEnd="url(#arrowhead)"
              className="drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(37, 99, 235, 0.4))' }}
            />
          </svg>

          {/* Start Point Marker */}
          <div
            className="absolute w-6 h-6 bg-green-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${routeStart.lat}%`, left: `${routeStart.lng}%`, zIndex: 15 }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>

          {/* End Point Marker */}
          <div
            className="absolute w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${routeEnd.lat}%`, left: `${routeEnd.lng}%`, zIndex: 15 }}
          >
            <div className="w-3 h-3 bg-white rounded-full border border-red-600"></div>
          </div>

          {/* Route Info Card */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-2xl border border-gray-200 max-w-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-gray-900">Live Route</span>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="font-bold text-gray-900">3.2 km</span>
              </div>
              <div className="flex justify-between">
                <span>ETA:</span>
                <span className="font-bold text-gray-900">12:45 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Traffic:</span>
                <span className="font-bold text-green-600">Light</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dynamic Pins Layer */}
      {pins.map((pin, i) => {
        const isSelected = selectedPinId === pin.id;
        const colorClass = 
          pin.type === 'WORKER' ? 'bg-blue-600' : 
          pin.type === 'ERRAND' ? 'bg-red-600' : 'bg-amber-500';

        return (
          <button 
            key={pin.id || i}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick?.(pin);
            }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-10 hover:z-30 group focus:outline-none ${isSelected ? 'z-40' : ''}`}
            style={{ top: `${pin.lat}%`, left: `${pin.lng}%` }}
          >
            {/* Interactive Tooltip: Visible on hover or when selected */}
            <div className={`
              absolute bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap bg-gray-950 text-white p-4 rounded-3xl shadow-2xl pointer-events-none z-50 flex flex-col items-center min-w-[160px] border border-white/10 transition-all duration-300 transform
              ${isSelected ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:-translate-y-2'}
            `}>
              <span className="text-[12px] font-black tracking-tight mb-1">{pin.label || 'Entity'}</span>
              <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${colorClass}`}>
                {getTypeLabel(pin.type)}
              </div>
              {pin.sublabel && (
                <span className="text-[10px] text-gray-400 mt-2 font-bold">{pin.sublabel}</span>
              )}
              {/* Tooltip Triangle */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-950" />
            </div>

            {/* Google Maps Style Pin */}
            <div className={`
              relative transition-all duration-300 transform group-hover:scale-110 group-active:scale-95
              ${isSelected ? 'scale-110' : ''}
            `}>
              {/* Pin Shadow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-sm" />

              {/* Pin Body - Drop Shape */}
              <div className={`
                relative w-8 h-10 flex items-center justify-center transform transition-all
                ${isSelected ? 'drop-shadow-2xl' : 'drop-shadow-lg'}
              `}>
                {/* Pin Point */}
                <div className={`
                  absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 ${colorClass} rotate-45 origin-center
                  ${isSelected ? 'animate-pulse' : ''}
                `} />

                {/* Pin Head */}
                <div className={`
                  w-8 h-8 ${colorClass} rounded-full border-2 border-white shadow-lg flex items-center justify-center transform transition-all
                  ${isSelected ? 'ring-4 ring-white/50 scale-110' : ''}
                `}>
                  <div className="text-white text-xs font-bold">
                    {pin.type === 'WORKER' && '🚗'}
                    {pin.type === 'ERRAND' && '📦'}
                    {pin.type === 'MERCHANT' && '🏪'}
                  </div>
                </div>

                {/* Live Status Indicator for Workers */}
                {pin.type === 'WORKER' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </button>
        );
      })}

      {/* Google Maps Style Controls */}
      <div className="absolute top-8 right-8 flex flex-col space-y-2">
        {/* Map Type Selector */}
        <div className="bg-white/90 backdrop-blur rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-medium text-xs transition-all active:scale-90 border-b border-gray-200">
            🗺️
          </button>
          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-medium text-xs transition-all active:scale-90">
            🛰️
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-white/90 backdrop-blur rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-900 font-bold transition-all active:scale-90 border-b border-gray-200">
            +
          </button>
          <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-900 font-bold transition-all active:scale-90">
            −
          </button>
        </div>

        {/* Compass */}
        <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-lg shadow-xl border border-gray-200 flex items-center justify-center">
          <div className="w-6 h-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-red-500"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-400"></div>
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-0.5 bg-gray-400"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-0.5 bg-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Location Button */}
      <div className="absolute bottom-24 right-8">
        <button className="w-14 h-14 bg-white/90 backdrop-blur rounded-full shadow-xl border border-gray-200 flex items-center justify-center hover:bg-white transition-all active:scale-90">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 border-2 border-blue-600 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Bottom Legend Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-950/95 backdrop-blur-2xl px-10 py-4 rounded-full shadow-2xl border border-white/10 flex items-center space-x-12 pointer-events-none transition-transform duration-500 hover:translate-y-[-4px]">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
          <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Live Agents</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-600 rounded-sm rotate-45 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
          <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Market Jobs</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-amber-500 rounded-md shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Shops</span>
        </div>
      </div>

      {/* Google Maps Style Copyright */}
      <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur px-3 py-1 rounded text-[9px] text-gray-600 font-medium shadow-sm">
        Map data ©2024 Tafadzwa Errand
      </div>

      <style>{`
        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-custom {
          animation: bounce-custom 2.4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Map;
