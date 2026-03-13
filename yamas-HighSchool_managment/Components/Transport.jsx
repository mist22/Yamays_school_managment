import React, { useState, useMemo } from 'react';
import { 
  Bus, 
  MapPin, 
  Users, 
  Clock, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Navigation, 
  Phone, 
  Info,
  CheckCircle2,
  XCircle,
  UserPlus,
  Trash2,
} from 'lucide-react';

/**
 * ROBUST TRANSPORTATION & FLEET MANAGEMENT MODULE
 * * Updated: Driver Registration & Route Mapping System
 */

// Initial Mock Data for Drivers & Routes
const INITIAL_FLEET = [
  { id: 'B101', route: 'North District', driver: 'John Miller', license: 'TX-99201', status: 'on-time', occupancy: 42, capacity: 50, lastStop: 'High St.', eta: '8:05 AM', contact: '+1-555-0101' },
  { id: 'B102', route: 'East Valley', driver: 'Sarah Chen', license: 'TX-88312', status: 'delayed', occupancy: 28, capacity: 45, lastStop: 'Oak Park', eta: '8:25 AM', contact: '+1-555-0102' },
  { id: 'B103', route: 'West Ridge', driver: 'Mike Ross', license: 'TX-11204', status: 'on-time', occupancy: 15, capacity: 50, lastStop: 'Grand Ave', eta: '7:55 AM', contact: '+1-555-0103' },
  { id: 'B104', route: 'South Shore', driver: 'Elena Gomez', license: 'TX-44092', status: 'maintenance', occupancy: 0, capacity: 45, lastStop: 'Depot', eta: '-', contact: '+1-555-0104' },
];

