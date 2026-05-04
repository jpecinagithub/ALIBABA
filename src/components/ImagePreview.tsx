'use client';

import { Download, ExternalLink } from 'lucide-react';

interface ImagePreviewProps {
  url: string;
  isVideo?: boolean;
}

export function ImagePreview({ url, isVideo }: ImagePreviewProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `alibaba-gallery-${Date.now()}.${isVideo ? 'mp4' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // CORS may block direct fetch of external URLs — open in new tab as fallback
      window.open(url, '_blank');
    }
  };

  const handleOpenNew = () => {
    window.open(url, '_blank');
  };

  if (isVideo) {
    return (
      <div className="space-y-4">
        <video
          src={url}
          controls
          className="w-full max-h-[500px] rounded-lg bg-black"
        />
        <div className="flex gap-2">
          <button
            onClick={handleOpenNew}
            className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir en nueva pestaña
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <img
        src={url}
        alt="Generated"
        className="w-full max-h-[500px] object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
      />
      <div className="flex gap-2">
        <button
          onClick={handleOpenNew}
          className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir en nueva pestaña
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar
        </button>
      </div>
    </div>
  );
}