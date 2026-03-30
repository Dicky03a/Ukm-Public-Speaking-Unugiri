import { Link } from "react-router-dom";
import { Mic2, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <Mic2 className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                UKM <span className="text-primary">Public Speaking</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Wadah pengembangan diri mahasiswa dalam seni berbicara di depan umum, kepemimpinan, dan kepercayaan diri.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Tautan Cepat</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 text-sm hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link to="/about" className="text-gray-500 text-sm hover:text-primary transition-colors">Tentang Kami</Link></li>
              <li><Link to="/news" className="text-gray-500 text-sm hover:text-primary transition-colors">Berita & Artikel</Link></li>
              <li><Link to="/gallery" className="text-gray-500 text-sm hover:text-primary transition-colors">Galeri Kegiatan</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Program Kerja</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Workshop Public Speaking</a></li>
              <li><a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Lomba Debat Internal</a></li>
              <li><a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Master of Ceremony Training</a></li>
              <li><a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Public Speaking Camp</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-6">Kontak Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500 text-sm">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>Gedung Pusat Kegiatan Mahasiswa, Lantai 2, Kampus Utama.</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <Mail size={18} className="text-primary shrink-0" />
                <span>halo@ukmpublicspeaking.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs text-center md:text-left">
            © {new Date().getFullYear()} UKM Public Speaking. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 text-xs hover:text-gray-600 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-gray-400 text-xs hover:text-gray-600 transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
