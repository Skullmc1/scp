import React, { useState } from 'react';
import { X, Search, AlertCircle, Loader2, Shield, Database } from 'lucide-react';
import Parser, { SCPData, ErrorResponse } from './Parser';
import SCPProfile from './SCPProfile';

interface AccessModuleProps {
  onClose: () => void;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    light: string;
    lightest: string;
  };
}

const AccessModule: React.FC<AccessModuleProps> = ({ onClose, colors }) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [scpNumber, setScpNumber] = useState<string>('');
  const [scpIdentifier, setScpIdentifier] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SCPData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const seriesOptions = [
    { value: 'I', label: 'Series I (SCP-001 to SCP-999)', numeric: 0 },
    { value: 'II', label: 'Series II (SCP-1000 to SCP-1999)', numeric: 1 },
    { value: 'III', label: 'Series III (SCP-2000 to SCP-2999)', numeric: 2 },
    { value: 'IV', label: 'Series IV (SCP-3000 to SCP-3999)', numeric: 3 },
    { value: 'V', label: 'Series V (SCP-4000 to SCP-4999)', numeric: 4 },
    { value: 'VI', label: 'Series VI (SCP-5000 to SCP-5999)', numeric: 5 },
    { value: 'VII', label: 'Series VII (SCP-6000 to SCP-6999)', numeric: 6 },
    { value: 'VIII', label: 'Series VIII (SCP-7000 to SCP-7999)', numeric: 7 },
    { value: 'IX', label: 'Series IX (SCP-8000 to SCP-8999)', numeric: 8 },
  ];

  const handleDataFetched = (data: SCPData | ErrorResponse) => {
    if ('error' in data) {
      setError(data.error);
      setSearchResult(null);
    } else {
      setSearchResult(data);
      setError('');
    }
    setIsLoading(false);
  };
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSearchResult(null);
    setIsLoading(false);
  };

  const handleSearch = async () => {
    setError('');
    setSearchResult(null);

    if (!selectedSeries) {
      setError('Please select a series');
      return;
    }

    if (!scpNumber || scpNumber.length !== 3 || isNaN(Number(scpNumber))) {
      setError('Please enter a valid SCP number (001-999)');
      return;
    }

    const numberValue = parseInt(scpNumber);
    if (numberValue < 1 || numberValue > 999) {
      setError('Please enter a valid SCP number (001-999)');
      return;
    }

    const selectedSeriesData = seriesOptions.find(s => s.value === selectedSeries);
    if (!selectedSeriesData) return;
    
    const fullScpIdentifier = `${selectedSeriesData.numeric}${scpNumber.padStart(3, '0')}`;
    setIsLoading(true);
    setScpIdentifier(fullScpIdentifier);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,3}$/.test(value)) {
      setScpNumber(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      {isLoading && scpIdentifier && (
        <Parser
          scpIdentifier={scpIdentifier}
          onDataFetched={handleDataFetched}
          onError={handleError}
        />
      )}
      <div
        className="bg-[#0f0f0f] border-2 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl"
        style={{ borderColor: colors.primary }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: colors.primary, backgroundColor: '#0a0a0a' }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.primary + '20' }}>
              <Database size={24} style={{ color: colors.primary }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">SCP Database Access</h2>
              <p className="text-xs text-gray-400">Security Level 3 Clearance Required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#252525] transition-colors"
            style={{ color: colors.primary }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Search className="mr-2" size={20} style={{ color: colors.primary }} />
              <h3 className="text-lg font-medium">Search SCP Database</h3>
            </div>
            
            <div className="bg-[#151515] p-4 rounded-lg mb-6">
              <p className="text-gray-400 text-sm">
                Select a series and enter an SCP number to access its file. All accesses are logged and monitored by Foundation security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-3 flex items-center">
                  <Shield size={14} className="mr-1" style={{ color: colors.primary }} />
                  Series Selection
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {seriesOptions.map((series) => (
                    <button
                      key={series.value}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedSeries === series.value
                          ? 'text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-[#252525]'
                      }`}
                      style={{
                        backgroundColor: selectedSeries === series.value ? colors.primary : '#1a1a1a',
                        transform: selectedSeries === series.value ? 'translateY(-1px)' : 'none'
                      }}
                      onClick={() => setSelectedSeries(series.value)}
                    >
                      {series.value}
                    </button>
                  ))}
                </div>
                {selectedSeries && (
                  <p className="text-xs text-gray-500 mt-2">
                    {seriesOptions.find(s => s.value === selectedSeries)?.label}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">SCP Identifier</label>
                <div className="flex items-center">
                  <span className="bg-[#1a1a1a] border border-r-0 rounded-l-md px-3 py-2 text-gray-400" 
                    style={{ borderColor: colors.primary }}>
                    SCP-
                  </span>
                  <input
                    type="text"
                    value={scpNumber}
                    onChange={handleNumberChange}
                    placeholder="001"
                    className="flex-1 bg-[#1a1a1a] border rounded-r-md px-3 py-2 outline-none focus:ring-2"
                    style={{
                      borderColor: colors.primary,
                      boxShadow: `0 0 0 2px ${colors.primary}20`
                    }}
                    maxLength={3}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter 3-digit identifier (001-999)</p>
              </div>
            </div>

            {error && (
              <div
                className="flex items-center p-3 rounded-md mb-4 border"
                style={{ 
                  backgroundColor: '#2d1a1a', 
                  color: colors.light,
                  borderColor: colors.primary + '40'
                }}
              >
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={isLoading || !selectedSeries || !scpNumber}
              className="w-full py-3 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              style={{
                backgroundColor: colors.primary,
                opacity: (!selectedSeries || !scpNumber) ? 0.7 : 1
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accessing Secure File...
                </>
              ) : (
                'Access SCP File'
              )}
            </button>
          </div>

          {searchResult && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.primary + '40' }}>
              <SCPProfile data={searchResult} colors={colors} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t text-xs text-center flex items-center justify-center"
          style={{ borderColor: colors.primary, backgroundColor: '#0a0a0a' }}
        >
          <Shield size={12} className="mr-1" style={{ color: colors.primary }} />
          <span>SCP Foundation Database • Security Level 3 • All access is monitored and logged</span>
        </div>
      </div>
    </div>
  );
};

export default AccessModule;