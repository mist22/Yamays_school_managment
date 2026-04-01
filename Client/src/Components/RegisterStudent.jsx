import { AlertCircle, Gavel, LoaderPinwheel, Search, Trash2 } from 'lucide-react';
import React, { use, useEffect, useState, useCallback } from 'react'

const RegisterStudent = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedstudent, setSelectedStudent] = useState()
    const [openDeleteModel, setOpenDeleteModel] = useState(false)
    const [students, setStudents] = useState([])

     let getStudents = useCallback (async() => {
          let retriveStudents = await fetch (`${BASE_URL}/get_students`)
          const data = await retriveStudents.json()
          console.log(data)
          setStudents(data.data)
        }, [])
      useEffect(() => {
       
        getStudents()
      }, [])

    useEffect(() => {
      const filter = students.filter(s => 
        s.name.includes(searchTerm.toLowerCase())
      )
      setStudents(filter)

    },[searchTerm])
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/student_delete/${selectedstudent.id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok){
         const data = await res.json()
          message(data)
          throw new Error("Delete failed");
      } 
      
      await getStudents(); // Refresh from DB
      
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
   
  return (
     <div className="space-y-6">
                {openDeleteModel && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200 min-h-screen">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                      <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
                          <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Delete Driver Record?</h3>
                        <p className="text-sm text-slate-500 mb-8">
                          You are about to remove <span className="font-bold text-slate-800">{selectedstudent.name}</span> from the database. This will permanently delete their records.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button 
                            onClick={() => {handleConfirmDelete(), setOpenDeleteModel(false)}}
                            className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                          >
                            Confirm Delete
                          </button>
                          
                          <button 
                            onClick={() =>setOpenDeleteModel(false)}
                            className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                          >
                            Go Back
                          </button>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                )}
               <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search registry..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
               </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto overflow-y-auto shadow-sm h-100">
               {students.length > 0 ? 
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
                       {students?.map(s => (
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
                             <button onClick={() => {setOpenDeleteModel(true), setSelectedStudent(s)}} className="p-2 text-rose-400 hover:text-rose-700 transition">
                               <Trash2 size={16} />
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
                :
                <div className='flex justify-center items-center p-35'>
                  <LoaderPinwheel size={100} className='text-blue-200 animate-spin'/>
                </div>
               }
              </div>
            </div>
  )
}

export default RegisterStudent