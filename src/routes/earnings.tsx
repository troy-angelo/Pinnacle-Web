import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useSession } from '../lib/session-store';
import { sessions, earningsByProvider, getAthlete } from '../lib/mock-data';
import { Card, Pill } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { currency, formatDay } from '../lib/format';

export const Route = createFileRoute('/earnings')({ component: Earnings });

function Earnings() {
  const { provider } = useSession();
  const earn = earningsByProvider[provider.id];
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');

  const completed = sessions
    .filter(s => s.providerId === provider.id && s.status === 'Completed')
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const bars = [40, 65, 30, 80, 55, 90, 70];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-8 max-w-[1280px] mx-auto space-y-7">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="!p-5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#6B7280] font-semibold">Today</div>
          <div className="text-[28px] font-bold tracking-tight mt-2.5 text-[#111827]">{currency(earn.daily)}</div>
          <div className="text-[12px] text-[#9CA3AF] mt-0.5">paid out</div>
        </Card>
        <Card className="!p-5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#6B7280] font-semibold">This Week</div>
          <div className="text-[28px] font-bold tracking-tight mt-2.5 text-[#0E9E8E]">{currency(earn.weekly)}</div>
          <div className="mt-1"><Pill tone="success" small>↑ 13% vs last week</Pill></div>
        </Card>
        <Card className="!p-5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#6B7280] font-semibold">This Month</div>
          <div className="text-[28px] font-bold tracking-tight mt-2.5 text-[#111827]">{currency(earn.monthly)}</div>
          <div className="mt-1"><Pill tone="success" small>↑ 21% vs last month</Pill></div>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-bold text-[#111827]">Earnings Trend</h2>
            <div className="text-[12px] text-[#6B7280] mt-0.5">Daily breakdown</div>
          </div>
          <div className="flex p-1 rounded-lg bg-[#F3F4F6]">
            {(['weekly', 'monthly'] as const).map(k => (
              <button key={k} onClick={() => setTab(k)} className={`px-4 text-[12px] font-semibold py-1.5 rounded-md capitalize transition-all ${tab === k ? 'bg-white text-[#111827] card-shadow' : 'text-[#6B7280] hover:text-[#374151]'}`}>{k}</button>
            ))}
          </div>
        </div>
        <div className="h-[180px] flex items-end gap-3">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-md bg-gradient-to-t from-[#0E9E8E]/30 to-[#0E9E8E] transition-all" style={{ height: `${h * 1.6}px` }} />
              <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold">{days[i]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Payout history */}
      <Card padded={false}>
        <div className="px-6 pt-5 pb-4 border-b border-[#E5E7EB]">
          <h2 className="text-[15px] font-bold text-[#111827]">Recent Payouts</h2>
          <div className="text-[12px] text-[#6B7280] mt-0.5">Completed sessions</div>
        </div>
        <div className="divide-y divide-[#F1F2F4]">
          {completed.length === 0 && <div className="px-6 py-10 text-center text-[#9CA3AF] text-sm">No payouts yet.</div>}
          {completed.map(s => {
            const a = getAthlete(s.athleteId)!;
            return (
              <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                <Avatar name={a.name} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#111827]">{a.name}</div>
                  <div className="text-[12px] text-[#6B7280] mt-0.5">{s.type} · {formatDay(s.date)}</div>
                </div>
                <Pill tone="success" small>Paid</Pill>
                <div className="text-[14px] font-bold text-[#111827] w-20 text-right tabular-nums">{currency(provider.hourlyRate)}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
