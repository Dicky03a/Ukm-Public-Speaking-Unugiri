import { Link } from "react-router-dom";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface NewsCardProps {
  news: {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string;
    createdAt: string;
    category: {
      name: string;
    };
  };
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="group bg-white rounded-[30px] overflow-hidden border border-[#E0E0E0] hover:border-primary/30 hover:shadow-[4px_10px_30px_rgba(0,0,0,0.15)] transition-all duration-500">
      <Link
        to={`/news/${news.slug}`}
        className="block relative aspect-[4/3] overflow-hidden"
      >
        <img
          src={
            news.thumbnail || `https://picsum.photos/seed/${news.id}/600/450`
          }
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-primary text-xs font-semibold uppercase tracking-wider rounded-[20px]">
            {news.category.name}
          </span>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-[#808080] font-medium uppercase tracking-widest mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            <span>
              {format(new Date(news.createdAt), "dd MMM yyyy", { locale: id })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-primary" />
            <span>{news.category.name}</span>
          </div>
        </div>

        <Link
          to={`/news/${news.slug}`}
          className="block group-hover:text-primary transition-colors"
        >
          <h3 className="text-lg font-semibold text-[#0B090A] leading-snug mb-4 line-clamp-2">
            {news.title}
          </h3>
        </Link>

        <Link
          to={`/news/${news.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
        >
          Baca Selengkapnya <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
