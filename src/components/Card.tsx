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
      className={`rounded-2xl border border-[#E5E7EB] bg-white card-shadow ${padded ? 'p-6' : ''} ${className}`}
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
      <h2 className="text-[15px] font-bold text-[#111827]">{title}</h2>
      {subtitle && <p className="text-[12px] text-[#6B7280] mt-1">{subtitle}</p>}
    </div>
  );
}

type PillTone = 'neutral' | 'teal' | 'success' | 'warning' | 'danger' | 'info';

const toneStyles: Record<PillTone, string> = {
  neutral: 'bg-[#F3F4F6] text-[#6B7280]',
  teal: 'bg-[#0E9E8E]/10 text-[#0B7F73] border border-[#0E9E8E]/25',
  success: 'bg-[#10B981]/10 text-[#059669] border border-[#10B981]/25',
  warning: 'bg-[#F59E0B]/12 text-[#B45309] border border-[#F59E0B]/30',
  danger: 'bg-[#EF4444]/10 text-[#DC2626] border border-[#EF4444]/25',
  info: 'bg-[#3B82F6]/10 text-[#2563EB] border border-[#3B82F6]/25',
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
      className={`inline-flex items-center font-semibold rounded-full ${
        toneStyles[tone]
      } ${small ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'}`}
    >
      {children}
    </div>
  );
}
