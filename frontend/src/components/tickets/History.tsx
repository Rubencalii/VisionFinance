import React, { useState, useEffect } from 'react';
import { Calendar, Store, Tag, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const History: React.FC = () => {
  const [tickets, setTickets] = useState<{
    id: string;
    merchant: string;
    date: string;
    total: number;
    category: { name: string };
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = (await JSON.parse(localStorage.getItem('sb-vjofvpsmivlyfzhptxqb-auth-token') || '{}')).access_token;
      const res = await fetch('http://localhost:3000/api/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Historial de Gastos</h2>
          <p className="text-slate-400 mt-1">Revisa y gestiona todos tus tickets escaneados</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Buscar por comercio o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={ticket.id}
              className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl hover:bg-slate-900/60 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                  <Store className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{ticket.merchant}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {new Date(ticket.date).toLocaleDateString('es-ES')}
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 rounded-lg text-slate-300">
                      <Tag className="w-3.5 h-3.5" /> {ticket.category.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-8">
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{Number(ticket.total).toFixed(2)}€</p>
                  <p className="text-xs text-slate-500">IVA incluido</p>
                </div>
                <button className="p-2 bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </motion.div>
          ))}
          
          {filteredTickets.length === 0 && (
            <div className="text-center p-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 italic">
              No se han encontrado tickets con esos criterios.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
