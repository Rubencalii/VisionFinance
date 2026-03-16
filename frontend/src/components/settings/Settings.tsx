import React, { useState, useEffect } from 'react';
import { Key, Save, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const token = (await JSON.parse(localStorage.getItem('sb-vjofvpsmivlyfzhptxqb-auth-token') || '{}')).access_token;
      const res = await fetch('http://localhost:3000/api/user/settings/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setHasApiKey(data.hasApiKey);
    } catch {
      console.error('Error fetching settings status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = (await JSON.parse(localStorage.getItem('sb-vjofvpsmivlyfzhptxqb-auth-token') || '{}')).access_token;
      const res = await fetch('http://localhost:3000/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ apiKey }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'API Key guardada correctamente y cifrada en el servidor.' });
        setHasApiKey(true);
        setApiKey('');
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la API Key.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading) return <div className="p-8 text-white">Cargando configuración...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600/20 rounded-xl">
            <Key className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Configuración de IA</h2>
            <p className="text-slate-400">Modelo "Bring Your Own Key" (BYOK)</p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
          <p className="text-sm text-blue-100">
            VisionFinance utiliza la API de Anthropic (Claude) para procesar tus tickets. 
            Tus claves se guardan cifradas con <strong>AES-256</strong> y nunca se envían al navegador.
          </p>
        </div>

        {hasApiKey && (
          <div className="mb-8 flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 text-sm">
            <CheckCircle className="w-4 h-4" />
            Ya tienes una API Key configurada. Puedes actualizarla introduciendo una nueva debajo.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Claude API Key (Anthropic)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="sk-ant-..."
              required
            />
            <p className="mt-2 text-xs text-slate-500">Consigue tu clave en console.anthropic.com</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar Clave</>}
          </button>
        </form>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
          >
            {message.text}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
