import React, { useState, useEffect } from 'react';

export default function F1News({ limit = 5 }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('formula1');

  useEffect(() => {
    fetchNews();
  }, [source]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const endpoint = source === 'formula1' 
        ? `http://localhost:3001/api/scrape/news`
        : `http://localhost:3001/api/scrape/news/racefans`;
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Error al cargar noticias');
      }
      const data = await response.json();
      
      // Tomar solo el límite especificado
      const newsArray = data.news || data || [];
      setNews(newsArray.slice(0, limit));
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>📰</span>
          Últimas Noticias F1
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSource('formula1')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              source === 'formula1'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Formula1.com
          </button>
          <button
            onClick={() => setSource('racefans')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              source === 'racefans'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            RaceFans
          </button>
        </div>
      </div>

      {news.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay noticias disponibles</p>
      ) : (
        <div className="space-y-6">
          {news.map((item, index) => (
            <div
              key={index}
              className="border-l-4 border-red-600 pl-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex gap-4">
                  {item.image && (
                    <div className="flex-shrink-0 w-32 h-20 bg-gray-200 rounded overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 hover:text-red-600 mb-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{item.source}</span>
                      <span>{new Date(item.date).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
