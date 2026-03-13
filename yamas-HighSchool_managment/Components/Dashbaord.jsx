import React, { useMemo , useState} from 'react'

import { 
  Bus, 
  Users, 
  ShieldAlert, 
  UserCheck,
  History,
  UserPlus,
} from 'lucide-react';

const Dashbaord = ({buses , students, registration}) => {
        const [newStudent, setNewStudent] = useState({ name: '', grade: '9th', busId: 'B1' });       
      const stats = useMemo(() => ({
        totalStudents: (students || []).length,
        totalBuses: buses?.length,
        avgAttendance: students?.length > 0 
          ? (students.reduce((acc, s) => acc + s.attendance, 0) / students.length).toFixed(1)
          : 0,
        disciplineCases: students?.reduce((acc, s) => acc + (s.discipline?.length || 0), 0)
      }), [students, buses]);
  return (
    
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
          <form onSubmit={registration} className="space-y-4">
            <input required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Student Full Name" value={newStudent?.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <select className="px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})}>
                {['9th', '10th', '11th', '12th'].map(g => <option key={g}>{g}</option>)}
              </select>
              <select className="px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.busId} onChange={e => setNewStudent({...newStudent, busId: e.target.value})}>
                {buses?.map(b => <option key={b.id} value={b.id}>{b.id}</option>)}
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
             {students?.flatMap(s => s.discipline.map(d => ({...d, sName: s.name}))).slice(-4).reverse().map((item, idx) => (
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
  )

    
  
}

export default Dashbaord