import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Star, Mic2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-40 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-10"
          >
            <Star size={14} className="fill-primary" />
            <span>UKM Public Speaking Terbaik 2025</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-semibold text-[#0B090A] mb-10 max-w-4xl leading-tight"
          >
            Tingkatkan <span className="text-primary">Kepercayaan Diri</span> &
            Kuasai Seni Berbicara
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[#808080] mb-14 max-w-2xl leading-relaxed font-normal"
          >
            Bergabunglah dengan komunitas kami untuk mengasah kemampuan
            komunikasi, kepemimpinan, dan menjadi pembicara yang berpengaruh di
            masa depan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <Link
              to="/contact"
              className="px-8 py-4 bg-primary text-white rounded-[30px] font-semibold text-lg hover:bg-primary-dark transition-all hover:shadow-xl flex items-center justify-center gap-2"
            >
              Daftar Sekarang <ArrowRight size={20} />
            </Link>
            <button className="px-8 py-4 bg-white text-[#0B090A] border-2 border-[#E0E0E0] rounded-[30px] font-semibold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <Play size={16} className="fill-[#0B090A]" />
              </div>
              Lihat Profil
            </button>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-5xl aspect-[16/9]"
          >
            <div
              className="relative rounded-[30px] overflow-hidden"
              style={{ boxShadow: "4px 10px 30px rgba(0, 0, 0, 0.15)" }}
            >
              <img
                src="https://picsum.photos/seed/publicspeaking/1200/675"
                alt="Public Speaking Session"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Card */}
            <div
              className="absolute top-10 right-10 bg-white rounded-[20px] p-5 hidden md:block"
              style={{ boxShadow: "4px 10px 30px rgba(0, 0, 0, 0.15)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Mic2 className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0B090A]">
                    Live Workshop
                  </p>
                  <p className="text-xs text-[#808080]">
                    Setiap Sabtu, 09:00 WIB
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
