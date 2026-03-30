import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mic2, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        navigate("/admin");
      } else {
        setError(data.error || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-primary rounded-[20px] text-white mb-6">
            <Mic2 size={32} />
          </div>
          <h1 className="text-3xl font-semibold text-[#0B090A] mb-2">
            Admin Login
          </h1>
          <p className="text-[#808080]">Masuk untuk mengelola konten UKM</p>
        </div>

        <div
          className="bg-white p-10 rounded-[30px] border border-[#E0E0E0]"
          style={{ boxShadow: "4px 10px 30px rgba(0, 0, 0, 0.15)" }}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[20px] flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#0B090A] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#808080]"
                  size={20}
                />
                <input
                  type="email"
                  required
                  placeholder="admin@ukmpublicspeaking.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#E0E0E0] rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B090A] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#808080]"
                  size={20}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#E0E0E0] rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-[30px] font-semibold text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk Sekarang"}{" "}
              <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-sm text-[#AAAAAA]">
          Lupa password? Hubungi tim IT UKM.
        </p>
      </motion.div>
    </div>
  );
}
