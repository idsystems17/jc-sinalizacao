import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'colored';
}

export default function Logo({ className = 'h-10', showText = true, variant = 'colored' }: LogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="/logo-jc.jpg"
        alt="JC Sinalização e Serigrafia"
        className="h-10 w-auto object-contain rounded"
        onError={(e) => {
          // Fallback para texto se a imagem não carregar
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {/* Fallback texto (oculto enquanto a imagem carrega) */}
      <div className="hidden items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#F26522] to-[#FFB100] flex items-center justify-center shrink-0 shadow-md">
          <span className="font-sans font-black text-white text-base tracking-tighter">JC</span>
        </div>
        <div className="flex flex-col leading-tight text-left">
          <span className="text-lg font-black tracking-tight uppercase text-[#111115]">JC SINALIZAÇÃO</span>
          <span className="text-[8px] uppercase font-mono tracking-[0.2em] font-bold text-[#111115]/60">&amp; Serigrafia</span>
        </div>
      </div>
    </div>
  );
}
