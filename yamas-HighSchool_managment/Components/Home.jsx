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

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-600' },
          { label: 'Routes', value: stats.totalBuses, icon: Bus, color: 'bg-emerald-600' },
          { label: 'Attendance', value: `${stats.avgAttendance}%`, icon: UserCheck, color: 'bg-indigo-600' },
          { label: 'Incidents', value: stats.disciplineCases, icon: ShieldAlert, color: 'bg-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg flex-shrink-0`}>
              <stat.icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{stat.label}</p>
              <p className="text-xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={20} /> Quick Enrollment
          </h3>
          <form onSubmit={handleRegisterStudent} className="space-y-4">
            <input required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Student Full Name" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <select className="px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})}>
                {['9th', '10th', '11th', '12th'].map(g => <option key={g}>{g}</option>)}
              </select>
              <select className="px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.busId} onChange={e => setNewStudent({...newStudent, busId: e.target.value})}>
                {buses.map(b => <option key={b.id} value={b.id}>{b.id}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95">
              Register Student
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <History className="text-rose-600" size={20} /> Recent Activity
          </h3>
          <div className="space-y-3">
             {students.flatMap(s => s.discipline.map(d => ({...d, sName: s.name}))).slice(-4).reverse().map((item, idx) => (
               <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="min-w-0 pr-2">
                   <p className="text-sm font-bold text-slate-800 truncate">{item.sName}</p>
                   <p className="text-[10px] text-slate-500 truncate">{item.reason}</p>
                 </div>
                 <span className="text-[10px] font-black px-2 py-1 rounded bg-rose-100 text-rose-700 uppercase flex-shrink-0">{item.severity}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisciplineSection = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="w-full">
          <h2 className="text-xl md:text-2xl font-black text-slate-800">Discipline Management</h2>
          <p className="text-slate-500 text-xs md:text-sm">Track behavior incidents and actions</p>
        </div>
        <button 
          onClick={() => setIsLogDisciplineModalOpen(true)}
          className="w-full md:w-auto bg-rose-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition shadow-lg shadow-rose-100"
        >
          <Gavel size={20} /> Log New Incident
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[400px] lg:h-[600px]">
          <div className="p-4 bg-slate-50 border-b flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Find student..." 
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-rose-500 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredStudents.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedStudent(s)}
                className={`p-4 border-b cursor-pointer transition-all ${selectedStudent?.id === s.id ? 'bg-rose-50 border-l-4 border-l-rose-600' : 'hover:bg-slate-50'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                  <ChevronRight size={14} className="text-slate-300 lg:hidden" />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-slate-500">Grade {s.grade}</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    {s.discipline?.length || 0} Cases
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedStudent ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden print:border-0 print:shadow-none">
              <div className="p-5 border-b flex justify-between items-center bg-slate-900 text-white">
                <div className="min-w-0 pr-4">
                  <h3 className="text-lg font-black uppercase tracking-tight truncate">{selectedStudent.name}</h3>
                  <p className="text-slate-400 text-[10px]">Registry ID: {selectedStudent.id}</p>
                </div>
                <button onClick={() => window.print()} className="p-2 hover:bg-white/10 rounded-lg transition no-print">
                  <Printer size={18} />
                </button>
              </div>
              
              <div className="p-5 md:p-8 overflow-y-auto max-h-[500px]">
                {selectedStudent.discipline?.length > 0 ? (
                  <div className="space-y-6">
                    {selectedStudent.discipline.map((item) => (
                      <div key={item.id} className="relative pl-6 md:pl-8 border-l-2 border-slate-100 pb-2 group">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.severity === 'High' ? 'bg-rose-500' : 'bg-slate-400'}`} />
                        <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100 relative group">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                              <h4 className="font-bold text-slate-800 text-base">{item.reason}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black px-2 py-1 rounded-lg border uppercase ${
                                item.severity === 'High' ? 'bg-rose-100 text-rose-700 border-rose-200' : 
                                item.severity === 'Medium' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                'bg-blue-100 text-blue-700 border-blue-200'
                              }`}>
                                {item.severity}
                              </span>
                              <button onClick={() => deleteDiscipline(selectedStudent.id, item.id)} className="text-slate-300 hover:text-rose-600 transition no-print p-1">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 text-xs font-medium text-slate-600 bg-white w-fit px-3 py-1.5 rounded-lg border shadow-sm">
                            <ShieldAlert size={12} className="text-rose-500 flex-shrink-0" />
                            <span>Action: <span className="text-slate-900 font-bold">{item.action}</span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 md:py-20 bg-emerald-50 rounded-3xl border-2 border-dashed border-emerald-200">
                    <UserCheck size={40} className="mx-auto text-emerald-500 mb-3" />
                    <p className="text-emerald-800 font-black text-base">Pristine Record</p>
                    <p className="text-emerald-600/70 text-[10px] px-4">No recorded incidents for this student.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 px-6 text-center">
              <Gavel size={40} className="mb-4 opacity-10" />
              <p className="font-bold text-sm">Select a student profile to view history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
          {view === 'dashboard' && renderDashboard()}
          {view === 'discipline' && renderDisciplineSection()}
          
          {view === 'students' && (
            <div className="space-y-6">
               <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search registry..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
               </div>
               
               <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left min-w-[600px]">
                     <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">
                       <tr>
                         <th className="px-6 py-4">Student</th>
                         <th className="px-6 py-4 text-center">Grade</th>
                         <th className="px-6 py-4 text-center">Route</th>
                         <th className="px-6 py-4 text-center">Attendance</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {filteredStudents.map(s => (
                         <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[10px] flex-shrink-0">{s.name.charAt(0)}</div>
                               <div className="min-w-0">
                                 <p className="font-bold text-slate-800 text-sm truncate">{s.name}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">{s.id}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-center font-medium text-sm">{s.grade}</td>
                           <td className="px-6 py-4 text-center">
                             <span className="px-2 py-0.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600">{s.busId}</span>
                           </td>
                           <td className="px-6 py-4 text-center">
                             <div className="flex items-center justify-center gap-2">
                               <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                 <div className="h-full bg-emerald-500" style={{width: `${s.attendance}%`}} />
                               </div>
                               <span className="text-[10px] font-bold">{s.attendance}%</span>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <button onClick={() => { setSelectedStudent(s); setView('discipline'); }} className="p-2 text-slate-400 hover:text-rose-600 transition">
                               <Gavel size={16} />
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
            </div>
          )}

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