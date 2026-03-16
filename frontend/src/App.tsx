import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings';
import type { Session } from '@supabase/supabase-js';
import { LayoutDashboard, Settings as SettingsIcon, LogOut, Cpu } from 'lucide-react';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30 font-sans">
        <Routes>
          <Route 
            path="/login" 
            element={!session ? (
              <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
                <LoginForm />
              </div>
            ) : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!session ? (
              <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950">
                <RegisterForm />
              </div>
            ) : <Navigate to="/" />} 
          />
          
          <Route 
            path="/*" 
            element={session ? (
              <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">VisionFinance</span>
                  </div>

                  <nav className="flex-1 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-900 transition-colors text-slate-300 hover:text-white group">
                      <LayoutDashboard className="w-5 h-5 text-slate-500 group-hover:text-blue-400" /> Dashboard
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-900 transition-colors text-slate-300 hover:text-white group">
                      <SettingsIcon className="w-5 h-5 text-slate-500 group-hover:text-blue-400" /> Configuración
                    </Link>
                  </nav>

                  <button 
                    onClick={() => supabase.auth.signOut()}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                  </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            ) : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
