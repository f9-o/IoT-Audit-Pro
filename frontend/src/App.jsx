import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldAlert, Activity, Play, Square, Wifi, WifiOff, Database, Globe } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('SIMULATION'); 
  const [target, setTarget] = useState('mosquitto');
  const [port, setPort] = useState(1883);
  const [topic, setTopic] = useState('test/fuzz');
  const [attackType, setAttackType] = useState('RANDOM_JUNK');
  
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isTargetAlive, setIsTargetAlive] = useState(null);
  const ws = useRef(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws');
    ws.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'log') {
        setLogs(prev => [...prev.slice(-99), msg.data]);
        if(logEndRef.current) logEndRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (msg.type === 'status') {
        setIsTargetAlive(msg.alive);
      }
    };
    return () => ws.current.close();
  }, []);

  const toggleMode = (newMode) => {
    setMode(newMode);
    setTarget(newMode === 'SIMULATION' ? 'mosquitto' : '');
  };

  const toggleAttack = () => {
    if (!ws.current) return;
    if (isRunning) {
      ws.current.send(JSON.stringify({ cmd: 'STOP' }));
      setIsRunning(false);
      setIsTargetAlive(null);
    } else {
      setLogs([]);
      ws.current.send(JSON.stringify({ cmd: 'START', target, port, topic, type: attackType }));
      setIsRunning(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <ShieldAlert className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">IoT Audit Pro</h1>
              <div className="flex gap-2 text-xs font-mono mt-1">
                <span className={mode === 'SIMULATION' ? "text-green-400" : "text-slate-600"}>LAB_MODE</span>
                <span className="text-slate-600">|</span>
                <span className={mode === 'REAL' ? "text-red-400" : "text-slate-600"}>LIVE_MODE</span>
              </div>
            </div>
          </div>
          
          {isRunning && (
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full border ${
              isTargetAlive 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse'
            }`}>
              {isTargetAlive ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              <span className="font-bold tracking-wider">{isTargetAlive ? "TARGET ONLINE" : "TARGET DOWN"}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 p-1 rounded-lg flex border border-slate-800">
              <button onClick={() => toggleMode('SIMULATION')} className={`flex-1 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 ${mode === 'SIMULATION' ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                <Database className="w-4 h-4" /> Lab Sim
              </button>
              <button onClick={() => toggleMode('REAL')} className={`flex-1 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 ${mode === 'REAL' ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'text-slate-500 hover:text-slate-300'}`}>
                <Globe className="w-4 h-4" /> Real World
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-5">
              <div>
                <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">Target IP</label>
                <input value={target} disabled={mode === 'SIMULATION'} onChange={e => setTarget(e.target.value)} className={`w-full bg-slate-950 border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 ${mode === 'SIMULATION' ? 'border-slate-800 text-slate-500 cursor-not-allowed' : 'border-slate-700 text-white focus:ring-red-500'}`} placeholder="192.168.1.X" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">Port</label>
                  <input value={port} onChange={e => setPort(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm font-mono text-white" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block uppercase font-bold">Type</label>
                  <select value={attackType} onChange={e => setAttackType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white">
                    <option value="RANDOM_JUNK">Junk Data</option>
                    <option value="SQL_INJECTION">SQL Injection</option>
                    <option value="JSON_FLOOD">JSON Flood</option>
                  </select>
                </div>
              </div>

              <button onClick={toggleAttack} className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold tracking-wide transition-all shadow-lg ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'}`}>
                {isRunning ? <><Square className="w-5 h-5 fill-current" /> STOP AUDIT</> : <><Play className="w-5 h-5 fill-current" /> START AUDIT</>}
              </button>
            </div>
          </div>

          {/* Terminal */}
          <div className="lg:col-span-2 flex flex-col h-[600px] bg-[#0c0c0c] rounded-xl border border-slate-800 overflow-hidden shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500 font-mono">live_packet_stream.log</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
              {logs.length === 0 && <div className="flex flex-col items-center justify-center h-full text-slate-700 space-y-4"><Activity className="w-12 h-12 opacity-20" /><p>System Ready. Waiting for target...</p></div>}
              {logs.map((log, i) => (
                <div key={i} className={`py-1 transition-colors ${log.includes("[!] TARGET ACQUIRED") ? "bg-red-900/20 border-l-2 border-red-500 pl-3" : "pl-3 border-l-2 border-transparent"}`}>
                  <span className="text-slate-600 mr-3">[{new Date().toLocaleTimeString()}]</span>
                  <span className={
                    log.includes("[!] TARGET ACQUIRED") ? "text-red-500 font-extrabold tracking-widest animate-pulse" :
                    log.includes("ERROR") || log.includes("FAILED") ? "text-red-400" :
                    log.includes("SENT") ? "text-cyan-400" :
                    log.includes("CONNECTED") ? "text-green-400" :
                    "text-slate-300"
                  }>{log}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;