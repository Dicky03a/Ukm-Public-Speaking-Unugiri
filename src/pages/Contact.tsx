import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  return (
    <div className="pt-20 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4 block">Kontak Kami</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Ada Pertanyaan? <span className="text-primary">Hubungi Kami</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-12">
              Kami selalu terbuka untuk kolaborasi, pertanyaan seputar pendaftaran, atau informasi lebih lanjut mengenai program kami.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Alamat Kantor</h4>
                  <p className="text-gray-500 leading-relaxed">
                    Gedung Pusat Kegiatan Mahasiswa, Lantai 2, Kampus Utama.<br />
                    Jl. Pendidikan No. 123, Kota Pelajar.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Telepon / WhatsApp</h4>
                  <p className="text-gray-500 leading-relaxed">
                    +62 812-3456-7890 (Admin)<br />
                    +62 812-9876-5432 (Humas)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Email Resmi</h4>
                  <p className="text-gray-500 leading-relaxed">
                    halo@ukmpublicspeaking.com<br />
                    kerjasama@ukmpublicspeaking.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-10 rounded-3xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Kirim Pesan</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama..."
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Masukkan email..."
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subjek</label>
                <input
                  type="text"
                  placeholder="Apa yang ingin dibahas?"
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pesan</label>
                <textarea
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..."
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                ></textarea>
              </div>
              <button className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                Kirim Pesan <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
