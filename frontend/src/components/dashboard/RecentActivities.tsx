import React from 'react';
import { Store, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentActivitiesProps {
  tickets: {
    id: string;
    merchant: string;
    total: number;
    date: string;
    category: { name: string };
  }[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ tickets }) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Actividad Reciente</h3>
        <Link to="/history" className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
          Ver todo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {tickets.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-slate-500 italic text-sm text-center">Todavía no has escaneado ningún ticket</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-500/10">
                  <Store className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[120px]">{ticket.merchant}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(ticket.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{Number(ticket.total).toFixed(2)}€</p>
                <p className="text-[10px] text-slate-500 px-1.5 py-0.5 bg-slate-800 rounded-md inline-block uppercase tracking-wider">{ticket.category.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
