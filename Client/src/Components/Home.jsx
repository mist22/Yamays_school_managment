import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bus, 
  Users, 
  GraduationCap, 
  Plus, 
  LayoutDashboard,
  UserCheck,
  X,
  Gavel,
  Moon,
  Sun,
  Menu,
  DollarSign,
} from 'lucide-react';
import Dashbaord from './Dashbaord';
import Discipline from './Discipline';
import RegisterStudent from './RegisterStudent';
import Attendance from './Attendance';
import Transport from './Transport';
import { useForm } from 'react-hook-form';
import Payments from './Payments';
import BASE_URL from '../apiurls';
import { useNavigate } from 'react-router-dom';




function Home() {
  console.log(BASE_URL)
  const [view, setView] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [show, setShow] =useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bg, setBg] = useState(false)
  const [drivers, setDrivers] = useState([])
  const {handleSubmit, register, reset} = useForm()
  const timeOut = useRef(null)
  const navigate  = useNavigate()
  const token = localStorage.getItem('token');


  const onsubmit = async(data) => {
    try{
      const response = await fetch(`${BASE_URL}/api/register_student`, {
        method: "POST",
        headers : {"Content-Type" : "application/json", 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({name : data.studentname, grade : data.grade, bus_id : data.bus_id, class_grade:data.class_grade})
      })

        if (!response.ok) {
          const data = await response.json()
          setMessage(data)
          throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Student saved:", result);

    } catch (err) {
    console.error("Failed to submit student:", err);

  }finally{
    reset({
      studentname : "",
      grade: "",
      bus_id: "",
      class_grade: ""
    })

  }
}

  useEffect(() => {
     if(message){
      setShow(true)
    }
      if(timeOut.current){
      clearTimeout(timeOut.current)
    }
    timeOut.current = setTimeout(() => {
      setShow(false)

      setTimeout(() => {
        setMessage(null)
      },300)
      setMessage(null)
    }, 3000)
  }, [message])
    
  useEffect(() => {
      const token = localStorage.getItem('token');

        const checkToken = async () => {
          try {
            const res = await fetch(`/api/check-token`, {
              method: "GET",
              headers : {"Content-Type" : "application/json", 'Authorization': `Bearer ${token}`},

            });
    
            const data = await res.json();
    
            if (res.ok && data.isAuthenticated) {
             console.log("Manager Loged in succesfully")
            } else {
              console.log(data)
              navigate("/Login", {replace:true}); // token invalid, go to login
            }
          } catch (err) {
            console.error(err);
            navigate("/Login");
          }
        };
    
        checkToken();
      }, []);



  // Modals
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  // Form States
const [newStudent, setNewStudent] = useState({ name: '', grade: '9th', busId: 'B1' });
let getDrivers = async() => {
      let retriveDrivers = await fetch (`${BASE_URL}/api/get_drivers`)
      const data = await retriveDrivers.json()
      console.log(data)
      setDrivers(data.data)
    }
  useEffect(() => {
  
    getDrivers()
  }, []);

let getStudents = useCallback (async() => {
      let retriveStudents = await fetch (`${BASE_URL}/api/get_students`)
      const data = await retriveStudents.json()
      console.log(data)
      setStudents(data.data)
    }, [])
  useEffect(() => {
   
    getStudents()
  }, [])



  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'discipline', label: 'Discipline Tracking', icon: Gavel },
    { id: 'buses', label: 'Transportation', icon: Bus },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  const handleNavClick = (id) => {
    setView(id);
    setIsMobileMenuOpen(false);
  };

  // --- Render Sections ---
  


  return (
    <div className={`relative min-h-screen flex ${!bg? "bg-slate-100": "bg-slate-800"} font-sans overflow-hidden`}>
      {message && (
        <div className={`absolute top-1/8 left-1/2 -translate-x-1/2 -translate-y-1/2  ${message?.error? "bg-rose-400/70" : "text-emerald-400/70"} 
        inset-shadow-2xs ${!bg? "inset-shadow-olive-400" : "inset-shadow-olive-900"}  w-50 rounded-xl backdrop-blur-3xl  shadow-xl/30 shadow-slate-700 p-2 z-999 ${show? "opacity-100" : "opacity-0"} transition-opacity  duration-300`}>
        <h1 className='text-center text-white font-bold'>{message ? Object.values(message)[0] : "[../..]"}</h1>
      </div>
      )}
      
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
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${view === item.id ? 'bg-sky-700 text-white shadow-xl shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
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
        <div className="fixed inset-0 z-50 lg:hidden no-print overflow-x-auto">
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

      <main className=" realtive flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 md:py-5 flex justify-between items-center sticky top-0 z-30 no-print shadow-xl/30 rounded-b-2xl">
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
          <div className="flex items-center gap-10">
            <button 
              onClick={() => setIsAddStudentModalOpen(true)}
              className="bg-slate-900 text-white p-2 md:px-5 md:py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-black transition shadow-lg active:scale-95"
            >
              <Plus size={18} /> <span className="hidden md:inline">New Student</span>
            </button>
                <button
            onClick={() => setBg((prev) => !prev)}
             className={`rounded-3xl w-13 flex h-9 bg-slate-900  items-center ${bg? "justify-end": "justify-start"} inset-shadow-2xs inset-shadow-white shadow-xl/15 border border-t-slate-400 border-l-0 border-r-0 border-b-slate-400`}>
                {bg
                ? <Moon className='w-6 h-10 text-slate-100'/> 
                : <Sun className="text-slate-100 w-6"/>}</button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-7xl mx-auto mt-25">
          {view === 'dashboard' && <Dashbaord buses={drivers} students={students} message={setMessage}/>}
          {view === 'discipline' && <Discipline students={students} setStudents={setStudents}/>}
          

          {view === 'students' && <RegisterStudent filteredStds={filteredStudents}  setView= {setView}/>}
          {view === 'attendance' && <Attendance students={students}/>}
          {view === 'buses' && <Transport/>}
          {view === 'payments' && <Payments/>}

          
      
        </div>
      </main>



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
            <form onSubmit={handleSubmit(onsubmit)} className="p-6 space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input {...register("studentname")} required type="text" className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" placeholder="First Last" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Grade</label>
                    <select {...register("grade")} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})}>
                      <option>9th</option><option>10th</option><option>11th</option><option>12th</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Bus ID</label>
                    <select {...register("bus_id")} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm">
                      {drivers?.map(b => <option key={b.id} value={b.id}>{b.id}</option>)}
                    </select>
                  </div>
                  <div className='flex flex-col'>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Class_Grade</label>
                    <select {...register("class_grade")} className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-sm" >
                      {
                      ["A", "B", "C", "D", "E", "F"]
                      .map((item, inx) => (
                        <option key={inx}>{item}</option>
                      )) 
                      }
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