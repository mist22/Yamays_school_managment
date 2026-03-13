import React, { useEffect, useState } from 'react'
import {  
  ShieldAlert, 
  UserCheck,
  Gavel,
  Search,
  ChevronRight,
  Printer,
  Trash2,
  X,
} from 'lucide-react';

const Discipline = ({students, setStudents}) => {

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
       const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const [isLogDisciplineModalOpen, setIsLogDisciplineModalOpen] = useState(false);
      const [disciplineForm, setDisciplineForm] = useState({ 
        studentId: '', 
        reason: '', 
        severity: 'Low', 
        action: '', 
        date: new Date().toISOString().split('T')[0] 
      });

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

  return (
      
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="w-full">
          <h2 className="text-xl md:text-2xl font-black text-slate-800">Discipline Management</h2>
          <p className="text-slate-500 text-xs md:text-sm">Track behavior incidents and actions</p>
        </div>
        <button 
          onClick={() => setIsLogDisciplineModalOpen(true)}
          className="w-full md:w-50 bg-rose-600 text-white px-6 py-3 text-[15px]  rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition shadow-lg shadow-rose-100"
        >
          <Gavel size={20} />New Incident
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
            {filteredStudents?.map(s => (
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
    </div>
  );
}

export default Discipline