import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Star, Mic2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden grid-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Star size={14} className="fill-primary" />
            <span>UKM Public Speaking Terbaik 2025</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 max-w-4xl leading-[1.1]"
          >
            Tingkatkan <span className="text-primary">Kepercayaan Diri</span> & Kuasai Seni Berbicara
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 mb-12 max-w-2xl leading-relaxed"
          >
            Bergabunglah dengan komunitas kami untuk mengasah kemampuan komunikasi, kepemimpinan, dan menjadi pembicara yang berpengaruh di masa depan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              to="/contact"
              className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center gap-2"
            >
              Daftar Sekarang <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <Play size={16} className="fill-gray-900" />
              </div>
              Lihat Profil
            </button>
          </motion.div>

          {/* Hero Image / Illustration Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
          >
            <img
              src="https://picsum.photos/seed/publicspeaking/1200/675"
              alt="Public Speaking Session"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 right-10 glass-card p-4 rounded-2xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Mic2 className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Live Workshop</p>
                  <p className="text-[10px] text-gray-500">Setiap Sabtu, 09:00 WIB</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