function Transport() {
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRegistration, setShowRegistration] = useState(false);
  
  // New Driver Form State
  const [newDriver, setNewDriver] = useState({
    id: '', route: '', driver: '', license: '', status: 'on-time', capacity: 50, contact: ''
  });

  const stats = useMemo(() => {
    const active = fleet.filter(b => b.status !== 'maintenance').length;
    const delayed = fleet.filter(b => b.status === 'delayed').length;
    const totalOccupancy = fleet.reduce((acc, b) => acc + b.occupancy, 0);
    const totalCapacity = fleet.reduce((acc, b) => acc + (parseInt(b.capacity) || 0), 0);
    const capacityRate = totalCapacity > 0 ? ((totalOccupancy / totalCapacity) * 100).toFixed(0) : 0;
    return { active, delayed, totalOccupancy, capacityRate };
  }, [fleet]);

  const filteredFleet = fleet.filter(bus => {
    const matchesSearch = bus.route.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bus.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bus.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || bus.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleRegisterDriver = (e) => {
    e.preventDefault();
    if (!newDriver.id || !newDriver.driver || !newDriver.route) return;
    
    setFleet([...fleet, { ...newDriver, occupancy: 0, lastStop: 'Station', eta: 'TBD' }]);
    setNewDriver({ id: '', route: '', driver: '', license: '', status: 'on-time', capacity: 50, contact: '' });
    setShowRegistration(false);
  };

  const deleteDriver = (id) => {
    setFleet(fleet.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. FLEET PERFORMANCE INDICATORS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Navigation} color="indigo" label="Active Routes" value={stats.active} isLive />
        <StatCard icon={AlertTriangle} color="amber" label="Delays Reported" value={stats.delayed} />
        <StatCard icon={Users} color="blue" label="Students En Route" value={stats.totalOccupancy} />
        <StatCard icon={ShieldCheck} color="emerald" label="Safety Rating" value={`${stats.capacityRate}%`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 2. FLEET MONITORING & REGISTRATION */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <header className="p-6 border-b flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white"><Bus size={20} /></div>
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Fleet & Driver Registry</h3>
                <p className="text-[10px] font-bold text-slate-400">REGISTERED VEHICLES: {fleet.length}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowRegistration(!showRegistration)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                {showRegistration ? <XCircle size={14} /> : <UserPlus size={14} />}
                {showRegistration ? 'Cancel' : 'Register Driver'}
              </button>
            </div>
          </header>

          {/* Registration Form Overlay/Section */}
          {showRegistration && (
            <div className="p-6 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top duration-300">
              <form onSubmit={handleRegisterDriver} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Vehicle ID</label>
                  <input 
                    required
                    value={newDriver.id}
                    onChange={e => setNewDriver({...newDriver, id: e.target.value})}
                    placeholder="e.g. B105" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Driver Name</label>
                  <input 
                    required
                    value={newDriver.driver}
                    onChange={e => setNewDriver({...newDriver, driver: e.target.value})}
                    placeholder="Full Name" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Route Name</label>
                  <input 
                    required
                    value={newDriver.route}
                    onChange={e => setNewDriver({...newDriver, route: e.target.value})}
                    placeholder="e.g. Downtown Loop" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">License #</label>
                  <input 
                    value={newDriver.license}
                    onChange={e => setNewDriver({...newDriver, license: e.target.value})}
                    placeholder="TX-XXXXX" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Contact Phone</label>
                  <input 
                    value={newDriver.contact}
                    onChange={e => setNewDriver({...newDriver, contact: e.target.value})}
                    placeholder="+1-000-0000" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                    Save Registration
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="p-4 bg-slate-50/50 flex gap-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search driver registry..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-white border border-slate-200 rounded-xl text-[10px] font-bold px-3 py-2 outline-none"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">ALL STATUS</option>
              <option value="on-time">ON TIME</option>
              <option value="delayed">DELAYED</option>
              <option value="maintenance">OFFLINE</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <tr>
                  <th className="px-6 py-4">Driver & Vehicle</th>
                  <th className="px-6 py-4">Route Info</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFleet.map(bus => (
                  <tr key={bus.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${getStatusStyles(bus.status).bg} ${getStatusStyles(bus.status).text}`}>
                          {bus.id}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{bus.driver}</p>
                          <p className="text-[10px] text-slate-400 font-medium">LIC: {bus.license || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-xs font-bold text-slate-700">{bus.route}</p>
                        <p className="text-[10px] text-blue-500 font-medium">{bus.contact}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={bus.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Phone size={14} />
                        </button>
                        <button 
                          onClick={() => deleteDriver(bus.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. VISUAL INSIGHTS (LIVE TRACKING SIM) */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Route Execution</h4>
              <Clock size={16} className="text-blue-400" />
            </div>
            
            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {fleet.filter(b => b.status !== 'maintenance').slice(0, 3).map((bus, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-slate-900 flex items-center justify-center ${getStatusStyles(bus.status).bg}`}>
                    <Bus size={10} className={getStatusStyles(bus.status).text} />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{bus.id} • {bus.driver.split(' ')[0]}</p>
                      <p className="text-xs font-bold">{bus.lastStop}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${bus.status === 'delayed' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {bus.eta}
                    </span>
                  </div>
                  <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full animate-pulse ${bus.status === 'delayed' ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${60 + (idx * 15)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
              <MapPin size={14} />
              Open Global Fleet Map
            </button>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Info size={16} /></div>
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">System Notice</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium italic">
              "Driver registration is verified against district safety protocols. Ensure license numbers are up-to-date for insurance compliance."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon: Icon, color, label, value, isLive }) {
  const colorMap = {
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}><Icon size={18} /></div>
        {isLive && <span className="text-[10px] font-black text-blue-500 animate-pulse">LIVE</span>}
      </div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'on-time': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'delayed': 'bg-rose-100 text-rose-700 border-rose-200',
    'maintenance': 'bg-slate-100 text-slate-700 border-slate-200'
  };
  const icon = {
    'on-time': <CheckCircle2 size={10} />,
    'delayed': <Clock size={10} />,
    'maintenance': <XCircle size={10} />
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${styles[status]}`}>
      {icon[status]}
      {status.replace('-', ' ')}
    </span>
  );
}

const getStatusStyles = (status) => {
  switch (status) {
    case 'on-time': return { bg: 'bg-emerald-100', text: 'text-emerald-600' };
    case 'delayed': return { bg: 'bg-rose-100', text: 'text-rose-600' };
    default: return { bg: 'bg-slate-100', text: 'text-slate-600' };
  }
};

export default Transport