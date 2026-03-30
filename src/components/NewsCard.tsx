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
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <Link to={`/news/${news.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={news.thumbnail || `https://picsum.photos/seed/${news.id}/600/450`}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
            {news.category.name}
          </span>
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-primary" />
            <span>{format(new Date(news.createdAt), "dd MMM yyyy", { locale: id })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag size={12} className="text-primary" />
            <span>{news.category.name}</span>
          </div>
        </div>
        
        <Link to={`/news/${news.slug}`} className="block group-hover:text-primary transition-colors">
          <h3 className="text-xl font-bold text-gray-900 leading-snug mb-4 line-clamp-2">
            {news.title}
          </h3>
        </Link>
        
        <Link 
          to={`/news/${news.slug}`} 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-primary transition-colors"
        >
          Baca Selengkapnya <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
