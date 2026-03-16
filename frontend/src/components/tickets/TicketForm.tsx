import React, { useState } from 'react';
import { Store, Calendar, CreditCard, Tag, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TicketData {
  merchant: string;
  date: string;
  subtotal: number;
  vat: number;
  total: number;
  category: string;
}

interface TicketFormProps {
  initialData: Partial<TicketData>;
  imageUrl: string;
}

const TicketForm: React.FC<TicketFormProps> = ({ initialData, imageUrl }) => {
  const [formData, setFormData] = useState<Partial<TicketData>>(initialData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = (await JSON.parse(localStorage.getItem('sb-vjofvpsmivlyfzhptxqb-auth-token') || '{}')).access_token;
      const response = await fetch('http://localhost:3000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          categoryName: formData.category,
          imageUrl
        }),
      });

      if (response.ok) {
        alert('¡Ticket guardado correctamente!');
        window.location.href = '/'; // O usar navigate si fuera un componente funcional con router
      } else {
        alert('Error al guardar el ticket');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="space-y-6 bg-slate-900/30 p-6 rounded-2xl border border-slate-800"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Store className="w-4 h-4" /> Comercio
          </label>
          <input
            type="text"
            value={formData.merchant || ''}
            onChange={(e) => setFormData({...formData, merchant: e.target.value})}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Fecha
          </label>
          <input
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white color-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Importe Total
          </label>
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">€</span>
            <input
              type="number"
              step="0.01"
              value={formData.total || ''}
              onChange={(e) => setFormData({...formData, total: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white pr-8"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4" /> Categoría
          </label>
          <select
            value={formData.category || 'Others'}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
          >
            <option value="Food">Comida</option>
            <option value="Transport">Transporte</option>
            <option value="Housing">Vivienda</option>
            <option value="Health">Salud</option>
            <option value="Entertainment">Ocio</option>
            <option value="Others">Otros</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Base Imponible</label>
            <input
              type="number"
              value={formData.subtotal || ''}
              className="w-full px-3 py-1.5 text-sm bg-slate-900 border border-slate-800 rounded text-slate-300"
              readOnly
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">IVA</label>
            <input
              type="number"
              value={formData.vat || ''}
              className="w-full px-3 py-1.5 text-sm bg-slate-900 border border-slate-800 rounded text-slate-300"
              readOnly
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Confirmar y Guardar Ticket</>}
      </button>
    </motion.form>
  );
};

export default TicketForm;
