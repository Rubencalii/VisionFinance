import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import type { Session } from '@supabase/supabase-js';

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
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
        <Routes>
          <Route 
            path="/login" 
            element={!session ? (
              <div className="min-h-screen flex items-center justify-center p-4">
                <LoginForm />
              </div>
            ) : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!session ? (
              <div className="min-h-screen flex items-center justify-center p-4">
                <RegisterForm />
              </div>
            ) : <Navigate to="/" />} 
          />
          
          <Route 
            path="/" 
            element={session ? (
              <div className="p-8">
                <h1 className="text-4xl font-bold text-white mb-4">Dashboard VisionFinance</h1>
                <p className="text-slate-400">Bienvenido, {session.user.email}</p>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
