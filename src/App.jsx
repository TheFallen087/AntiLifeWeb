import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Shield, MessageSquare, Play, ChevronDown, Menu, X, Wifi, Clock, MapPin, Gamepad2, AlertTriangle, Copy, Check, TrendingUp, Award, HeartHandshake, Activity, Users, Server, BarChart3, Zap, BookOpen, Headphones, Terminal, Eye, Lock, Unlock, Volume2, VolumeX, Crosshair, Radio, Car, DollarSign, Briefcase, Home, Trophy, Star, Skull, Code, Database, Cpu, HardDrive } from 'lucide-react';

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playerCount, setPlayerCount] = useState(87);
  const [serverStatus, setServerStatus] = useState('online');
  const [copied, setCopied] = useState(false);
  const [glitchText, setGlitchText] = useState('ANTI LIFE');
  const [glitchActive, setGlitchActive] = useState(false);
  const [serverUptime, setServerUptime] = useState(99.7);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState(['ANTI LIFE TERMINAL v3.0.0', 'Type "help" for commands']);
  // Sound removed for cleaner experience
  const [matrixMode, setMatrixMode] = useState(false);
  const [konami, setKonami] = useState([]);
  const [accessLevel, setAccessLevel] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [magneticCursor, setMagneticCursor] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [secretsFound, setSecretsFound] = useState(0);
  const canvasRef = useRef(null);
  const shaderCanvasRef = useRef(null);
  const observerRefs = useRef([]);
  
  // Live in-game data simulation
  const [liveData, setLiveData] = useState({
    activeCops: 12,
    activeEMS: 8,
    activeMechanics: 5,
    ongoingHeists: 2,
    wantedPlayers: 3,
    activeChases: 1,
    code3Calls: 4
  });
  
  // Server metrics
  const [metrics, setMetrics] = useState({
    tickRate: 128,
    ping: 12,
    fps: 60,
    crashes: 0,
    cpu: 23,
    ram: 47,
    disk: 62,
    network: 156
  });
  
  // WebGL Shader Background
  useEffect(() => {
    const canvas = shaderCanvasRef.current;
    if (!canvas || reducedMotion) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    
    // Fragment shader with cyberpunk effects
    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_glitch;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouse = u_mouse / u_resolution.xy;
        
        // Create flowing energy lines
        float lines = 0.0;
        for(float i = 0.0; i < 5.0; i++) {
          float speed = (i + 1.0) * 0.5;
          float width = 0.001;
          float intensity = 0.5;
          float y = sin(st.x * 10.0 + u_time * speed + i * 2.0) * 0.1 + 0.5 + i * 0.1;
          lines += intensity / abs(st.y - y) * width;
        }
        
        // Radial gradient from mouse
        float dist = distance(st, mouse);
        float glow = 0.1 / dist;
        
        // Glitch effect
        vec2 glitchOffset = vec2(0.0);
        if (u_glitch > 0.5) {
          glitchOffset.x = (random(vec2(u_time * 0.1)) - 0.5) * 0.01;
          glitchOffset.y = (random(vec2(u_time * 0.2)) - 0.5) * 0.01;
        }
        
        // Chromatic aberration
        float r = lines + glow;
        float g = lines * 0.9 + glow * 0.8;
        float b = lines * 0.8 + glow * 1.2;
        
        // Add noise
        float n = noise(st * 100.0 + u_time * 0.1) * 0.05;
        
        // Final color with glitch
        vec3 color = vec3(r + n, g + n, b + n) * 0.15;
        color += vec3(
          texture2D(u_texture, st + glitchOffset + vec2(0.001, 0.0)).r,
          texture2D(u_texture, st + glitchOffset).g,
          texture2D(u_texture, st + glitchOffset - vec2(0.001, 0.0)).b
        ) * 0.0; // Disabled texture for now
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    
    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    
    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    // Set up geometry
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const glitchLocation = gl.getUniformLocation(program, 'u_glitch');
    
    let animationId;
    const render = (time) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mousePos.x, canvas.height - mousePos.y);
      gl.uniform1f(glitchLocation, glitchActive ? 1.0 : 0.0);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };
    
    render(0);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [mousePos, glitchActive, reducedMotion]);
  
  // Magnetic cursor effect
  useEffect(() => {
    if (!magneticCursor || reducedMotion) return;
    
    const handleMouseMove = (e) => {
      const elements = document.querySelectorAll('.magnetic');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(e.clientX - x, 2) + Math.pow(e.clientY - y, 2));
        
        if (dist < 100) {
          const angle = Math.atan2(e.clientY - y, e.clientX - x);
          const force = (100 - dist) / 100;
          el.style.transform = `translate(${Math.cos(angle) * force * 10}px, ${Math.sin(angle) * force * 10}px)`;
        } else {
          el.style.transform = '';
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [magneticCursor, reducedMotion]);
  
  // Intersection Observer for lazy loading and animations
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (!reducedMotion) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(callback, options);
    
    observerRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, [reducedMotion]);
  
  // Achievement system
  const unlockAchievement = useCallback((id, title, description) => {
    if (achievements.includes(id)) return;
    
    setAchievements(prev => [...prev, id]);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-black border border-yellow-500 p-4 rounded-lg z-[200] animate-slideIn';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <div>
          <h4 class="font-bold text-yellow-500">Achievement Unlocked!</h4>
          <p class="text-sm text-gray-400">${title}</p>
          <p class="text-xs text-gray-500">${description}</p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }, [achievements]);
  
  // Terminal commands with achievements
  const executeCommand = useCallback((cmd) => {
    const parts = cmd.toLowerCase().split(' ');
    const command = parts[0];
    
    switch(command) {
      case 'help':
        return ['Available commands:', 'status - Server status', 'players - List online players', 'police - Police activity', 'staff - Staff list', 'clear - Clear terminal', 'matrix - Enter the matrix', 'hack - ???', 'admin - Admin login', 'credits - Show credits', 'achievements - List achievements'];
      
      case 'status':
        return [`Server Status: ${serverStatus.toUpperCase()}`, `Players: ${playerCount}/128`, `Uptime: ${serverUptime}%`, `CPU: ${metrics.cpu}%`, `RAM: ${metrics.ram}%`];
      
      case 'players':
        return [`Active Players: ${playerCount}`, `Cops: ${liveData.activeCops}`, `EMS: ${liveData.activeEMS}`, `Mechanics: ${liveData.activeMechanics}`];
      
      case 'police':
        return [`Active Officers: ${liveData.activeCops}`, `Active Chases: ${liveData.activeChases}`, `Code 3 Calls: ${liveData.code3Calls}`, `Wanted Suspects: ${liveData.wantedPlayers}`];
      
      case 'hack':
        if (parts[1] === 'mainframe') {
          unlockAchievement('hacker', 'Elite Hacker', 'Successfully hacked the mainframe');
          setAccessLevel(prev => prev + 10);
          return ['ACCESS GRANTED', 'Mainframe compromised...', 'Downloading server files...', 'Access level increased'];
        }
        return ['Usage: hack <target>', 'Available targets: mainframe, database, firewall'];
      
      case 'admin':
        if (parts[1] === 'shadow' && parts[2] === '1337') {
          unlockAchievement('admin', 'Admin Access', 'Logged in as administrator');
          setAccessLevel(99);
          return ['Welcome, Administrator', 'Full access granted'];
        }
        return ['Access denied', 'Usage: admin <username> <password>'];
      
      case 'matrix':
        setMatrixMode(true);
        unlockAchievement('redpill', 'Red Pill', 'Entered the Matrix');
        setTimeout(() => setMatrixMode(false), 10000);
        return ['MATRIX MODE ACTIVATED', 'Follow the white rabbit...'];
      
      case 'credits':
        return ['ANTI LIFE ROLEPLAY', 'Created by Shadow & Team', 'Website by Elite Developer', 'Special thanks to the community'];
      
      case 'achievements':
        return [`Achievements unlocked: ${achievements.length}`, ...achievements.map(a => `- ${a}`)];
      
      case 'clear':
        setTerminalHistory(['ANTI LIFE TERMINAL v3.0.0', 'Type "help" for commands']);
        return [];
      
      default:
        if (command === 'sudo' || command === 'rm') {
          return ['Nice try, but this isn\'t a real terminal ;)'];
        }
        return [`Command not found: ${command}`, 'Type "help" for available commands'];
    }
  }, [serverStatus, playerCount, serverUptime, metrics, liveData, achievements, unlockAchievement]);
  
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    
    const newHistory = [...terminalHistory, `> ${terminalInput}`, ...executeCommand(terminalInput)];
    setTerminalHistory(newHistory.slice(-50));
    setTerminalInput('');
  };
  
  // Ripple effect
  const createRipple = useCallback((e) => {
    if (reducedMotion) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { id, x, y, target: button }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
  }, [reducedMotion]);
  
  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChance = Math.random();
      if (glitchChance > 0.95) {
        const glitchTexts = ['ĄŇŦĮ ŁĮFĘ', '4NT1 L1F3', 'ΛПƬł ŁIFΣ', '▓▒░ANTI░▒▓', 'A̸N̸T̸I̸ ̸L̸I̸F̸E̸', '₳₦₮ł Ⱡł₣Ɇ'];
        setGlitchText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
        setGlitchActive(true);
        setTimeout(() => {
          setGlitchText('ANTI LIFE');
          setGlitchActive(false);
        }, 100);
      }
    }, 100);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Konami code and other secret keybinds
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    const handleKeyPress = (e) => {
      // Check for reduced motion toggle
      if (e.ctrlKey && e.key === 'm') {
        setReducedMotion(prev => !prev);
        return;
      }
      
      // Check for high contrast toggle
      if (e.ctrlKey && e.key === 'h') {
        setHighContrast(prev => !prev);
        return;
      }
      
      // Terminal shortcut
      if (e.ctrlKey && e.key === '`') {
        setTerminalOpen(prev => !prev);
        return;
      }
      
      // Konami code
      const newKonami = [...konami, e.key];
      setKonami(newKonami.slice(-10));
      
      if (newKonami.slice(-10).join('') === konamiCode.join('')) {
        setMatrixMode(true);
        setAccessLevel(99);
        setMagneticCursor(true);
        unlockAchievement('konami', 'Konami Master', 'Entered the legendary code');
        setTimeout(() => setMatrixMode(false), 10000);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [konami, unlockAchievement]);
  
  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Simulate real-time data with Web Workers
  useEffect(() => {
    const worker = new Worker(URL.createObjectURL(new Blob([`
      let interval;
      
      self.onmessage = function(e) {
        if (e.data === 'start') {
          interval = setInterval(() => {
            self.postMessage({
              playerCount: Math.max(50, Math.min(128, Math.floor(Math.random() * 128))),
              metrics: {
                tickRate: Math.min(128, Math.max(120, 124 + (Math.random() * 8 - 4))),
                ping: Math.min(20, Math.max(8, 12 + (Math.random() * 4 - 2))),
                fps: Math.min(64, Math.max(58, 60 + (Math.random() * 4 - 2))),
                cpu: Math.min(40, Math.max(15, 25 + (Math.random() * 10 - 5))),
                ram: Math.min(60, Math.max(40, 47 + (Math.random() * 6 - 3))),
                network: Math.min(300, Math.max(100, 156 + (Math.random() * 40 - 20)))
              },
              liveData: {
                activeCops: Math.max(5, Math.min(20, 12 + Math.floor(Math.random() * 6 - 3))),
                activeEMS: Math.max(3, Math.min(15, 8 + Math.floor(Math.random() * 6 - 3))),
                activeMechanics: Math.max(2, Math.min(10, 5 + Math.floor(Math.random() * 4 - 2))),
                ongoingHeists: Math.max(0, Math.min(5, Math.floor(Math.random() * 6))),
                wantedPlayers: Math.max(0, Math.min(10, Math.floor(Math.random() * 11))),
                activeChases: Math.max(0, Math.min(3, Math.floor(Math.random() * 4))),
                code3Calls: Math.max(0, Math.min(10, Math.floor(Math.random() * 11)))
              }
            });
          }, 3000);
        } else if (e.data === 'stop') {
          clearInterval(interval);
        }
      };
    `], { type: 'application/javascript' })));
    
    worker.postMessage('start');
    
    worker.onmessage = (e) => {
      setPlayerCount(e.data.playerCount);
      setMetrics(prev => ({ ...prev, ...e.data.metrics }));
      setLiveData(prev => ({ ...prev, ...e.data.liveData }));
    };
    
    return () => {
      worker.postMessage('stop');
      worker.terminate();
    };
  }, []);
  
  // Scroll handler with performance optimization
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText('connect anti-life.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const parallaxOffset = scrollY * 0.3;
  
  const updates = [
    { date: '2024-12-28', title: 'New Heist System Released', type: 'feature' },
    { date: '2024-12-23', title: 'Anti-Cheat Update v2.3', type: 'security' },
    { date: '2024-12-20', title: 'Performance Optimizations', type: 'update' }
  ];
  
  const staff = [
    { name: 'Five', role: 'Owner/Developer', status: 'online', avatar: '👤', bio: '6+ years FiveM development' },
    { name: 'Hemlox', role: 'Owner/Developer', status: 'online', avatar: '🛡️', bio: 'Community management specialist' },
    { name: 'Skeeter', role: 'Owner', status: 'busy', avatar: '💻', bio: 'Some Redneck' },
  ];

  return (
    <div className={`bg-black text-white overflow-x-hidden min-h-screen ${matrixMode ? 'matrix-mode' : ''} ${highContrast ? 'high-contrast' : ''}`}>
      {/* WebGL Shader Canvas */}
      <canvas ref={shaderCanvasRef} className="fixed inset-0 pointer-events-none opacity-50" />
      
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30" />
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-ripple"
          style={{
            left: ripple.x + 'px',
            top: ripple.y + 'px',
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      {/* Terminal overlay */}
      {terminalOpen && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-black border border-green-500 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl shadow-green-500/20">
            <div className="bg-green-500/20 p-4 flex justify-between items-center border-b border-green-500/30">
              <h3 className="font-mono text-green-400 flex items-center space-x-2">
                <Terminal className="w-5 h-5" />
                <span>ANTI LIFE TERMINAL</span>
              </h3>
              <button onClick={() => setTerminalOpen(false)} className="text-green-400 hover:text-green-300 magnetic">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 h-96 overflow-y-auto font-mono text-sm text-green-400 custom-scrollbar">
              {terminalHistory.map((line, i) => (
                <div key={i} className={`mb-1 ${line.startsWith('>') ? 'text-green-300' : ''}`}>
                  {line}
                </div>
              ))}
            </div>
            <form onSubmit={handleTerminalSubmit} className="p-4 border-t border-green-500/30">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-green-400 font-mono"
                  placeholder="Enter command..."
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Achievement display */}
      {achievements.length > 0 && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-black/80 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-yellow-500">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-mono">{achievements.length} Achievements</span>
            </div>
          </div>
        </div>
      )}

      {/* Animated grid background */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${matrixMode ? '#00ff00' : 'white'} 1px, transparent 1px), linear-gradient(90deg, ${matrixMode ? '#00ff00' : 'white'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: `translateY(${parallaxOffset}px)`,
        }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-white/10 glass-morphism">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div 
              className="relative w-10 h-10 group cursor-pointer magnetic" 
              onClick={() => {
                setAccessLevel(prev => prev + 1);
                if (accessLevel === 9) {
                  unlockAchievement('curious', 'Curiosity', 'Clicked the logo 10 times');
                }
              }}
            >
              <div className="absolute inset-0 bg-white/20 blur-xl animate-pulse" />
              <svg className="w-10 h-10 relative z-10" viewBox="0 0 40 40">
                <defs>
                  <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={matrixMode ? '#00ff00' : 'white'} stopOpacity="0.2" />
                    <stop offset="50%" stopColor={matrixMode ? '#00ff00' : 'white'} stopOpacity="1" />
                    <stop offset="100%" stopColor={matrixMode ? '#00ff00' : 'white'} stopOpacity="0.2" />
                    <animate attributeName="x1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="y1" values="0%;100%;0%" dur="3s" repeatCount="indefinite" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <path d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z" 
                      fill="none" 
                      stroke="url(#hexGradient)" 
                      strokeWidth="2"
                      filter="url(#glow)" />
                <circle cx="20" cy="20" r="3" fill={matrixMode ? '#00ff00' : 'white'}>
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                </circle>
                
                {/* Access level indicator */}
                {accessLevel > 5 && (
                  <text x="20" y="25" textAnchor="middle" className="text-xs fill-current" opacity="0.5">
                    {accessLevel === 99 ? '∞' : accessLevel}
                  </text>
                )}
              </svg>
            </div>
            <span className={`text-2xl font-bold tracking-widest ${glitchActive ? 'glitch-text' : ''} ${matrixMode ? 'text-green-400' : ''}`}>
              {glitchText}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Accessibility controls */}
            <div className="hidden md:flex items-center space-x-2 text-xs">
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`p-1 rounded ${reducedMotion ? 'bg-white/20' : ''}`}
                title="Toggle reduced motion"
              >
                <Activity className="w-4 h-4" />
              </button>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-1 rounded ${highContrast ? 'bg-white/20' : ''}`}
                title="Toggle high contrast"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            {/* Terminal button */}
            <button
              onClick={() => setTerminalOpen(true)}
              className="p-2 hover:bg-white/10 rounded transition-colors magnetic terminal-glow"
              title="Open terminal (Ctrl+`)"
            >
              <Terminal className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden z-50"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-black/95 md:bg-transparent p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-8`}>
            {['Home', 'Live', 'Features', 'Staff', 'Rules', 'Support'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link hover:text-gray-400 transition-colors tracking-wider text-sm uppercase magnetic"
                onClick={() => {
                  setMenuOpen(false);
                }}
                onMouseEnter={() => {
                  setHoveredElement(item);
                }}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {item}
                {hoveredElement === item && (
                  <span className="absolute bottom-0 left-0 w-full h-px bg-white transform scale-x-100 transition-transform" />
                )}
              </a>
            ))}
            <a
              href="https://discord.gg/antilife"
              className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-all duration-300 magnetic hover-lift"
              onClick={(e) => {
                createRipple(e);
              }}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-semibold">Discord</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Live Stats */}
      <section id="home" className="min-h-screen flex items-center justify-center relative" ref={el => observerRefs.current[0] = el}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="text-center z-10 px-6 max-w-6xl mx-auto">
          <div className="mb-8 relative inline-block">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 bg-white/10 blur-3xl animate-pulse scale-150" />
              <svg className="w-40 h-40 relative z-10" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={matrixMode ? '#00ff00' : 'white'} stopOpacity="0.1" />
                    <stop offset="50%" stopColor={matrixMode ? '#00ff00' : 'white'} stopOpacity="1" />
                    <stop offset="100%" stopColor={matrixMode ? '#00ff00' : 'white'} stopOpacity="0.1" />
                    <animate attributeName="x1" values="0%;100%;0%" dur="4s" repeatCount="indefinite" />
                  </linearGradient>
                  <filter id="chromatic">
                    <feOffset in="SourceGraphic" dx="2" dy="0" result="r" />
                    <feOffset in="SourceGraphic" dx="-2" dy="0" result="b" />
                    <feBlend mode="screen" in="r" in2="SourceGraphic" result="rb" />
                    <feBlend mode="screen" in="rb" in2="b" />
                  </filter>
                </defs>
                
                <path d="M50 10 L80 25 L80 75 L50 90 L20 75 L20 25 Z" 
                      fill="none" 
                      stroke="url(#mainGradient)" 
                      strokeWidth="3"
                      filter={glitchActive ? "url(#chromatic)" : ""} />
                <circle cx="50" cy="50" r="8" fill={matrixMode ? '#00ff00' : 'white'}>
                  <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                </circle>
                
                {/* Rotating data streams */}
                <g className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '20s' }}>
                  {[...Array(6)].map((_, i) => (
                    <text
                      key={i}
                      x="50"
                      y="15"
                      className="text-xs fill-current opacity-20 font-mono"
                      transform={`rotate(${i * 60} 50 50)`}
                    >
                      {matrixMode ? '01010101' : 'DATAFEED'}
                    </text>
                  ))}
                </g>
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-widest animate-fade-in hero-text">
            {matrixMode ? 'MATRIX MODE' : 'ANTI LIFE'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 tracking-wide">
            HARDCORE ROLEPLAY • EST. 2022 • VERIFIED PROVIDER
          </p>
          
          {/* Enhanced live server metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
            <div className="stat-card bg-white/5 backdrop-blur-sm p-4 rounded border border-white/10 group hover:bg-white/10 transition-all cursor-pointer glass-morphism">
              <Activity className="w-5 h-5 mb-2 mx-auto text-green-400 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold font-mono">{playerCount}/128</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Players</div>
              <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-green-400 transition-all duration-500 shimmer" style={{ width: `${(playerCount / 128) * 100}%` }} />
              </div>
            </div>
            <div className="stat-card bg-white/5 backdrop-blur-sm p-4 rounded border border-white/10 group hover:bg-white/10 transition-all cursor-pointer glass-morphism">
              <TrendingUp className="w-5 h-5 mb-2 mx-auto text-blue-400 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold font-mono">{serverUptime}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Uptime</div>
              <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-400 transition-all duration-500 shimmer" style={{ width: `${serverUptime}%` }} />
              </div>
            </div>
            <div className="stat-card bg-white/5 backdrop-blur-sm p-4 rounded border border-white/10 group hover:bg-white/10 transition-all cursor-pointer glass-morphism">
              <Zap className="w-5 h-5 mb-2 mx-auto text-yellow-400 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold font-mono">{Math.floor(metrics.ping)}ms</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Ping</div>
              <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-yellow-400 transition-all duration-500 shimmer" style={{ width: `${Math.max(10, 100 - metrics.ping * 2)}%` }} />
              </div>
            </div>
            <div className="stat-card bg-white/5 backdrop-blur-sm p-4 rounded border border-white/10 group hover:bg-white/10 transition-all cursor-pointer glass-morphism">
              <Server className="w-5 h-5 mb-2 mx-auto text-purple-400 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold font-mono">{Math.floor(metrics.fps)} FPS</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Server FPS</div>
              <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-purple-400 transition-all duration-500 shimmer" style={{ width: `${(metrics.fps / 64) * 100}%` }} />
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              copyToClipboard();
              createRipple(e);
            }}
            className="group relative px-8 py-4 bg-white text-black font-bold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 magnetic hover-lift"
          >
            <span className="relative z-10 flex items-center space-x-2">
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>CONNECT NOW</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            
            {/* Glitch effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
              <div className="absolute inset-0 bg-white/10 transform translate-x-1 translate-y-1" />
              <div className="absolute inset-0 bg-black/10 transform -translate-x-1 -translate-y-1" />
            </div>
          </button>
          
          <p className="mt-4 text-sm text-gray-500">
            connect anti-life.com {accessLevel > 10 && <span className="text-xs opacity-50">[ACCESS LEVEL {accessLevel}]</span>}
          </p>
        </div>

        <ChevronDown className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-8 animate-bounce" />
      </section>

      {/* Live In-Game Data Section */}
      <section id="live" className="py-20 px-6 border-y border-white/10 bg-white/2" ref={el => observerRefs.current[1] = el}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 tracking-widest hero-text">
            LIVE SERVER DATA
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Real-time information from Los Santos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Services */}
            <div className="data-card bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-white/10 glass-morphism hover-lift">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Radio className="w-5 h-5 mr-2 text-blue-400" />
                ACTIVE SERVICES
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-sm text-gray-400">Police Officers</span>
                  <span className="font-mono text-blue-400">{liveData.activeCops}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-sm text-gray-400">EMS Personnel</span>
                  <span className="font-mono text-red-400">{liveData.activeEMS}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-sm text-gray-400">Mechanics</span>
                  <span className="font-mono text-yellow-400">{liveData.activeMechanics}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-white/10">
                  <div className="flex justify-between items-center p-2 rounded bg-white/5">
                    <span className="text-sm text-gray-400">Total Services</span>
                    <span className="font-mono text-green-400 font-bold">{liveData.activeCops + liveData.activeEMS + liveData.activeMechanics}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Criminal Activity */}
            <div className="data-card bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-white/10 glass-morphism hover-lift">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                CRIMINAL ACTIVITY
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-sm text-gray-400">Active Heists</span>
                  <span className={`font-mono ${liveData.ongoingHeists > 0 ? 'text-red-400 animate-pulse' : ''}`}>
                    {liveData.ongoingHeists}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-sm text-gray-400">Wanted Players</span>
                  <span className="font-mono text-orange-400">{liveData.wantedPlayers}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-sm text-gray-400">Active Chases</span>
                  <span className={`font-mono ${liveData.activeChases > 0 ? 'text-yellow-400 animate-pulse' : ''}`}>
                    {liveData.activeChases}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
                  <span className="text-sm text-gray-400">Code 3 Calls</span>
                  <span className="font-mono text-red-400">{liveData.code3Calls}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Server Resources */}
          <div className="mt-12 bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-white/10 glass-morphism hover-lift">
            <h3 className="text-2xl font-bold mb-6 text-center">SERVER RESOURCES</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="resource-meter">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center">
                    <Cpu className="w-4 h-4 mr-1" />
                    CPU Usage
                  </span>
                  <span className="text-sm font-mono">{Math.floor(metrics.cpu)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div className={`h-full transition-all duration-500 relative ${
                    metrics.cpu < 50 ? 'bg-green-400' : metrics.cpu < 75 ? 'bg-yellow-400' : 'bg-red-400'
                  }`} style={{ width: `${metrics.cpu}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    <div className="absolute inset-0 shimmer" />
                  </div>
                </div>
              </div>
              
              <div className="resource-meter">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center">
                    <Database className="w-4 h-4 mr-1" />
                    RAM Usage
                  </span>
                  <span className="text-sm font-mono">{Math.floor(metrics.ram)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div className={`h-full transition-all duration-500 relative ${
                    metrics.ram < 60 ? 'bg-blue-400' : metrics.ram < 80 ? 'bg-yellow-400' : 'bg-red-400'
                  }`} style={{ width: `${metrics.ram}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    <div className="absolute inset-0 shimmer" />
                  </div>
                </div>
              </div>
              
              <div className="resource-meter">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400 flex items-center">
                    <HardDrive className="w-4 h-4 mr-1" />
                    Disk Usage
                  </span>
                  <span className="text-sm font-mono">{Math.floor(metrics.disk)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div className={`h-full transition-all duration-500 relative ${
                    metrics.disk < 70 ? 'bg-purple-400' : metrics.disk < 85 ? 'bg-yellow-400' : 'bg-red-400'
                  }`} style={{ width: `${metrics.disk}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    <div className="absolute inset-0 shimmer" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Network stats */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Network Traffic</span>
                <span className="font-mono text-green-400">{metrics.network} Mbps</span>
              </div>
              <div className="mt-2 h-12 bg-gray-900 rounded overflow-hidden relative">
                <div className="absolute inset-0 flex items-end">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-green-400/20 mr-px transition-all duration-300"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Server Updates & Announcements */}
      <section className="py-20 px-6" ref={el => observerRefs.current[2] = el}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 tracking-widest hero-text">
            SERVER STATUS
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Real-time updates and announcements
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Updates Feed */}
            <div className="update-card bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 glass-morphism hover-lift">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-green-400" />
                RECENT UPDATES
              </h3>
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-4 bg-black/30 rounded hover:bg-black/50 transition-all duration-300 group cursor-pointer hover-lift"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      update.type === 'feature' ? 'bg-blue-400' :
                      update.type === 'event' ? 'bg-yellow-400' :
                      update.type === 'security' ? 'bg-green-400' :
                      'bg-gray-400'
                    } group-hover:animate-pulse`} />
                    <div className="flex-1">
                      <h4 className="font-semibold">{update.title}</h4>
                      <p className="text-sm text-gray-500">{update.date}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 transform -rotate-90 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
              <button 
                className="mt-6 text-sm text-gray-400 hover:text-white transition-colors magnetic"
              >
                View all updates →
              </button>
            </div>

            {/* Performance Metrics */}
            <div className="perf-card bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 glass-morphism hover-lift">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />
                PERFORMANCE METRICS
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Server Tick Rate</span>
                    <span className="text-sm font-mono">{Math.floor(metrics.tickRate)}/128</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500 relative"
                         style={{ width: `${(metrics.tickRate / 128) * 100}%` }}>
                      <div className="absolute inset-0 shimmer" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Average Ping</span>
                    <span className="text-sm font-mono">{Math.floor(metrics.ping)}ms</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500 relative"
                         style={{ width: `${Math.max(10, 100 - (metrics.ping * 2))}%` }}>
                      <div className="absolute inset-0 shimmer" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Server FPS</span>
                    <span className="text-sm font-mono">{Math.floor(metrics.fps)}/64</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500 relative"
                         style={{ width: `${(metrics.fps / 64) * 100}%` }}>
                      <div className="absolute inset-0 shimmer" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="stat-bubble">
                      <div className="text-2xl font-bold text-green-400">{metrics.crashes}</div>
                      <div className="text-xs text-gray-500 uppercase">Crashes (7 days)</div>
                    </div>
                    <div className="stat-bubble">
                      <div className="text-2xl font-bold text-blue-400">5s</div>
                      <div className="text-xs text-gray-500 uppercase">Avg. Restart Time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white/2" ref={el => observerRefs.current[3] = el}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 tracking-widest hero-text">
            WHY ANTI LIFE?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Gamepad2 />, title: "CUSTOM FRAMEWORK", desc: "Built from scratch with 300+ unique scripts", highlight: "v3.0" },
              { icon: <Shield />, title: "ENTERPRISE SECURITY", desc: "Military-grade anti-cheat with AI detection", highlight: "99.9%" },
              { icon: <Users />, title: "ACTIVE DEVELOPMENT", desc: "Weekly updates and community-driven features", highlight: "WEEKLY" },
              { icon: <Server />, title: "PREMIUM HOSTING", desc: "Dedicated hardware with NVMe storage", highlight: "10Gbps" },
              { icon: <BookOpen />, title: "DOCUMENTATION", desc: "Comprehensive guides and video tutorials", highlight: "100+" },
              { icon: <Headphones />, title: "SUPPORT SYSTEM", desc: "Average response time under 5 minutes", highlight: "24/7" }
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card group relative p-8 border border-white/10 hover:border-white/30 transition-all duration-300 bg-gradient-to-br from-white/5 to-transparent overflow-hidden glass-morphism hover-lift"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 bg-white/10 px-2 py-1 rounded">
                  {feature.highlight}
                </div>
                
                <div className="relative z-10">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 magnetic">
                    {React.cloneElement(feature.icon, { className: "w-12 h-12" })}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 tracking-wider">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
                
                {/* Hover effect lines */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section with Enhanced Interactivity */}
      <section id="staff" className="py-20 px-6" ref={el => observerRefs.current[4] = el}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 tracking-widest hero-text">
            MEET THE TEAM
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Professional staff committed to your experience
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map((member, index) => (
              <div
                key={index}
                className="staff-card relative group cursor-pointer magnetic"
                onClick={() => {
                  setSelectedStaff(selectedStaff === index ? null : index);
                }}
              >
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-300 h-full overflow-hidden glass-morphism hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform">{member.avatar}</div>
                    <div className={`w-3 h-3 rounded-full ${
                      member.status === 'online' ? 'bg-green-400' :
                      member.status === 'busy' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    } animate-pulse`} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{member.role}</p>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${
                    selectedStaff === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-sm text-gray-300 pt-3 border-t border-white/10">
                      {member.bio}
                    </p>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Our staff undergoes rigorous training and background checks
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center hover-lift">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm text-gray-500">ACTIVE STAFF</div>
              </div>
              <div className="text-center hover-lift">
                <div className="text-3xl font-bold">5min</div>
                <div className="text-sm text-gray-500">AVG RESPONSE</div>
              </div>
              <div className="text-center hover-lift">
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-sm text-gray-500">SATISFACTION</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Section - Enhanced */}
      <section id="rules" className="py-20 px-6 bg-white/2" ref={el => observerRefs.current[5] = el}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 tracking-widest hero-text">
            SERVER RULES
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Enforced by automated systems and active moderation
          </p>

          <div className="space-y-6">
            {[
              { rule: "NO METAGAMING", desc: "Keep IC and OOC information separate", penalty: "3 day ban", icon: <Eye /> },
              { rule: "NO RDM/VDM", desc: "All actions must have roleplay reasoning", penalty: "7 day ban", icon: <Crosshair /> },
              { rule: "RESPECT ALL PLAYERS", desc: "Toxicity results in permanent ban", penalty: "Permanent", icon: <HeartHandshake /> },
              { rule: "STAY IN CHARACTER", desc: "Breaking character is prohibited", penalty: "Warning/Kick", icon: <Users /> },
              { rule: "NO EXPLOITING", desc: "Report bugs, don't abuse them", penalty: "Permanent", icon: <Lock /> },
              { rule: "FEAR RP", desc: "Value your character's life at all times", penalty: "1 day ban", icon: <AlertTriangle /> }
            ].map((item, index) => (
              <div
                key={index}
                className="rule-card flex items-start space-x-4 p-6 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 group glass-morphism hover-lift"
              >
                <span className="text-2xl font-bold text-gray-500">{(index + 1).toString().padStart(2, '0')}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {React.cloneElement(item.icon, { className: "w-5 h-5 text-gray-400 group-hover:text-white transition-colors" })}
                    <h3 className="text-xl font-bold">{item.rule}</h3>
                  </div>
                  <p className="text-gray-400 mb-2">{item.desc}</p>
                  <span className="text-xs text-red-400 font-mono">PENALTY: {item.penalty}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg glass-morphism hover-lift">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">ZERO TOLERANCE POLICY</h3>
                <p className="text-sm text-gray-300">
                  We use advanced anti-cheat systems and maintain detailed logs. 
                  All bans are reviewed by senior staff and include evidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 px-6" ref={el => observerRefs.current[6] = el}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 tracking-widest hero-text">
            GET SUPPORT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="support-card text-center p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/30 transition-all group glass-morphism hover-lift">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform magnetic" />
              <h3 className="text-2xl font-bold mb-2">DISCORD</h3>
              <p className="text-gray-400 mb-4">Join 5,000+ members</p>
              <a 
                href="https://discord.gg/antilife" 
                className="text-sm text-gray-300 hover:text-white transition-colors magnetic"
              >
                discord.gg/antilife →
              </a>
            </div>
            
            <div className="support-card text-center p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/30 transition-all group glass-morphism hover-lift">
              <BookOpen className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform magnetic" />
              <h3 className="text-2xl font-bold mb-2">WIKI</h3>
              <p className="text-gray-400 mb-4">Detailed documentation</p>
              <a 
                href="#" 
                className="text-sm text-gray-300 hover:text-white transition-colors magnetic"
              >
                wiki.anti-life.com →
              </a>
            </div>
            
            <div className="support-card text-center p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/30 transition-all group glass-morphism hover-lift">
              <Headphones className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform magnetic" />
              <h3 className="text-2xl font-bold mb-2">TICKETS</h3>
              <p className="text-gray-400 mb-4">Priority support system</p>
              <a 
                href="#" 
                className="text-sm text-gray-300 hover:text-white transition-colors magnetic"
              >
                support.anti-life.com →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="min-h-screen py-20 px-6 flex items-center" ref={el => observerRefs.current[7] = el}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-widest hero-text">
            JOIN THE REVOLUTION
          </h2>
          
          <p className="text-xl text-gray-400 mb-12">
            Experience the difference of a professionally managed server
          </p>

          <div className="space-y-8 mb-12">
            <div className="p-6 border border-white/20 bg-white/5 glass-morphism hover-lift">
              <h3 className="text-2xl font-bold mb-4">QUICK CONNECT</h3>
              <code className="text-lg bg-black p-4 block font-mono rounded">connect anti-life.com</code>
            </div>

            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
              <a
                href="https://discord.gg/antilife"
                className="flex items-center justify-center space-x-3 px-8 py-4 bg-white text-black font-bold hover:bg-gray-200 transition-colors magnetic hover-lift"
                onClick={(e) => {
                  createRipple(e);
                }}
              >
                <MessageSquare className="w-6 h-6" />
                <span>JOIN DISCORD</span>
              </a>
              
              <button
                onClick={(e) => {
                  copyToClipboard();
                  createRipple(e);
                }}
                className="flex items-center justify-center space-x-3 px-8 py-4 border border-white hover:bg-white hover:text-black transition-all duration-300 font-bold magnetic hover-lift"
              >
                <Copy className="w-6 h-6" />
                <span>COPY IP</span>
              </button>
            </div>
          </div>

          <div className="mt-16 pt-16 border-t border-white/10">
            <div 
              className="relative w-16 h-16 mx-auto mb-4 opacity-20 cursor-pointer"
              onClick={() => {
                setSecretsFound(prev => prev + 1);
                if (secretsFound === 4) {
                  unlockAchievement('explorer', 'Secret Explorer', 'Found all hidden secrets');
                }
              }}
            >
              <svg className="w-16 h-16" viewBox="0 0 100 100">
                <path d="M50 10 L80 25 L80 75 L50 90 L20 75 L20 25 Z" 
                      fill="none" 
                      stroke={matrixMode ? '#00ff00' : 'white'} 
                      strokeWidth="2" />
                <circle cx="50" cy="50" r="8" fill={matrixMode ? '#00ff00' : 'white'} />
              </svg>
            </div>
            <p className="text-gray-500">© 2024 ANTI LIFE ROLEPLAY. ALL RIGHTS RESERVED.</p>
            <p className="text-xs text-gray-600 mt-2">
              FiveM® is a registered trademark of Cfx.re
            </p>
            {secretsFound > 0 && (
              <p className="text-xs text-gray-700 mt-2">
                Secrets found: {secretsFound}/5
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(15);
            opacity: 0;
          }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
        
        .matrix-mode * {
          color: #00ff00 !important;
        }
        
        .matrix-mode .bg-white {
          background-color: #00ff00 !important;
        }
        
        .matrix-mode .text-black {
          color: #000000 !important;
        }
        
        .high-contrast {
          filter: contrast(1.5);
        }
        
        .high-contrast * {
          text-shadow: 0 0 1px rgba(255,255,255,0.5);
        }
        
        .glass-morphism {
          backdrop-filter: blur(10px) saturate(180%);
          -webkit-backdrop-filter: blur(10px) saturate(180%);
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(255,255,255,0.1);
        }
        
        .terminal-glow {
          box-shadow: 0 0 20px rgba(0,255,0,0.3);
        }
        
        .shimmer {
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.3) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          to {
            background-position-x: -200%;
          }
        }
        
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          animation: glitch-1 0.3s infinite;
          color: #ff0000;
          z-index: -1;
        }
        
        .glitch-text::after {
          animation: glitch-2 0.3s infinite;
          color: #00ffff;
          z-index: -2;
        }
        
        @keyframes glitch-1 {
          0% { clip-path: inset(40% 0 61% 0); }
          20% { clip-path: inset(92% 0 1% 0); }
          40% { clip-path: inset(43% 0 1% 0); }
          60% { clip-path: inset(25% 0 58% 0); }
          80% { clip-path: inset(54% 0 7% 0); }
          100% { clip-path: inset(58% 0 43% 0); }
        }
        
        @keyframes glitch-2 {
          0% { clip-path: inset(65% 0 8% 0); }
          20% { clip-path: inset(7% 0 28% 0); }
          40% { clip-path: inset(93% 0 7% 0); }
          60% { clip-path: inset(45% 0 46% 0); }
          80% { clip-path: inset(23% 0 75% 0); }
          100% { clip-path: inset(65% 0 8% 0); }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,255,0,0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,255,0,0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,255,0,0.7);
        }
        
        .hero-text {
          text-shadow: 0 0 40px rgba(255,255,255,0.3);
        }
        
        .visible {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default App;