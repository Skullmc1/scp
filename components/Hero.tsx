import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Shield, Terminal, ChevronRight, Lock, Database, AlertTriangle, X } from 'lucide-react';

const Hero = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
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
      `CLEARANCE LEVEL: ${isMobile ? "LEVEL 2" : "LEVEL 3"}`,
      " ",
      "Type 'help' for available commands"
    ]);

    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    const newOutput = [...output, `> ${command}`];
    
    switch(command.toLowerCase()) {
      case 'help':
        newOutput.push("Available commands: about, access, database, clear, status");
        newOutput.push(" ");
        break;
      case 'about':
        newOutput.push("Secure. Contain. Protect.");
        newOutput.push("Global foundation for anomalous object research and containment.");
        newOutput.push(" ");
        break;
      case 'access':
        newOutput.push("Accessing main database...");
        newOutput.push("Authorization required. Please enter security credentials.");
        newOutput.push(" ");
        break;
      case 'database':
        newOutput.push("SCP database contains 7999+ entries");
        newOutput.push("Classified objects: 3472");
        newOutput.push("Keter-class: 483 | Euclid-class: 1923 | Safe-class: 5593");
        newOutput.push("Use 'access' command to proceed");
        newOutput.push(" ");
        break;
      case 'status':
        newOutput.push("System status: NOMINAL");
        newOutput.push("Security: ACTIVE");
        newOutput.push("Threat level: ELEVATED");
        newOutput.push(" ");
        break;
      case 'clear':
        setOutput([]);
        setCommand('');
        return;
      default:
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
    setCommand(item);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col md:flex-row"
      onClick={focusInput}
    >
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
          >
            <Database className="mr-3" size={20} style={{ color: colors.light }} />
            <span>Database Access</span>
            <ChevronRight className="ml-auto" size={20} style={{ color: colors.light }} />
          </button>
          
          <button 
            className="flex items-center w-full p-4 bg-[#1a1a1a] rounded-lg border border-[#252525] hover:border-[#cc444b] transition-colors"
            onClick={() => handleMenuItemClick('access')}
            style={{ borderLeft: `4px solid ${colors.primary}` }}
          >
            <Lock className="mr-3" size={20} style={{ color: colors.light }} />
            <span>Security Clearance</span>
            <ChevronRight className="ml-auto" size={20} style={{ color: colors.light }} />
          </button>
          
          <button 
            className="flex items-center w-full p-4 bg-[#1a1a1a] rounded-lg border border-[#252525] hover:border-[#cc444b] transition-colors"
            onClick={() => handleMenuItemClick('status')}
            style={{ borderLeft: `4px solid ${colors.primary}` }}
          >
            <AlertTriangle className="mr-3" size={20} style={{ color: colors.light }} />
            <span>System Status</span>
            <ChevronRight className="ml-auto" size={20} style={{ color: colors.light }} />
          </button>
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
      >
        <div 
          className="flex items-center px-4 py-3 border-b"
          style={{ borderColor: colors.primary, backgroundColor: '#131313' }}
        >
          <Terminal className="mr-2" size={16} style={{ color: colors.primary }} />
          <span className="text-sm font-medium">Foundation Terminal</span>
          <div className="ml-auto flex space-x-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors.primary }}
            ></div>
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors.secondary }}
            ></div>
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors.tertiary }}
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
                       line.includes('CLEARANCE') ? colors.secondary : 
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
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;