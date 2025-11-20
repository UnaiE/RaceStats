import React from 'react';

export default function TeamNews({ news }) {
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📰</span>
        Noticias Recientes
      </h3>
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <h4 className="font-semibold text-gray-900 hover:text-blue-600">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              )}
              <div className="flex gap-4 text-xs text-gray-400 mt-2">
                {item.source && <span>{item.source}</span>}
                <span>{new Date(item.date).toLocaleDateString('es-ES')}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
