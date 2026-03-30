import { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import { Search, Filter } from "lucide-react";

export default function News() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/news?published=true")
      .then((res) => res.json())
      .then((data) => setNews(data));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const filteredNews = news.filter((item: any) => {
    const matchesCategory =
      selectedCategory === "all" ||
      item.categoryId === parseInt(selectedCategory);
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-4 block">
            Berita & Artikel
          </span>
          <h1 className="text-4xl font-semibold text-[#0B090A] mb-6">
            Update Terbaru dari UKM Kami
          </h1>
          <p className="text-[#808080]">
            Temukan berita kegiatan, tips public speaking, dan prestasi terbaru
            dari anggota kami.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#808080]"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari berita..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#E0E0E0] rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#808080]"
                size={18}
              />
              <select
                className="pl-12 pr-10 py-4 bg-white border border-[#E0E0E0] rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item: any) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[30px] border border-dashed border-[#E0E0E0]">
            <p className="text-[#808080]">Tidak ada berita yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
