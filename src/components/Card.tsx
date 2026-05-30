import React from 'react';

export function Card({
  children,
  padded = true,
  className = '',
}: {
  children: React.ReactNode;
  padded?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[16px] border border-[#1A222B] bg-[#11171C] transition-colors hover:border-[#222C36] ${padded ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-[15px] font-bold text-white">{title}</h2>
      {subtitle && <p className="text-[12px] text-[#6B7785] mt-1">{subtitle}</p>}
    </div>
  );
}

type PillTone = 'neutral' | 'teal' | 'success' | 'warning' | 'danger' | 'info';

const toneStyles: Record<PillTone, string> = {
  neutral: 'bg-[#222C36] text-[#9BA8B5]',
  teal: 'bg-[#0E9E8E]/20 text-[#14B8A6] border border-[#0E9E8E]/40',
  success: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40',
  warning: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40',
  danger: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40',
  info: 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40',
};

export function Pill({
  children,
  tone = 'neutral',
  small = false,
}: {
  children: React.ReactNode;
  tone?: PillTone;
  small?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center font-semibold rounded-full transition-colors ${
        toneStyles[tone]
      } ${small ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'}`}
    >
      {children}
    </div>
  );
}
