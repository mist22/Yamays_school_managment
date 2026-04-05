import React, { useState } from 'react';
import {replace, useNavigate} from "react-router-dom"
import { 
  User, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  LogIn, 
  Key, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import BASE_URL from '../apiurls';

/**
 * HIGH-LEVEL MANAGER LOGIN COMPONENT
 * A professional, high-security aesthetic authentication guard.
 */
const Login = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

const handleLogin = async (data) => {
  setIsAuthenticating(true);
  setAuthError(null);

  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // important to send and receive httpOnly cookie
      body: JSON.stringify({
        name: data.username, // or data.email if you use email
        password: data.password,
      }),
    });

    const data2 = await response.json();

    if (response.ok) {
      //console.log(data2.user.name)
      localStorage.setItem('token', data2.token); // 👈 save JWT in localStorage
      localStorage.setItem('name', data2.user.name); // 👈 save JWT in localStorage
      navigate("/Home")
      // Login successful
    } else {
      // Login failed
      setAuthError(data2.message || "Login failed. Please try again.");
    }
  } catch (err) {
    console.error(err);
    setAuthError("Network error. Please check your connection.");
  } finally {
    setIsAuthenticating(false);
  }
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a] p-4 font-sans selection:bg-blue-500/30">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10">
          <div className="p-10 md:p-14">
            
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-2xl shadow-slate-300 ring-8 ring-slate-50">
                <ShieldCheck size={40} strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">System Access</h1>
              <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-[0.25em]">Authorized Personnel Only</p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Administrator ID</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    {...register("username", { required: "Username is required" })}
                    type="text" 
                    placeholder="Enter username"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                {errors.username && <p className="text-[9px] text-rose-500 font-bold uppercase ml-2 tracking-tighter">{errors.username.message}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Security Credentials</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Key size={18} />
                  </div>
                  <input 
                    {...register("password", { required: "Password is required" })}
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                  />
                  <button 
                    type="button"
                    tabIndex="-1"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[9px] text-rose-500 font-bold uppercase ml-2 tracking-tighter">{errors.password.message}</p>}
              </div>

              {/* Error Feedback */}
              {authError && (
                <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                  <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-rose-600 leading-relaxed uppercase tracking-tight">
                    {authError}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button 
                disabled={isAuthenticating}
                type="submit" 
                className="group relative w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 mt-8 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
              >
                {isAuthenticating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Login</span>
                    <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-between">
              <button type="button" className="text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                Forgot Credentials?
              </button>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="bg-slate-50 py-6 px-10 flex items-center justify-center gap-3 border-t border-slate-100">
             <div className="flex items-center gap-1.5 text-slate-400">
               <Lock size={12} strokeWidth={3} />
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">AES-256 Bit Encryption</span>
             </div>
          </div>
        </div>
        
        {/* Secondary Info */}
        <p className="text-center mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] opacity-50">
          Terminal ID: {Math.random().toString(36).substring(7).toUpperCase()} • SSL Active
        </p>
      </div>
    </div>
  );
};

export default Login;