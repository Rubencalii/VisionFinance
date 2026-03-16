import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-600/20">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
        <p className="text-slate-400 mt-2">Introduce tus credenciales para entrar</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
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
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Entrar <LogIn className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-slate-400">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="text-blue-500 hover:text-blue-400 font-medium">Regístrate</a>
      </p>
    </motion.div>
  );
};

export default LoginForm;
