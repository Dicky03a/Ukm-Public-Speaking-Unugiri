import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Image as ImageIcon, Maximize2 } from "lucide-react";

export default function Gallery() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setGallery(data));
  }, []);

  return (
    <div className="pt-20 pb-24 bg-gray-50 min-h-screen grid-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4 block">Galeri Kegiatan</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Momen Berharga Kami</h1>
          <p className="text-gray-500">Kumpulan dokumentasi kegiatan, workshop, dan kompetisi yang telah kami laksanakan.</p>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallery.map((item: any) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative aspect-square rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/800`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <h4 className="text-white font-bold text-xl mb-2">{item.title}</h4>
                  <p className="text-white/70 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                    <Maximize2 size={14} />
                    <span>Lihat Detail</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="inline-flex p-4 bg-gray-50 rounded-full text-gray-300 mb-6">
              <ImageIcon size={48} />
            </div>
            <p className="text-gray-400">Belum ada foto di galeri.</p>
          </div>
        )}
      </div>
    </div>
  );
}
