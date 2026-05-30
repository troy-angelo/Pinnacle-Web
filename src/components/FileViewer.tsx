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

const typeIcons: Record<string, string> = {
  plan: '📋',
  assessment: '📊',
  note: '📝',
  video: '🎥',
  invoice: '💰',
};

export function FileViewer({ files, emptyState = 'No files yet' }: { files: SharedFile[]; emptyState?: string }) {
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');

  const sorted = [...files].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.type.localeCompare(b.type);
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card padded={false}>
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold">Files & Reports</h3>
          <p className="text-[12px] text-[#6B7785] mt-0.5">{files.length} document{files.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1.5 rounded-[8px] text-[11px] font-semibold transition-colors ${
              sortBy === 'date'
                ? 'bg-[#161D24] text-white border border-[#222C36]'
                : 'text-[#9BA8B5] hover:text-white'
            }`}
          >
            By Date
          </button>
          <button
            onClick={() => setSortBy('type')}
            className={`px-3 py-1.5 rounded-[8px] text-[11px] font-semibold transition-colors ${
              sortBy === 'type'
                ? 'bg-[#161D24] text-white border border-[#222C36]'
                : 'text-[#9BA8B5] hover:text-white'
            }`}
          >
            By Type
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#1A222B]">
        {files.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="text-[12px] text-[#6B7785]">{emptyState}</div>
          </div>
        ) : (
          sorted.map((file) => (
            <div key={file.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[#0F1418] transition-colors cursor-pointer group">
              <div className="text-[24px]">{typeIcons[file.type] || '📄'}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-white truncate">{file.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Pill tone="neutral" small>{typeLabels[file.type] || file.type}</Pill>
                  <span className="text-[11px] text-[#6B7785]">{formatTime(file.createdAt)}</span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-[10px] bg-[#161D24] border border-[#222C36] text-[12px] font-semibold text-[#9BA8B5] hover:text-white hover:border-[#0E9E8E] transition-colors opacity-0 group-hover:opacity-100">
                Download
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
