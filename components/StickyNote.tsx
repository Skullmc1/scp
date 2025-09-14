import React from 'react';

const StickyNote = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="w-48 h-48 p-4 bg-yellow-200 text-yellow-900 shadow-lg transform rotate-2 relative"
        style={{
          fontFamily: "'Permanent Marker', cursive",
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
          background: 'linear-gradient(to bottom, #fef08a, #fceb9c)',
          border: '1px solid #e0c98b'
        }}
      >
        <div className="font-bold mb-2" style={{ fontSize: '1.2rem' }}>
          Credentials:
        </div>
        <div style={{ fontSize: '1rem' }}>
          login shyguy123
        </div>

        {/* Folded corner */}
        <div 
          className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-300 shadow-inner"
          style={{
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
            boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.1)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default StickyNote;