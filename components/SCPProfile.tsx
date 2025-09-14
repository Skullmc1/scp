import React from 'react';
import { SCPData } from './Parser';

interface SCPProfileProps {
  data: SCPData;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    light: string;
    lightest: string;
  };
}

const SCPProfile: React.FC<SCPProfileProps> = ({ data, colors }) => {
  return (
    <div
      className="border rounded-lg p-4 flex flex-col h-96 bg-gray-900 shadow-lg"
      style={{ borderColor: colors.primary }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-white">
          {data.itemNumber}: {data.name}
        </h3>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2"
          style={{
            backgroundColor:
              data.objectClass?.toLowerCase() === 'keter' ? '#7c2d2d' :
              data.objectClass?.toLowerCase() === 'euclid' ? '#7c5e2d' :
              '#2d7c3d',
            color: 'white'
          }}
        >
          {data.objectClass?.toUpperCase()}-CLASS
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="overflow-y-auto h-full pr-2">
          <div className="mb-4">
            <p className="text-gray-300 text-sm leading-relaxed">{data.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2 text-white uppercase tracking-wide" style={{color: colors.light}}>
              Containment Procedures
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">{data.containment}</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 italic pt-3 mt-3 border-t" style={{borderColor: colors.primary}}>
        Access granted to {data.itemNumber} file. Further details require Level 4 clearance.
      </div>
    </div>
  );
};

export default SCPProfile;