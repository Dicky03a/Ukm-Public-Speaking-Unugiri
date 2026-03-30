import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Target, Award, ShieldCheck } from "lucide-react";

export default function About() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(data));
  }, []);

  return (
    <div className="pt-20 pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4 block">Tentang Kami</span>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Membangun Generasi <span className="text-primary">Komunikator</span> yang Berpengaruh
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              UKM Public Speaking didirikan dengan visi untuk menjadi pusat pengembangan kemampuan berbicara di depan umum bagi mahasiswa. Kami percaya bahwa setiap orang memiliki suara yang berharga untuk didengar.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Visi Kami</h4>
                  <p className="text-xs text-gray-500">Menjadi UKM terdepan dalam pengembangan soft skill komunikasi.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Misi Kami</h4>
                  <p className="text-xs text-gray-500">Menyelenggarakan pelatihan berkualitas dan kompetisi yang membangun.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://picsum.photos/seed/team/800/800"
                alt="UKM Public Speaking Team"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 glass-card p-8 rounded-3xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary rounded-2xl text-white">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">10+ Tahun</p>
                  <p className="text-sm text-gray-500">Pengalaman & Dedikasi</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Structure Section */}
      <section className="bg-gray-50 py-24 grid-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4 block">Struktur Organisasi</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Wajah di Balik UKM Public Speaking</h2>
            <p className="text-gray-500">Para pengurus yang berdedikasi untuk memajukan UKM dan melayani seluruh anggota.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {members.length > 0 ? (
              members.map((member: any) => (
                <div key={member.id} className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-gray-50 group-hover:border-primary/20 transition-all">
                    <img
                      src={member.imageUrl || `https://picsum.photos/seed/${member.id}/200/200`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">{member.position}</p>
                  <p className="text-gray-400 text-xs">Periode {member.period}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                Data pengurus belum tersedia.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
