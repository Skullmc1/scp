import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Terminal, ChevronRight, Lock, Database, AlertTriangle, X, LogIn } from 'lucide-react';
import AccessModule from './AccessModule';
import StickyNote from './StickyNote';

const Hero = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccessModule, setShowAccessModule] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Color theme
  const colors = {
    primary: '#cc444b',
    secondary: '#da5552',
    tertiary: '#df7373',
    light: '#e39695',
    lightest: '#e4b1ab'
  };

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const tl = gsap.timeline();
    
    tl.fromTo(leftPanelRef.current, 
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
    );
    
    tl.fromTo(terminalRef.current, 
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    );

    // Initial terminal output
    setOutput([
      " ",
      "SCP FOUNDATION TERMINAL v4.2",
      "SECURE CONNECTION ESTABLISHED",
      `CLEARANCE LEVEL: ${isMobile ? "LEVEL 1" : "LEVEL 1"}`,
      " ",
      "Type 'help' for available commands",
      isMobile ? " " : "Type 'login' to gain access to the database"
    ]);

    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // Pause terminal input when AccessModule is open
  useEffect(() => {
    if (showAccessModule && inputRef.current) {
      inputRef.current.blur();
    } else if (!showAccessModule && inputRef.current) {
      // Only refocus if we're not on a mobile device (where virtual keyboard would pop up)
      if (!isMobile) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    }
  }, [showAccessModule, isMobile]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || showAccessModule) return; // Don't process commands if AccessModule is open
    
    const newOutput = [...output, `> ${command}`];
    const cmd = command.toLowerCase().trim();
    
    if (cmd.startsWith('login ')) {
      const password = cmd.split(' ')[1];
      if (password === 'shyguy123') {
        setIsLoggedIn(true);
        newOutput.push("Authentication successful. Access level upgraded to LEVEL 3.");
        newOutput.push("You now have access to the SCP database.");
        newOutput.push(" ");
      } else {
        newOutput.push("Authentication failed. Invalid credentials.");
        newOutput.push(" ");
      }
    } else if (cmd === 'login') {
      newOutput.push("Usage: login [password]");
      newOutput.push(" ");
    } else if (cmd === 'help') {
      newOutput.push("Available commands: about, status, clear" + (isLoggedIn ? ", access, database" : ", login"));
      newOutput.push(" ");
    } else if (cmd === 'about') {
      newOutput.push("Secure. Contain. Protect.");
      newOutput.push("Global foundation for anomalous object research and containment.");
      newOutput.push(" ");
    } else if (cmd === 'access') {
      if (isLoggedIn) {
        newOutput.push("Opening database access module...");
        newOutput.push(" ");
        setShowAccessModule(true);
      } else {
        newOutput.push("Access denied. Level 3 clearance required.");
        newOutput.push("Use 'login' command to gain access.");
        newOutput.push(" ");
      }
    } else if (cmd === 'database') {
      if (isLoggedIn) {
        newOutput.push("SCP database contains 9632 entries");
        newOutput.push("Classified objects: 4128");
        newOutput.push("Keter-class: 587 | Euclid-class: 2743 | Safe-class: 6302");
        newOutput.push("Use 'access' command to browse the database");
        newOutput.push(" ");
      } else {
        newOutput.push("Access denied. Level 3 clearance required.");
        newOutput.push("Use 'login' command to gain access.");
        newOutput.push(" ");
      }
    } else if (cmd === 'status') {
      newOutput.push("System status: NOMINAL");
      newOutput.push("Security: ACTIVE");
      newOutput.push("Threat level: ELEVATED");
      newOutput.push(`Authentication: ${isLoggedIn ? "GRANTED (LEVEL 3)" : "PENDING (LEVEL 1)"}`);
      newOutput.push(" ");
    } else if (cmd === 'clear') {
      setOutput([]);
      setCommand('');
      return;
    } else {
      newOutput.push(`Command not recognized: ${command}`);
      newOutput.push("Type 'help' for available commands");
      newOutput.push(" ");
    }
    
    setOutput(newOutput);
    setCommand('');
    
    // Scroll to bottom of terminal
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleMenuItemClick = (item: string) => {
    if (showAccessModule) return; // Don't process menu clicks if AccessModule is open
    
    if (item === 'access' && !isLoggedIn) {
      setCommand('login');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    } else {
      setCommand(item);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    }
  };

  const focusInput = () => {
    if (!showAccessModule && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const closeAccessModule = () => {
    setShowAccessModule(false);
  };

  return (
    <div 
      className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col md:flex-row relative"
      onClick={focusInput}
    >
      {/* Password Sticky Note */}
      <StickyNote />

      {/* Access Module Overlay */}
      {showAccessModule && (
        <AccessModule onClose={closeAccessModule} colors={colors} />
      )}
      
      {/* Left Panel - 1/3 on desktop, full width on mobile */}
      <div ref={leftPanelRef} className="w-full md:w-1/3 p-6 md:p-8 bg-[#101010]">
        <div className="flex items-center mb-8">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold">SCP FOUNDATION</h1>
        </div>
        
        <p className="text-gray-300 mb-8 leading-relaxed">
          Secure. Contain. Protect. Our mission is to safeguard humanity from anomalous objects, entities, and phenomena that defy natural law.
        </p>
        
        <div className="space-y-4 mb-8">
          <button 
            className="flex items-center w-full p-4 bg-[#1a1a1a] rounded-lg border border-[#252525] hover:border-[#cc444b] transition-colors"
            onClick={() => handleMenuItemClick('database')}
            style={{ borderLeft: `4px solid ${colors.primary}` }}
            disabled={showAccessModule}
          >
            <Database className="mr-3" size={20} style={{ color: colors.light }} />
            <span>Database Access</span>
            <ChevronRight className="ml-auto" size={20} style={{ color: colors.light }} />
          </button>
          
          <button 
            className="flex items-center w-full p-4 bg-[#1a1a1a] rounded-lg border border-[#252525] hover:border-[#cc444b] transition-colors"
            onClick={() => handleMenuItemClick('access')}
            style={{ borderLeft: `4px solid ${colors.primary}` }}
            disabled={showAccessModule}
          >
            <Lock className="mr-3" size={20} style={{ color: colors.light }} />
            <span>Security Clearance</span>
            <div className="ml-auto flex items-center">
              {isLoggedIn ? (
                <div className="text-xs px-2 py-1 rounded bg-green-900 text-green-300 mr-2">LEVEL 3</div>
              ) : (
                <div className="text-xs px-2 py-1 rounded bg-red-900 text-red-300 mr-2">LEVEL 1</div>
              )}
              <ChevronRight size={20} style={{ color: colors.light }} />
            </div>
          </button>
          
          <button 
            className="flex items-center w-full p-4 bg-[#1a1a1a] rounded-lg border border-[#252525] hover:border-[#cc444b] transition-colors"
            onClick={() => handleMenuItemClick('status')}
            style={{ borderLeft: `4px solid ${colors.primary}` }}
            disabled={showAccessModule}
          >
            <AlertTriangle className="mr-3" size={20} style={{ color: colors.light }} />
            <span>System Status</span>
            <ChevronRight className="ml-auto" size={20} style={{ color: colors.light }} />
          </button>

          {!isLoggedIn && (
            <button 
              className="flex items-center w-full p-4 bg-[#1a1a1a] rounded-lg border border-[#252525] hover:border-[#cc444b] transition-colors"
              onClick={() => handleMenuItemClick('login')}
              style={{ borderLeft: `4px solid ${colors.primary}` }}
              disabled={showAccessModule}
            >
              <LogIn className="mr-3" size={20} style={{ color: colors.light }} />
              <span>Login</span>
              <ChevronRight className="ml-auto" size={20} style={{ color: colors.light }} />
            </button>
          )}
        </div>
        
        <div className="pt-4 border-t border-[#252525]">
          <p className="text-sm text-gray-400 mb-2">Security Notice:</p>
          <p className="text-xs text-gray-500">
            All access is logged and monitored. Unauthorized use will result in immediate termination.
          </p>
        </div>
      </div>
      
      {/* Terminal Panel - 2/3 on desktop, full width on mobile */}
      <div 
        ref={terminalRef} 
        className="w-full md:w-2/3 h-screen bg-[#0a0a0a] border-l border-[#252525]"
        style={{ opacity: showAccessModule ? 0.7 : 1 }} // Dim the terminal when AccessModule is open
      >
        <div 
          className="flex items-center px-4 py-3 border-b"
          style={{ borderColor: colors.primary, backgroundColor: '#131313' }}
        >
          <Terminal className="mr-2" size={16} style={{ color: colors.primary }} />
          <span className="text-sm font-medium">Foundation Terminal</span>
          <div className="ml-auto flex space-x-1">
            <div 
              className="w-3 h-3 rounded-full cursor-pointer" 
              style={{ backgroundColor: colors.primary }}
              onClick={() => setShowAccessModule(false)}
            ></div>
            <div 
              className="w-3 h-3 rounded-full cursor-pointer" 
              style={{ backgroundColor: colors.secondary }}
              onClick={() => setOutput([])}
            ></div>
            <div 
              className="w-3 h-3 rounded-full cursor-pointer" 
              style={{ backgroundColor: colors.tertiary }}
              onClick={focusInput}
            ></div>
          </div>
        </div>
        
        <div 
          className="p-4 h-full overflow-y-auto font-mono text-sm"
          style={{ height: 'calc(100% - 49px)' }}
        >
          {output.map((line, index) => (
            <div 
              key={index} 
              className="mb-1"
              style={{ 
                color: line.startsWith('>') ? colors.light : 
                       line.includes('SCP') ? colors.primary : 
                       line.includes('CLEARANCE') || line.includes('LEVEL') ? colors.secondary : 
                       line.includes('successful') ? '#4ade80' :
                       line.includes('failed') || line.includes('denied') ? '#f87171' :
                       '#ccc' 
              }}
            >
              {line}
            </div>
          ))}
          
          <form onSubmit={handleCommand} className="flex items-center mt-2">
            <span className="mr-2" style={{ color: colors.primary }}>{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              style={{ color: colors.lightest }}
              autoFocus
              disabled={showAccessModule} // Disable input when AccessModule is open
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;