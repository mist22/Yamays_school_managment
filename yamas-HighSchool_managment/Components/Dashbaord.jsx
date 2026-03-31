import React, { useEffect, useMemo , useRef, useState} from 'react'
import {useForm} from "react-hook-form"
import { 
  Bus, 
  Users, 
  ShieldAlert, 
  UserCheck,
  History,
  UserPlus,
  BookDownIcon,
  UploadCloud,
  X,
  Loader2,
  Check,
  CheckCircle,
  CrossIcon,
  XCircle
} from 'lucide-react';
import Exceljs, { Workbook } from "exceljs"
const Dashbaord = ({buses , students, message}) => {

      const {register, handleSubmit, reset} = useForm()
      const [discipline , setDiscipline] = useState([])
      const [newStudent, setNewStudent] = useState({ name: '', grade: '9th', busId: 'B1' });   
      const [fileupload, setFileUpload] = useState(false)    
      const [dashboardCards, setDashboardCards] = useState({})
      const [uploaded, setUploaded] = useState(null)
      const upload = useRef(null)
      const stats = useMemo(() => ({
        totalStudents: (students || []).length,
        totalBuses: buses?.length,
        avgAttendance: students?.length > 0 
          ? (students.reduce((acc, s) => acc + s.attendance, 0) / students.length).toFixed(1)
          : 0,
        disciplineCases: students?.reduce((acc, s) => acc + (s.discipline?.length || 0), 0)
      }), [students, buses]);

  const onsubmit = async(data) => {
    try{
      const response = await fetch("http://localhost:3000/register_student", {
        method: "POST",
        headers : {"Content-Type" : "application/json"},
        body: JSON.stringify({name : data.studentname, grade : data.grade, bus_id : data.bus_id, class_grade:data.class_grade})
      })

        if (!response.ok) {
          const data = await response.json()
          message(data)
          throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Student saved:", result);

    } catch (err) {
    console.error("Failed to submit student:", err);

  }finally{
    reset()
  }
}

async function Drivers(){
  const response = await fetch("http://localhost:3000/get_drivers", {
    method: "GET"
  })
  const data = await response.json()
  console.log(data?.data.length, "students")
  return data?.data.length
}
async function Students(){
  const response = await fetch("http://localhost:3000/get_students", {
    method: "GET"
  })
  const data = await response.json()
  return data?.data.length
}
async function Incident(){
  const response = await fetch("http://localhost:3000/get_discipline", {
    method: "GET"
  })
  const data = await response.json()
  return data?.data.length
}

useEffect(() => {
  const fetchValues = async() => {
    const students_value = await Students()
    const drivers_value = await Drivers()
    const incident_value = await Incident()
    setDashboardCards(prev => ({
      ...prev,
      Students:students_value,
      Routes :drivers_value,
      Incidents: incident_value
      
  }))
  }
  fetchValues()
},[])

const handleFileUpload = async(e) =>{
  try{
    const file = e.target.files[0]
    if(!file) return

    const worbook = new Exceljs.Workbook()


    //read the file as array buffer
    const arrayBuffer = await  file.arrayBuffer()
    await worbook.xlsx.load(arrayBuffer)

    const worksheet = worbook.worksheets[0];

    let jsonData = []
    let headers = []
    worksheet.eachRow((row, rownumber) => {
      const rowValues = row.values;

      if(rownumber === 1){
        headers = rowValues.slice(1)
      }else{
        let obj = {}
        headers.forEach((header, index) => {
          obj[header] = rowValues[index + 1]
        });
        jsonData.push(obj)
      }
    });
      const res = await fetch("http://localhost:3000/batch_students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) {
         const data = await res.json()
          message(data)
          setUploaded(false)
      }
      if(res.ok){
      const data = await res.json();
      console.log("students batch uploaded", data);
      

      console.log(jsonData);
      setUploaded(true)
      }
      
    }catch (err) {
    setUploaded(false)
    console.log("failed to upload file", err);
  } finally {
    
    setTimeout(() => {
      setFileUpload(false)
      setTimeout(() => {
        setUploaded(null);
      }, 2000);
    },1000)
  }
}

useEffect(() => {
  async function fetchDiscpline(){
      const response = await fetch("http://localhost:3000/get_discipline");
      const data = await response.json()
      setDiscipline(data.data)
  }
  fetchDiscpline()
  console.log(Object.keys(dashboardCards))
}, [])
  return (
    
    <div className="relative inset-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Students', value: dashboardCards.students_value, icon: Users, color: 'bg-blue-600' },
          { label: 'Routes', value: dashboardCards[1], icon: Bus, color: 'bg-emerald-600' },
          { label: 'Attendance', value: `${stats.avgAttendance}%`, icon: UserCheck, color: 'bg-indigo-600' },
          { label: 'Incidents', value: stats.disciplineCases, icon: ShieldAlert, color: 'bg-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg flex-shrink-0`}>
              <stat.icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{stat.label}</p>
              <p className="text-xl font-black text-slate-800">{dashboardCards[stat.label] ? dashboardCards[stat.label] : <Loader2 className='animate-spin' /> || 0}</p>
            </div>
          </div>
        ))}
      </div>
      {fileupload && (
        <div className='fixed inset-0 flex justify-center items-center w-full z-90'>
      <div className='relative backdrop-blur-sm w-full inset-0 min-h-screen flex justify-center items-center'>
        <div className='bg-slate-100  w-full max-w-2xl  relative h-150  border-2 border-dashed border-slate-400 rounded shadow-xl/30 shadow-blue-400 z-999'>  
          
          <h1 className='text-3xl font bold text-blue-400 text-center p-10'>upload file</h1>
          <button 
          onClick={() => setFileUpload(false)} className='absolute right-2 top-5'><X size={30}  className='text-slate-500 hover:rotate-90'/></button>
        <div className='flex justify-center items-center w-full p-10'>
          <input ref={upload} type="file" 
          accept='.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          className='hidden' onChange={(e) => handleFileUpload(e)}/>
          <div className='flex flex-col justify-center items-center mt-20'>
              <button
              type="button"
              onClick={() => upload.current.click()}
              className='font-bold transition-transform transform hover:scale-120 duration-300 ease-in-out'
              >{uploaded === true ? (<CheckCircle size={35} className='text-green-400'/>) : uploaded === false ? (< XCircle size={35} className='text-rose-400'/>) : <UploadCloud size={35}/>}</button>
              <p className='italic text-slate-600'>upload excel</p>
          </div>
        </div>
        </div>
      </div>
        </div>
        
      )}
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={20} /> Quick Enrollment
          </h3>
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
            <input {...register("studentname")} required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Student Full Name" value={newStudent?.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <select {...register("grade")} className="px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.grade} onChange={e => {setNewStudent({...newStudent, grade: e.target.value}), setGradeChosen(true)}}>
                {['9th', '10th', '11th', '12th'].map(g => <option key={g}>{g}</option>)}
              </select>
              
               <select
               className='px-2 py-2 bg-slate-100 border border-slate-400 rounded-xl outline-0 focus:right-2 focus:ring-gray-500' 
               {...register("class_grade")}>
                {["A", "B", "C", "D", "E", "F"].map(g => <option key={g}>{g}</option>)}
                </select>
              <select {...register("bus_id")} className="px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.busId} onChange={e => setNewStudent({...newStudent, busId: e.target.value})}>
                {buses?.map(b => <option key={b.id} value={b.id}>{b.id}</option>)}
              </select>
              <button
              type='button'
              onClick={() => setFileUpload(true)}
               className='ml-auto text-blue-400 font-bold'><BookDownIcon size={30}/></button>
            </div>
            <button type="submit"  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95">
              Register Student
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <History className="text-rose-600" size={20} /> Recent Activity
          </h3>
          <div className="space-y-3">
            {students.length === 0 ? 
            <p className='text-2xl animate-pulse font-bold'>Loading....</p>
            :
              discipline?.map((item, idx) => (
               <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="min-w-0 pr-2">
                   <p className="text-sm font-bold text-slate-800 truncate">{item.reson}</p>
                   <p className="text-[10px] text-slate-500 truncate">{item.action}</p>
                 </div>
                 <span className={`text-[10px] font-black px-2 py-1 rounded backdrop-blur-2xl ${item.severity === "High" ? "bg-rose-200" : item.severity === "Medium"? "bg-amber-100" : "bg-blue-100"}  uppercase flex-shrink-0`}>{item.severity}</span>
               </div>
             ))
            }
             
          </div>
        </div>
      </div>
    </div>
  )


  
}

export default Dashbaord