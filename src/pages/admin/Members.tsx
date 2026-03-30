import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Plus, Search, Edit2, Trash2, Users, XCircle } from "lucide-react";

export default function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    imageUrl: "",
    period: "2024/2025",
    order: "0",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(data);
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
    const url = editingMember ? `/api/members/${editingMember.id}` : "/api/members";
    const method = editingMember ? "PUT" : "POST";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setEditingMember(null);
      setFormData({ name: "", position: "", imageUrl: "", period: "2024/2025", order: "0" });
      fetchMembers();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengurus ini?")) return;
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    if (res.ok) fetchMembers();
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      imageUrl: member.imageUrl,
      period: member.period,
      order: member.order.toString(),
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({ name: "", position: "", imageUrl: "", period: "2024/2025", order: "0" });
    setIsModalOpen(true);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow p-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Pengurus</h1>
            <p className="text-gray-500">Kelola struktur organisasi dan data pengurus UKM.</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Pengurus
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member: any) => (
            <div key={member.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group text-center relative">
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(member)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(member.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-6 border-4 border-gray-50 group-hover:border-primary/20 transition-all">
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
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-xl text-white">
                    <Users size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{editingMember ? "Edit Pengurus" : "Tambah Pengurus"}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto Pengurus</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 border-2 border-gray-100 shrink-0">
                      <img
                        src={formData.imageUrl || "https://via.placeholder.com/150"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="member-photo-upload"
                      />
                      <label
                        htmlFor="member-photo-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          uploading ? "bg-gray-100 text-gray-400" : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {uploading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span>Mengunggah...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>{formData.imageUrl ? "Ganti Foto" : "Unggah Foto"}</span>
                          </>
                        )}
                      </label>
                      <p className="mt-2 text-[10px] text-gray-400">Rekomendasi: Foto kotak (1:1), maks 5MB.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Periode</label>
                    <input
                      type="text"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Urutan Tampil</label>
                    <input
                      type="number"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
                  Simpan Pengurus
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
