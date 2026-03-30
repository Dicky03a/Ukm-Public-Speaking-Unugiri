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

  if (loading)
    return (
      <div className="pt-32 text-center text-[#808080]">Memuat berita...</div>
    );
  if (!news)
    return (
      <div className="pt-32 text-center text-[#808080]">
        Berita tidak ditemukan.
      </div>
    );

  return (
    <div className="pt-10 pb-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#808080] hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={18} /> Kembali ke Berita
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-4 text-xs text-[#808080] font-semibold uppercase tracking-widest mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              <span>
                {format(new Date(news.createdAt), "dd MMMM yyyy", {
                  locale: id,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-primary" />
              <span>{news.category.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-primary" />
              <span>Admin UKM</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-[#0B090A] leading-tight mb-8">
            {news.title}
          </h1>

          <div
            className="aspect-[21/9] rounded-[30px] overflow-hidden mb-12"
            style={{ boxShadow: "4px 10px 30px rgba(0, 0, 0, 0.15)" }}
          >
            <img
              src={
                news.thumbnail ||
                `https://picsum.photos/seed/${news.id}/1200/600`
              }
              alt={news.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div
            className="prose prose-lg max-w-none 
            prose-headings:text-[#0B090A] 
            prose-headings:font-semibold
            prose-p:text-[#808080] 
            prose-p:leading-relaxed 
            prose-a:text-primary 
            prose-a:font-semibold
            prose-strong:text-[#0B090A]
            prose-strong:font-semibold
            prose-code:text-primary
            prose-pre:bg-gray-50
            prose-pre:border
            prose-pre:border-[#E0E0E0]
            prose-pre:rounded-[20px]
            prose-blockquote:border-l-primary
            prose-blockquote:text-[#808080]
          "
          >
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </div>

        <div className="pt-12 border-t border-[#E0E0E0] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#0B090A]">
              Bagikan:
            </span>
            <div className="flex gap-2">
              <button className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-primary/10 rounded-full text-xs font-semibold text-primary">
              #{news.category.name.toLowerCase()}
            </span>
            <span className="px-4 py-2 bg-primary/10 rounded-full text-xs font-semibold text-primary">
              #publicspeaking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
