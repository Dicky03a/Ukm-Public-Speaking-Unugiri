import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Newspaper, Users, Image as ImageIcon, Eye, ArrowUpRight, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    members: 0,
    gallery: 0,
  });

  useEffect(() => {
    // Fetch counts
    Promise.all([
      fetch("/api/news").then(res => res.json()),
      fetch("/api/members").then(res => res.json()),
      fetch("/api/gallery").then(res => res.json()),
    ]).then(([news, members, gallery]) => {
      setStats({
        news: news.length,
        members: members.length,
        gallery: gallery.length,
      });
    });
  }, []);

  const cards = [
    { label: "Total Berita", value: stats.news, icon: Newspaper, color: "bg-blue-500" },
    { label: "Total Pengurus", value: stats.members, icon: Users, color: "bg-green-500" },
    { label: "Foto Galeri", value: stats.gallery, icon: ImageIcon, color: "bg-purple-500" },
    { label: "Total Views", value: "12.4K", icon: Eye, color: "bg-orange-500" },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-500">Selamat datang kembali di panel admin UKM Public Speaking.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-full">
              <TrendingUp size={18} />
            </div>
            <span className="text-sm font-bold text-gray-900">Sistem Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {cards.map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className={`inline-flex p-4 rounded-2xl ${card.color} text-white mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{card.label}</h3>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold text-gray-900">{card.value}</span>
                <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                  <ArrowUpRight size={14} />
                  <span>+12%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Aktivitas Terakhir</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary border border-gray-100">
                    <Newspaper size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-gray-900">Berita baru ditambahkan</p>
                    <p className="text-xs text-gray-400">2 jam yang lalu oleh Admin</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Panduan Admin</h3>
            <div className="space-y-4">
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                <h4 className="font-bold text-primary mb-2">Tips Konten</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Gunakan gambar berkualitas tinggi (min. 1200x800px) untuk thumbnail berita agar tampilan website tetap profesional.</p>
              </div>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                <h4 className="font-bold text-blue-600 mb-2">Keamanan Akun</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Jangan lupa untuk logout setelah selesai mengelola konten, terutama jika menggunakan perangkat publik.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
