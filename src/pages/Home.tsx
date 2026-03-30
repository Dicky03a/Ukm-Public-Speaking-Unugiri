import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import NewsCard from "../components/NewsCard";
import { ArrowRight, Users, Trophy, MessageSquare, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("/api/news?published=true")
      .then((res) => res.json())
      .then((data) => setNews(data.slice(0, 3)));
  }, []);

  const stats = [
    { label: "Anggota Aktif", value: "150+", icon: Users },
    { label: "Prestasi Nasional", value: "25+", icon: Trophy },
    { label: "Workshop/Tahun", value: "12+", icon: MessageSquare },
    { label: "Alumni Sukses", value: "500+", icon: Mic2 },
  ];

  return (
    <div>
      <Hero />

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-10 rounded-[30px] bg-white border border-[#E0E0E0] hover:border-primary/30 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.06)] transition-all group"
              >
                <div className="inline-flex p-4 rounded-[20px] bg-primary/10 text-primary mb-6 group-hover:bg-primary/20 transition-colors">
                  <stat.icon size={28} />
                </div>
                <h4 className="text-3xl font-semibold text-[#0B090A] mb-2">
                  {stat.value}
                </h4>
                <p className="text-sm text-[#808080] font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-4 block">
                Apa yang Kami Tawarkan
              </span>
              <h2 className="text-4xl font-semibold text-[#0B090A] leading-tight">
                Program Unggulan Kami untuk Masa Depan Anda
              </h2>
            </div>
            <Link
              to="/about"
              className="px-8 py-3 bg-white border-2 border-[#E0E0E0] rounded-[30px] font-semibold text-sm hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-2"
            >
              Lihat Semua Program <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Workshop Intensif",
                desc: "Pelatihan berbicara di depan umum dengan mentor profesional setiap minggunya.",
                icon: "🎤",
              },
              {
                title: "Lomba & Kompetisi",
                desc: "Kesempatan mengasah mental melalui berbagai lomba debat dan pidato tingkat nasional.",
                icon: "🏆",
              },
              {
                title: "Networking Alumni",
                desc: "Terhubung dengan alumni sukses yang kini berkarir di berbagai bidang komunikasi.",
                icon: "🤝",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ translateY: -8 }}
                className="bg-white p-10 rounded-[30px] border border-[#E0E0E0] hover:border-primary/30 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.15)] transition-all"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-[#0B090A] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#808080] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-4 block">
              Berita Terbaru
            </span>
            <h2 className="text-4xl font-semibold text-[#0B090A] mb-6">
              Update Kegiatan & Prestasi Terkini
            </h2>
            <p className="text-[#808080]">
              Ikuti terus perkembangan terbaru dari UKM Public Speaking melalui
              artikel dan berita kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {news.map((item: any) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all"
            >
              Lihat Semua Berita <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8 max-w-3xl mx-auto leading-tight">
            Siap Menjadi Pembicara yang Berpengaruh?
          </h2>
          <p className="text-white/90 text-lg mb-12 max-w-2xl mx-auto">
            Jangan lewatkan kesempatan untuk bergabung dengan angkatan baru
            tahun ini. Kuota terbatas!
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-white text-primary rounded-[30px] font-semibold text-lg hover:bg-gray-50 transition-all"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
