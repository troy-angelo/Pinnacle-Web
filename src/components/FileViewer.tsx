import { useState } from 'react';
import { Card, Pill } from './Card';
import type { SharedFile } from '../lib/types';

const typeLabels: Record<string, string> = {
  plan: 'Training Plan',
  assessment: 'Assessment',
  note: 'Note',
  video: 'Video',
  invoice: 'Invoice',
};

function FileIcon({ type }: { type: string }) {
  const c = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'plan':
      return <svg {...c}><path d="M9 11H3v10h6zM21 3h-6v18h6zM15 7H9v14h6z"/></svg>;
    case 'assessment':
      return <svg {...c}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
    case 'note':
      return <svg {...c}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>;
    case 'video':
      return <svg {...c}><path d="m22 8-6 4 6 4z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>;
    case 'invoice':
      return <svg {...c}><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h3.5a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 0 0 3H14"/></svg>;
    default:
      return <svg {...c}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>;
  }
}

export function FileViewer({ files, emptyState = 'No files yet' }: { files: SharedFile[]; emptyState?: string }) {
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');

  const sorted = [...files].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.type.localeCompare(b.type);
  });

  const formatShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card padded={false}>
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-[#111827]">Files &amp; Reports</h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">{files.length} document{files.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1.5 rounded-[8px] text-[11px] font-semibold transition-colors ${
              sortBy === 'date'
                ? 'bg-[#0E9E8E]/10 text-[#0B7F73] border border-[#0E9E8E]/25'
                : 'text-[#6B7280] hover:text-[#111827] border border-transparent'
            }`}
          >
            By Date
          </button>
          <button
            onClick={() => setSortBy('type')}
            className={`px-3 py-1.5 rounded-[8px] text-[11px] font-semibold transition-colors ${
              sortBy === 'type'
                ? 'bg-[#0E9E8E]/10 text-[#0B7F73] border border-[#0E9E8E]/25'
                : 'text-[#6B7280] hover:text-[#111827] border border-transparent'
            }`}
          >
            By Type
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#E5E7EB] border-t border-[#E5E7EB]">
        {files.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="text-[12px] text-[#6B7280]">{emptyState}</div>
          </div>
        ) : (
          sorted.map((file) => (
            <div key={file.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[#F8F9FA] transition-colors cursor-pointer group">
              <div className="h-10 w-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] shrink-0">
                <FileIcon type={file.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#111827] truncate">{file.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Pill tone="neutral" small>{typeLabels[file.type] || file.type}</Pill>
                  <span className="text-[11px] text-[#6B7280]">{formatShort(file.createdAt)}</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-[10px] bg-white border border-[#E5E7EB] text-[12px] font-semibold text-[#6B7280] hover:text-[#111827] hover:border-[#0E9E8E] transition-colors opacity-0 group-hover:opacity-100">
                Download
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
