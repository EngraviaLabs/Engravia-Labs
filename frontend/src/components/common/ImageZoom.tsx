'use client';
import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '../../lib/utils';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const imageUrl = getImageUrl(src);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos(p => ({ ...p, show: false }));
  };

  return (
    <div
      className={`relative overflow-hidden cursor-crosshair group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        unoptimized
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="50vw"
        priority
      />
      {zoomPos.show && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-10"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            backgroundSize: '250%',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
}
