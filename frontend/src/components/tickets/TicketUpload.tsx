import React, { useState } from 'react';
import { Upload, ShieldCheck, Loader2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketUploadProps {
  onUploadSuccess: (url: string) => void;
}

const TicketUpload: React.FC<TicketUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('tickets')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('tickets')
        .getPublicUrl(data.path);

      onUploadSuccess(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Asegúrate de que el bucket "tickets" existe en Supabase.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-800/60 transition-all group"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
              <p className="mb-2 text-sm text-slate-300">
                <span className="font-semibold">Haz clic</span> o arrastra un ticket
              </p>
              <p className="text-xs text-slate-500">PNG, JPG o WEBP (MAX. 5MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={uploading} />
          </motion.label>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950"
          >
            <img src={preview} alt="Ticket Preview" className="w-full h-64 object-contain" />
            
            {uploading ? (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-blue-400 font-medium animate-pulse">Subiendo a la nube...</p>
              </div>
            ) : (
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => setPreview(null)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full backdrop-blur-md transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-full backdrop-blur-md border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicketUpload;
