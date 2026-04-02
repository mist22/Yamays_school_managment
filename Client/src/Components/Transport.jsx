import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bus, 
  Users, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Navigation, 
  Phone, 
  UserPlus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  XCircle,
  Clock,
  Info
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import 
  BASE_URL from '../apiurls';
/**
 * TRANSPORTATION MODULE - DATABASE INTEGRATED
 * Features: Live DB Fetching, POST registration, and Custom Delete Warning Modal
 */

function Transport() {
  const [fleet, setFleet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRegistration, setShowRegistration] = useState(false);
  const [capacity, setCapacity] = useState([])
  const [allStudents, setAllStudents] = useState([])
  
  // Custom Modal State
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, driverId: null, driverName: '' });
  
  const { handleSubmit, register, reset } = useForm();

  // 1. FETCH DATA FROM DATABASE
  const fetchFleet = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/get_drivers`);
      if (!response.ok) throw new Error("Failed to fetch fleet data");
      const data = await response.json();
      setFleet(data.data || []);
      setAllStudents(data.students_perBus || [])
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Database connection error. Ensure your server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  // 2. STATS CALCULATION
  const stats = useMemo(() => {
    const active = fleet.filter(b => b.status !== 'maintenance').length;
    const delayed = fleet.filter(b => b.status === 'delayed').length;
    const totalOccupancy = fleet.reduce((acc, b) => acc + (Number(b.occupancy) || 0), 0);
    const totalCapacity = fleet.reduce((acc, b) => acc + (parseInt(b.capacity) || 30), 0);
    const capacityRate = totalCapacity > 0 ? ((totalOccupancy / totalCapacity) * 100).toFixed(0) : 0;
    return { active, delayed, totalOccupancy, capacityRate };
  }, [fleet]);

  // 3. FILTERING LOGIC
  const filteredFleet = fleet.filter(bus => {
    const name = bus.name || bus.driver || "";
    const busId = bus.bus_id || bus.id || "";
    const route = bus.route || "";

    const matchesSearch = route.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          busId.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || bus.status === filter;
    return matchesSearch && matchesFilter;
  });

  // 4. DATABASE SUBMISSION (POST)
  const onsubmit = async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/register_driver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bus_id: data.bus_id,
          name: data.name,
          route: data.route,
          license: data.license,
          phone: data.phone,
          status: 'on-time'
        })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      await fetchFleet(); // Reload from DB
      reset();
      setShowRegistration(false);
    } catch (err) {
      console.error("Failed to submit driver:", err);
    }
  };

  // 5. CUSTOM MODAL HANDLERS
  const openDeleteModal = (bus) => {
    setDeleteConfirm({
      show: true,
      driverId: bus.id,
      driverName: bus.name || bus.driver
    });
  };

  const closeDeleteModal = () => {
    setDeleteConfirm({ show: false, driverId: null, driverName: '' });
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/delete_driver/${deleteConfirm.driverId}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) throw new Error("Delete failed");
      
      await fetchFleet(); // Refresh from DB
      closeDeleteModal();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center text-slate-500 gap-2">
      <Loader2 className="animate-spin" /> <span className="font-bold uppercase tracking-widest text-xs">Syncing with Database...</span>
    </div>
  );

  return (
    <div className="relative  space-y-6 animate-in fade-in duration-500 p-4 md:p-8 bg-slate-50">
      
      {/* CUSTOM WARNING POPUP (DELETE MODAL) */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200 min-h-screen">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Delete Driver Record?</h3>
              <p className="text-sm text-slate-500 mb-8">
                You are about to remove <span className="font-bold text-slate-800">{deleteConfirm.driverName}</span> from the database. This will permanently delete their records.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                >
                  Confirm Delete
                </button>
                
                <button 
                  onClick={closeDeleteModal}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Go Back
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Navigation} color="indigo" label="Live Routes" value={stats.active} isLive />
        <StatCard icon={AlertTriangle} color="amber" label="Delays" value={stats.delayed} />
        <StatCard icon={Users} color="blue" label="Active Students" value={stats.totalOccupancy} />
        <StatCard icon={ShieldCheck} color="emerald" label="Capacity" value={`${capacity.length || 0}` }/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <header className="p-6 border-b flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white"><Bus size={20} /></div>
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Fleet Registry</h3>
                <p className="text-[10px] font-bold text-slate-400 italic">DB Records: {fleet.length}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowRegistration(!showRegistration)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
            >
              {showRegistration ? <XCircle size={14} /> : <UserPlus size={14} />}
              {showRegistration ? 'Cancel' : 'New Driver'}
            </button>
          </header>

          {showRegistration && (
            <div className="p-6 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top duration-500">
              <form onSubmit={handleSubmit(onsubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input required {...register("bus_id")} placeholder="Vehicle ID" className="px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none" />
                <input required {...register("name")} placeholder="Driver Name" className="px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none" />
                <input required {...register("route")} placeholder="Route Name" className="px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none" />
                <input {...register("license")} placeholder="License #" className="px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none" />
                <input {...register("phone")} placeholder="Phone" className="px-4 py-2 border border-slate-200 rounded-xl text-xs outline-none" />
                <button type="submit" className="py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700">
                  Save to DB
                </button>
              </form>
            </div>
          )}

          <div className="p-4 bg-slate-50/50 flex gap-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <tr>
                  <th className="px-6 py-4 text-center">ID</th>
                  <th className="px-6 py-4">Driver</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFleet.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-xs italic">No driver records found in database.</td>
                  </tr>
                ) : filteredFleet.map(bus => (
                  <tr key={bus.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-lg font-black text-[10px] ${getStatusStyles(bus.status).bg} ${getStatusStyles(bus.status).text}`}>
                        {bus.bus_id}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={
                      () => setCapacity(() => {
                     return allStudents.filter((st) => st.bus_id === bus.bus_id)
                    })}>
                      <p className="font-bold text-slate-800 text-sm">{bus.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{bus.license || 'NO LICENSE'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      {bus.route}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={bus.status || 'on-time'} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => window.location.href=`tel:${bus.phone}`}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Phone size={14} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(bus)}
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

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Live Sync</h4>
             <div className="space-y-4">
                {fleet.filter(b => b.status === 'on-time').slice(0, 3).map((b, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold">{b.route}</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
                   </div>
                ))}
             </div>
             <button onClick={fetchFleet} className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <Clock size={14} /> Re-Sync Database
             </button>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
             <div className="flex items-center gap-2 mb-2">
                <Info size={14} className="text-blue-500" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Info</h4>
             </div>
             <p className="text-[11px] text-slate-500 leading-relaxed italic">
               All driver deletions are logged and reflected in real-time across the administration portal.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
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
        {isLive && <span className="text-[10px] font-black text-blue-500 animate-pulse">SYNCED</span>}
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
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${styles[status]}`}>
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

export default Transport;