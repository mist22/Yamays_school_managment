import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bus, 
  Users, 
  GraduationCap, 
  Clock, 
  ShieldAlert, 
  Printer, 
  Plus, 
  Search,
  LayoutDashboard,
  Calendar,
  UserCheck,
  X,
  FileText,
  AlertCircle,
  Gavel,
  History,
  Trash2,
  Filter,
  UserPlus,
  Menu,
  ChevronRight,
} from 'lucide-react';
import Dashbaord from './Dashbaord';
import Discipline from './Discipline';
import RegisterStudent from './RegisterStudent';

// Initial Mock Data
const INITIAL_STUDENTS = [
  { 
    id: '1', 
    name: 'Alice Johnson', 
    grade: '10th', 
    busId: 'B1', 
    attendance: 95, 
    discipline: [
      { id: 'd1', date: '2023-11-05', reason: 'Mobile phone usage in class', severity: 'Low', action: 'Verbal Warning' }
    ], 
    grades: { Math: 'A', Science: 'B+', English: 'A-' } 
  },
  { 
    id: '2', 
    name: 'Bob Smith', 
    grade: '11th', 
    busId: 'B1', 
    attendance: 88, 
    discipline: [
      { id: 'd2', date: '2023-10-12', reason: 'Repeated Tardy', severity: 'Medium', action: 'After-school Detention' }
    ], 
    grades: { Math: 'C', Science: 'B', English: 'B' } 
  }
];

const INITIAL_BUSES = [
  { id: 'B1', driver: 'John Doe', morningArrival: '06:00 AM', noonArrival: '12:00 PM', afternoonArrival: '05:00 PM' },
  { id: 'B2', driver: 'Sarah Connor', morningArrival: '05:45 AM', noonArrival: '12:15 PM', afternoonArrival: '05:15 PM' },
];

