import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else if (user) {
      // Sincronizar con el backend
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.id,
            email: user.email,
            name: name,
          }),
        });
      } catch (syncError) {
        console.error('Error syncing user with backend:', syncError);
      }
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-emerald-600 rounded-xl mb-4 shadow-lg shadow-emerald-600/20">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Nueva Cuenta</h2>
        <p className="text-slate-400 mt-2">Únete a VisionFinance hoy mismo</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nombre completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="Juan Pérez"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Crear cuenta <UserPlus className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-slate-400">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">Entra aquí</a>
      </p>
    </motion.div>
  );
};

export default RegisterForm;
