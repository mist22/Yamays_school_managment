import { Gavel, Search } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'

const RegisterStudent = ({filteredStds , setSelectedStudent, setView, buses}) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [studnetsFiltered, setStudentsFiltered] = useState([])

    useEffect(() => {
      const filter = filteredStds.filter(s => 
        s.name.includes(searchTerm.toLowerCase())
      )
      setStudentsFiltered(filter)

    },[searchTerm, filteredStds])
  return (
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
                         <th className="px-6 py-4 text-center">Class</th>
                         <th className="px-6 py-4 text-center">Route</th>
                         <th className="px-6 py-4 text-center">Attendance</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {studnetsFiltered?.map(s => (
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
                           <td className="px-6 py-4 text-center font-medium text-sm">{s.class_grade}</td>
                           <td className="px-6 py-4 text-center">
                             <span className="px-2 py-0.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600">{s.route}</span>
                           </td>
                           <td className="px-6 py-4 text-center">
                             <div className="flex items-center justify-center gap-2">
                               <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                 <div className="h-full bg-emerald-500" style={{width: `${s.attendance}`}} />
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
  )
}

export default RegisterStudent