import TicketUpload from '../tickets/TicketUpload';
import TicketForm from '../tickets/TicketForm';
import { Sparkles, History as HistoryIcon, TrendingUp, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [ticketData, setTicketData] = useState<{
    merchant: string;
    date: string;
    subtotal: number;
    vat: number;
    total: number;
    category: string;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleUploadSuccess = async (url: string) => {
    setImageUrl(url);
    setProcessing(true);
    
    try {
      const token = (await JSON.parse(localStorage.getItem('sb-vjofvpsmivlyfzhptxqb-auth-token') || '{}')).access_token;
      const response = await fetch('http://localhost:3000/api/ocr/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      const result = await response.json();
      if (result.success) {
        setTicketData(result.data);
      } else {
        alert(result.error || 'Error al procesar el ticket');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Error de conexión al procesar el ticket');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Gastos Mes', value: `${(stats?.totalSpent || 0).toFixed(2)}€`, icon: Wallet, color: 'text-blue-500' },
          { label: 'Ratio Ahorro', value: '15%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Tickets Escaneados', value: stats?.count || 0, icon: HistoryIcon, color: 'text-purple-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-slate-950 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Scanner */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white">Escáner de Tickets Inteligente</h2>
          </div>
          
          <TicketUpload onUploadSuccess={handleUploadSuccess} />
          
          {processing && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-pulse flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 animate-spin" />
              <p className="text-blue-400 text-sm font-medium">Claude está analizando tu ticket...</p>
            </div>
          )}
        </section>

        {/* Right: Results Form */}
        <section>
          <AnimatePresence>
            {ticketData && imageUrl && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h3 className="text-lg font-semibold text-slate-300 mb-6">Confirmar Datos Extraídos</h3>
                <TicketForm initialData={ticketData} imageUrl={imageUrl} />
              </motion.div>
            )}
            {!ticketData && !processing && (
              <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                <p className="text-slate-500 text-center italic">Sube un ticket para ver la magia de la IA en acción</p>
              </div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
