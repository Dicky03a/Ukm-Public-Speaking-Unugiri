import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Plus, Search, Edit2, Trash2, CheckCircle, XCircle, MoreVertical, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail: "",
    categoryId: "",
    published: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [newsRes, catRes] = await Promise.all([
      fetch("/api/news"),
      fetch("/api/categories"),
    ]);
    const newsData = await newsRes.json();
    const catData = await catRes.json();
    setNews(newsData);
    setCategories(catData);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingNews ? "PUT" : "POST";
    const url = editingNews ? `/api/news/${editingNews.id}` : "/api/news";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingNews(null);
      setFormData({ title: "", content: "", thumbnail: "", categoryId: "", published: false });
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus berita ini?")) {
      await fetch(`/api/news/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const openEdit = (item: any) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      thumbnail: item.thumbnail || "",
      categoryId: item.categoryId.toString(),
      published: item.published,
    });
    setIsModalOpen(true);
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
        setFormData((prev) => ({ ...prev, thumbnail: data.url }));
      } else {
        alert(data.error || "Gagal mengunggah gambar");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengunggah");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Berita</h1>
            <p className="text-gray-500">Kelola artikel, berita kegiatan, dan pengumuman UKM.</p>
          </div>
          <button
            onClick={() => {
              setEditingNews(null);
              setFormData({ title: "", content: "", thumbnail: "", categoryId: "", published: false });
              setIsModalOpen(true);
            }}
            className="px-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Berita
          </button>
        </header>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari judul berita..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-primary transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-6">Berita</th>
                  <th className="px-8 py-6">Kategori</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Tanggal</th>
                  <th className="px-8 py-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {news.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                          <img
                            src={item.thumbnail || `https://picsum.photos/seed/${item.id}/100/100`}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="max-w-xs">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">/news/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                        {item.category.name}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {item.published ? (
                        <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                          <CheckCircle size={14} />
                          <span>Published</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                          <XCircle size={14} />
                          <span>Draft</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-gray-500 font-medium">
                        {format(new Date(item.createdAt), "dd MMM yyyy", { locale: id })}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-xl text-white">
                    <Newspaper size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingNews ? "Edit Berita" : "Tambah Berita Baru"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto flex-grow space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Judul Berita</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                      <select
                        required
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail Berita</label>
                      <div className="space-y-4">
                        {formData.thumbnail && (
                          <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                            <img
                              src={formData.thumbnail}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, thumbnail: "" })}
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
                            id="thumbnail-upload"
                          />
                          <label
                            htmlFor="thumbnail-upload"
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
                                  {formData.thumbnail ? "Ganti Gambar" : "Klik untuk Unggah Gambar"}
                                </span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <input
                        type="checkbox"
                        id="published"
                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      />
                      <label htmlFor="published" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                        Publikasikan Berita
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Konten Berita (Markdown)</label>
                    <textarea
                      rows={12}
                      required
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-mono text-sm"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    ></textarea>
                    <p className="mt-2 text-[10px] text-gray-400">Gunakan format Markdown untuk styling teks.</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
                  >
                    {editingNews ? "Simpan Perubahan" : "Tambah Berita"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
