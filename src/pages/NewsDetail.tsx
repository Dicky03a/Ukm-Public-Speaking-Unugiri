import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Tag, User, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

export default function NewsDetail() {
  const { slug } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="pt-32 text-center">Memuat berita...</div>;
  if (!news) return <div className="pt-32 text-center">Berita tidak ditemukan.</div>;

  return (
    <div className="pt-10 pb-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-10">
          <ArrowLeft size={18} /> Kembali ke Berita
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              <span>{format(new Date(news.createdAt), "dd MMMM yyyy", { locale: id })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag size={14} className="text-primary" />
              <span>{news.category.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-primary" />
              <span>Admin UKM</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
            {news.title}
          </h1>

          <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <img
              src={news.thumbnail || `https://picsum.photos/seed/${news.id}/1200/600`}
              alt={news.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-gray-900">
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900">Bagikan:</span>
            <div className="flex gap-2">
              <button className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-500">#{news.category.name.toLowerCase()}</span>
            <span className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-500">#publicspeaking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
