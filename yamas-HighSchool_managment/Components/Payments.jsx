import React, { useState, useMemo, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  History, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Filter,
  DollarSign,
  User,
  Calendar,
  Loader2,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useForm } from 'react-hook-form';

/**
 * PAYMENTS & FEE MANAGEMENT MODULE
 * Integrates with database for fee registration and history tracking
 */

function Payments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const { handleSubmit, register, reset } = useForm();

  // 1. FETCH PAYMENT HISTORY FROM DATABASE
  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/get_payments"); 
      if (!response.ok) throw new Error("Failed to fetch payment data");
      const data = await response.json();
      setPayments(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Database connection error. Unable to load payment history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 2. SUMMARY CALCULATIONS
  const stats = useMemo(() => {
    const totalCollected = payments.filter(p => p.status === 'completed')
                                   .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const pendingAmount = payments.filter(p => p.status === 'pending')
                                  .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const uniqueStudents = new Set(payments.map(p => p.student_id)).size;
    
    return { totalCollected, pendingAmount, uniqueStudents };
  }, [payments]);

  // 3. FILTER & SEARCH
  const filteredHistory = payments.filter(p => {
    const matchesSearch = p.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.student_id?.toString().includes(searchTerm) ||
                          p.invoice_no?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 4. REGISTER NEW FEE (POST)
  const onsubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/register_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: data.student_id,
          student_name: data.student_name,
          amount: data.amount,
          type: data.type, // e.g., Tuition, Transport, Lab
          date: new Date().toISOString().split('T')[0],
          status: data.status || 'completed'
        })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      await fetchPayments();
      reset();
      setShowAddPayment(false);
    } catch (err) {
      console.error("Payment registration failed:", err);
    }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center text-slate-500 gap-2 bg-slate-50">
      <Loader2 className="animate-spin" /> <span className="font-bold uppercase tracking-widest text-[10px]">Syncing Financial Records...</span>
    </div>
  );

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-500 p-4 md:p-8 bg-slate-50">
      
      {/* 1. FINANCIAL KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><ArrowUpRight size={20}/></div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">TOTAL COLLECTED</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800">${stats.totalCollected.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Net Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><Clock size={20}/></div>
            <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">PENDING FEES</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800">${stats.pendingAmount.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Outstanding Balance</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><User size={20}/></div>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">ACTIVE PAYEES</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800">{stats.uniqueStudents}</h2>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Total Students Paid</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* LEFT: PAYMENT REGISTRATION & HISTORY */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <header className="p-6 border-b flex flex-col md:flex-row justify-between gap-4 items-center">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2.5 rounded-2xl text-white"><CreditCard size={20} /></div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Fee Management</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Registry</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search by student..." 
                    className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs w-64 outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setShowAddPayment(!showAddPayment)}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                >
                  {showAddPayment ? <XCircle size={14} /> : <Plus size={14} />}
                  {showAddPayment ? 'Cancel' : 'Record Fee'}
                </button>
              </div>
            </header>

            {showAddPayment && (
              <div className="p-6 bg-blue-50/50 border-b border-blue-100 animate-in slide-in-from-top duration-300">
                <form onSubmit={handleSubmit(onsubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Student ID</label>
                    <input required {...register("student_id")} placeholder="e.g. STU-001" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Student Name</label>
                    <input required {...register("student_name")} placeholder="Full Name" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Fee Type</label>
                    <select {...register("type")} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none">
                      <option value="Tuition">Tuition Fee</option>
                      <option value="Transport">Transport Fee</option>
                      <option value="Lab">Lab/Material Fee</option>
                      <option value="Uniform">Uniform Fee</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Amount ($)</label>
                    <div className="relative">
                      <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required type="number" {...register("amount")} placeholder="0.00" className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none" />
                    </div>
                  </div>
                  <div className="md:col-span-4 flex justify-end">
                    <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                      Confirm & Register Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-xs italic">No financial records found in database.</td>
                    </tr>
                  ) : filteredHistory.map((item, idx) => (
                    <tr key={item.id || idx} className="group hover:bg-slate-50/50 transition-all cursor-default">
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                        #{item.invoice_no || `TRX-${1000 + idx}`}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-sm">{item.student_name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {item.student_id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-lg">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-800 text-sm">
                        ${Number(item.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <PaymentStatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: FILTERS & SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Filter size={14} /> Refine History
            </h4>
            <div className="space-y-3">
              <FilterButton label="All Records" active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} />
              <FilterButton label="Completed" active={filterStatus === 'completed'} onClick={() => setFilterStatus('completed')} color="emerald" />
              <FilterButton label="Pending" active={filterStatus === 'pending'} onClick={() => setFilterStatus('pending')} color="amber" />
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
             <div className="flex items-center gap-2 mb-6">
                <History size={16} className="text-blue-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Activity</h4>
             </div>
             <div className="space-y-4">
                {payments.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b border-slate-800 last:border-0">
                    <div className={`p-2 rounded-xl ${p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {p.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold truncate w-32">{p.student_name}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-tighter">${p.amount} • {p.type}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button onClick={fetchPayments} className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                Refresh Ledger
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PaymentStatusBadge({ status }) {
  const styles = {
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    failed: "bg-rose-100 text-rose-700 border-rose-200"
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
      {status === 'completed' ? <CheckCircle2 size={10} /> : status === 'pending' ? <Clock size={10} /> : <AlertCircle size={10} />}
      {status}
    </span>
  );
}

function FilterButton({ label, active, onClick, color = "blue" }) {
  const colors = {
    blue: active ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100",
    emerald: active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100",
    amber: active ? "bg-amber-600 text-white shadow-lg shadow-amber-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${colors[color]}`}
    >
      {label}
    </button>
  );
}

export default Payments;