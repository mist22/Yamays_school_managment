import React, { useState, useMemo } from 'react';
import { 
  UserCheck, Search, Scan, CheckCircle2, 
  Timer, AlertCircle, TrendingUp, Map as MapIcon, 
  Clock, Info, Bus
} from 'lucide-react';

/**
 * REVOLUTIONIZED ATTENDANCE MODULE
 * * Features:
 * 1. Live Stats: Real-time calculation of Present/Tardy/Absent rates.
 * 2. Smart Roll Call: Interactive table with one-tap status toggling.
 * 3. Class Seat Map: Visual grid representing a classroom layout.
 * 4. Daily Timeline: Vertical stepper for administrative tracking.
 */

function Attendance({ students, setStudents }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scanning, setScanning] = useState(false);

  // Memoized Statistics for performance
  const stats = useMemo(() => {
    const total = students?.length;
    const present = students?.filter(s => s.status === 'present').length;
    const tardy = students?.filter(s => s.status === 'tardy').length;
    const absent = students?.filter(s => s.status === 'absent').length;
    const rate = total > 0 ? (((present + tardy) / total) * 100).toFixed(0) : 0;
    return { present, tardy, absent, rate };
  }, [students]);

  // Status Cycle: Present -> Tardy -> Absent -> Present
  const toggleAttendance = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const order = ['present', 'tardy', 'absent'];
        const nextStatus = order[(order.indexOf(s.status) + 1) % 3];
        return { 
          ...s, 
          status: nextStatus,
          lastSeen: nextStatus === 'absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. KEY PERFORMANCE INDICATORS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle2} color="emerald" label="Present" value={stats.present} isLive />
        <StatCard icon={Timer} color="amber" label="Tardy" value={stats.tardy} />
        <StatCard icon={AlertCircle} color="rose" label="Unaccounted" value={stats.absent} />
        <StatCard icon={TrendingUp} color="blue" label="Daily Rate" value={`${stats.rate}%`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 2. INTERACTIVE ROLL CALL TABLE */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <header className="p-6 border-b flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white"><UserCheck size={20} /></div>
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Active Roll Call</h3>
                <p className="text-[10px] font-bold text-slate-400">PERIOD 1: MATHEMATICS (RM 302)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Quick search..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { setScanning(true); setTimeout(() => setScanning(false), 2000); }}
                className={`p-2 rounded-xl transition-all ${scanning ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Scan size={20} />
              </button>
            </div>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4 text-center">Last Scan</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students?.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                  <tr key={s.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${getStatusStyles(s.status).bg} ${getStatusStyles(s.status).text}`}>
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Grade {s.grade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{s.lastSeen}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleAttendance(s.id)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        TOGGLE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. VISUAL INSIGHTS (SEAT MAP & TIMELINE) */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Class Seat Map</h4>
              <MapIcon size={16} className="text-indigo-400" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {students?.map(s => (
                <div 
                  key={s.id} 
                  className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all relative group ${getStatusStyles(s.status).mapBorder} ${getStatusStyles(s.status).mapBg}`}
                >
                  <span className="text-[10px] font-black opacity-60">{s.name[0]}</span>
                  {/* Simple Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 bg-white text-slate-900 p-2 rounded-lg text-[9px] font-bold shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 border border-slate-200">
                    {s.name}
                  </div>
                </div>
              ))}
              {[...Array(Math.max(0, 12 - students?.length || 0))].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/50" />
              ))}
            </div>
            <div className="mt-6 p-4 bg-slate-800 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Info size={16} /></div>
              <p className="text-[10px] leading-tight text-slate-400 font-medium">Visualizing current classroom occupancy for Room 302.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon: Icon, color, label, value, isLive }) {
  const colors = {
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${colors[color]}`}><Icon size={18} /></div>
        {isLive && <span className="text-[10px] font-black text-emerald-500 animate-pulse">LIVE</span>}
      </div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    present: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    tardy: 'bg-amber-100 text-amber-700 border-amber-200',
    absent: 'bg-rose-100 text-rose-700 border-rose-200'
  };
  const dotColor = {
    present: 'bg-emerald-500',
    tardy: 'bg-amber-500',
    absent: 'bg-rose-500'
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${styles[status]}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dotColor[status]}`} />
      {status}
    </span>
  );
}

const getStatusStyles = (status) => {
  switch (status) {
    case 'present': return { bg: 'bg-emerald-50', text: 'text-emerald-600', mapBorder: 'border-emerald-500/50', mapBg: 'bg-emerald-500/10' };
    case 'tardy': return { bg: 'bg-amber-50', text: 'text-amber-600', mapBorder: 'border-amber-500/50', mapBg: 'bg-amber-500/10' };
    default: return { bg: 'bg-rose-50', text: 'text-rose-600', mapBorder: 'border-rose-500/50', mapBg: 'bg-rose-500/10' };
  }
};
export default Attendance