function Home() {
  const [view, setView] = useState('dashboard');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [buses, setBuses] = useState(INITIAL_BUSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modals
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isLogDisciplineModalOpen, setIsLogDisciplineModalOpen] = useState(false);

  // Form States
  const [newStudent, setNewStudent] = useState({ name: '', grade: '9th', busId: 'B1' });
  const [disciplineForm, setDisciplineForm] = useState({ 
    studentId: '', 
    reason: '', 
    severity: 'Low', 
    action: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  const stats = useMemo(() => ({
    totalStudents: students.length,
    totalBuses: buses.length,
    avgAttendance: students.length > 0 
      ? (students.reduce((acc, s) => acc + s.attendance, 0) / students.length).toFixed(1)
      : 0,
    disciplineCases: students.reduce((acc, s) => acc + (s.discipline?.length || 0), 0)
  }), [students, buses]);

  const handleRegisterStudent = (e) => {
    e.preventDefault();
    const studentToAdd = {
      id: `S${Date.now()}`,
      name: newStudent.name,
      grade: newStudent.grade,
      busId: newStudent.busId,
      attendance: 100,
      discipline: [],
      grades: { Math: 'N/A', Science: 'N/A', English: 'N/A' }
    };
    
    setStudents(prev => [...prev, studentToAdd]);
    setIsAddStudentModalOpen(false);
    setNewStudent({ name: '', grade: '9th', busId: buses[0]?.id || '' });
  };

  const handleLogDiscipline = (e) => {
    e.preventDefault();
    const targetId = disciplineForm.studentId || selectedStudent?.id;
    if (!targetId) return;

    setStudents(prev => prev.map(s => {
      if (s.id === targetId) {
        return {
          ...s,
          discipline: [...(s.discipline || []), { 
            ...disciplineForm, 
            id: `D${Date.now()}` 
          }]
        };
      }
      return s;
    }));

    setIsLogDisciplineModalOpen(false);
    setDisciplineForm({ studentId: '', reason: '', severity: 'Low', action: '', date: new Date().toISOString().split('T')[0] });
  };

  const deleteDiscipline = (studentId, discId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, discipline: s.discipline.filter(d => d.id !== discId) };
      }
      return s;
    }));
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Registry', icon: Users },
    { id: 'discipline', label: 'Discipline Tracking', icon: Gavel },
    { id: 'buses', label: 'Transportation', icon: Bus },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
  ];

  const handleNavClick = (id) => {
    setView(id);
    setIsMobileMenuOpen(false);
  };

  // --- Render Sections ---
  


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col hidden lg:flex no-print">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <GraduationCap size={28} />
          </div>
          <div>
            <span className="font-black text-xl tracking-tighter block leading-none">EduPortal</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Management v2.5</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${view === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              <item.icon size={22} className={view === item.id ? 'scale-110' : ''} />
              <span className="font-bold text-[15px]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-black text-xs">A</div>
                <div className="min-w-0">
                   <p className="text-xs font-black truncate">Admin User</p>
                   <p className="text-[9px] font-bold text-slate-500 uppercase">Live System</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg"><GraduationCap size={20} /></div>
                <span className="font-black text-lg tracking-tighter">EduPortal</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
            </div>
            <nav className="flex-1 px-3 py-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${view === item.id ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  <item.icon size={20} />
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 md:py-5 flex justify-between items-center sticky top-0 z-30 no-print">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 bg-slate-100 rounded-xl text-slate-600 lg:hidden active:scale-95 transition"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm md:text-lg font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px] md:max-w-none">
              {view.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddStudentModalOpen(true)}
              className="bg-slate-900 text-white p-2 md:px-5 md:py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-black transition shadow-lg active:scale-95"
            >
              <Plus size={18} /> <span className="hidden md:inline">New Student</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-7xl mx-auto">
          {view === 'dashboard' && <Dashbaord buses={buses} students={students} registration={handleRegisterStudent}/>}
          {view === 'discipline' && <Discipline selectedStudent={selectedStudent} filteredStds= {filteredStudents}/>}
          
          {view === 'students' && <RegisterStudent filteredStds={filteredStudents}/>}

          {['buses', 'attendance'].includes(view) && (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 px-6 text-center">
               <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <Calendar size={40} className="text-slate-300" />
               </div>
               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Future Release</h3>
               <p className="text-slate-500 max-w-xs text-xs mt-2">The {view} module is part of the Q3 update roadmap.</p>
            </div>
          )}
        </div>
      </main>

      {/* Log Discipline Modal */}
      {isLogDisciplineModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsLogDisciplineModalOpen(false)} />
          <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="bg-rose-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Incident Log</h2>
                <p className="text-rose-100 text-[10px] font-bold opacity-80 uppercase tracking-widest">Administrative Record</p>
              </div>
              <button onClick={() => setIsLogDisciplineModalOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleLogDiscipline} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {!selectedStudent && (
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Select Student</label>
                  <select required className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" value={disciplineForm.studentId} onChange={e => setDisciplineForm({...disciplineForm, studentId: e.target.value})}>
                    <option value="">Choose from directory...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Reason</label>
                <textarea required className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-rose-500 h-24 text-sm" placeholder="Provide incident details..." value={disciplineForm.reason} onChange={e => setDisciplineForm({...disciplineForm, reason: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Severity</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" value={disciplineForm.severity} onChange={e => setDisciplineForm({...disciplineForm, severity: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Date</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" value={disciplineForm.date} onChange={e => setDisciplineForm({...disciplineForm, date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Action Taken</label>
                <input required type="text" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-rose-500 text-sm" placeholder="e.g. Detention" value={disciplineForm.action} onChange={e => setDisciplineForm({...disciplineForm, action: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3.5 bg-rose-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition shadow-lg active:scale-95">
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsAddStudentModalOpen(false)} />
          <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter">New Enrollment</h2>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Registry Entry</p>
              </div>
              <button onClick={() => setIsAddStudentModalOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleRegisterStudent} className="p-6 space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input required type="text" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" placeholder="First Last" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Grade</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})}>
                      <option>9th</option><option>10th</option><option>11th</option><option>12th</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Bus ID</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.busId} onChange={e => setNewStudent({...newStudent, busId: e.target.value})}>
                      {buses.map(b => <option key={b.id} value={b.id}>{b.id}</option>)}
                    </select>
                  </div>
               </div>
               <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-lg active:scale-95">
                Register Now
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          main { overflow: visible !important; height: auto !important; }
          aside { display: none !important; }
          .overflow-y-auto { overflow: visible !important; max-height: none !important; }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
}
export default Home