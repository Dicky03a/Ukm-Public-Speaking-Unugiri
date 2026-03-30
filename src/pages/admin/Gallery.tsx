import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Plus, Image as ImageIcon, Trash2, XCircle } from "lucide-react";

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setGallery(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        alert(data.error || "Gagal mengunggah gambar");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengunggah");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ title: "", imageUrl: "", description: "" });
      fetchGallery();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) fetchGallery();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Galeri</h1>
            <p className="text-gray-500">Kelola dokumentasi foto kegiatan UKM.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Foto
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.map((item: any) => (
            <div key={item.id} className="group relative aspect-square rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
              <img
                src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/800`}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                <p className="text-white/70 text-xs mb-4">{item.description}</p>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="self-start p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-xl text-white">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Tambah Foto Galeri</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Foto</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto Galeri</label>
                  <div className="space-y-4">
                    {formData.imageUrl && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: "" })}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="gallery-photo-upload"
                      />
                      <label
                        htmlFor="gallery-photo-upload"
                        className={`flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                          uploading ? "bg-gray-50 border-gray-200" : "bg-gray-50 border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs font-bold text-gray-400">Mengunggah...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Plus className="text-gray-400" size={24} />
                            <span className="text-xs font-bold text-gray-400">
                              {formData.imageUrl ? "Ganti Gambar" : "Klik untuk Unggah Gambar"}
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Keterangan Singkat</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
                  Simpan Foto
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
