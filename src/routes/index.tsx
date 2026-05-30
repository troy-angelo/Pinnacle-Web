import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useSession, toggleConnectNow } from '../lib/session-store';
import { sessions, athletes, earningsByProvider, rosterRequests, adminMessages, getAthlete } from '../lib/mock-data';
import { Card, SectionTitle, Pill } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { currency, formatDay, formatTime, minutesUntil, sameDay } from '../lib/format';
import type { Provider } from '../lib/types';

export const Route = createFileRoute('/')({ component: Dashboard });

function Dashboard() {
  const { provider, connectNow } = useSession();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(i); }, []);

  const today = new Date(now);
  const mySessions = sessions.filter(s => s.providerId === provider.id);
  const todaysSessions = mySessions.filter(s => s.status === 'Upcoming' && sameDay(new Date(s.date), today)).sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const upcoming = mySessions.filter(s => s.status === 'Upcoming').sort((a, b) => +new Date(a.date) - +new Date(b.date)).slice(0, 5);
  const earn = earningsByProvider[provider.id];

  const outstandingReports = mySessions.filter(s => s.status === 'Completed' && !s.reportAttached);
  const requests = rosterRequests; // shared seed
  const credExpiry = new Date(provider.credentialExpiry);
  const daysToExpiry = Math.round((+credExpiry - now) / (1000 * 60 * 60 * 24));
  const credentialWarning = daysToExpiry < 90;
  const messages = adminMessages;

  const hasActionItems = outstandingReports.length > 0 || requests.length > 0 || credentialWarning;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Greeting */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[#6B7785] text-[12px] uppercase tracking-[0.18em] font-semibold">{today.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <h1 className="text-[28px] font-bold tracking-tight mt-1">Welcome back, {provider.name.split(' ')[0]}.</h1>
        </div>
        <div className="text-right text-[12px] text-[#6B7785]">
          {connectNow ? <span className="text-[#10B981] font-semibold">● Visible to athletes for instant matching</span> : <span>○ Hidden from instant matching pool</span>}
        </div>
      </div>

      {/* Today at a Glance */}
      <TodayStrip provider={provider} connectNow={connectNow} todaysCount={todaysSessions.length} dailyEarn={earn.daily} />

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <UpcomingSessions sessions={upcoming} />
          {hasActionItems && (
            <ActionItems
              outstanding={outstandingReports}
              requests={requests}
              credentialWarning={credentialWarning}
              daysToExpiry={daysToExpiry}
              messages={messages}
            />
          )}
        </div>
        <div className="space-y-6">
          <EarningsWidget earn={earn} />
          <QuickStats provider={provider} />
        </div>
      </div>
    </div>
  );
}

function TodayStrip({ provider, connectNow, todaysCount, dailyEarn }: { provider: Provider; connectNow: boolean; todaysCount: number; dailyEarn: number }) {
  return (
    <div className="rounded-[20px] border border-[#1A222B] bg-gradient-to-br from-[#11171C] to-[#0F1418] p-6 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#0E9E8E]/10 blur-3xl pointer-events-none" />
      <div className="grid grid-cols-4 gap-6 relative">
        {/* Connect Now */}
        <div className="col-span-1">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Connect Now</div>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={toggleConnectNow}
              role="switch"
              aria-checked={connectNow}
              className={`relative h-[34px] w-[60px] rounded-full transition-colors duration-200 ${connectNow ? 'bg-[#0E9E8E] teal-glow' : 'bg-[#222C36]'}`}
            >
              <span className={`absolute top-1 h-[26px] w-[26px] rounded-full bg-white shadow-md transition-all duration-200 ${connectNow ? 'left-[30px]' : 'left-1'}`} />
            </button>
            <div>
              <div className={`text-[15px] font-bold ${connectNow ? 'text-white' : 'text-[#9BA8B5]'}`}>{connectNow ? 'Active' : 'Off'}</div>
              <div className="text-[11px] text-[#6B7785]">{connectNow ? 'In matching pool' : 'Toggle to go live'}</div>
            </div>
          </div>
        </div>

        <Stat label="Sessions Today" value={String(todaysCount)} sub={todaysCount === 1 ? 'session scheduled' : 'sessions scheduled'} />
        <Stat label="Today's Earnings" value={currency(dailyEarn)} sub={`${currency(provider.hourlyRate)}/hr base rate`} accent />
        <Stat label="Average Rating" value={provider.rating.toFixed(1)} sub={`${provider.reviews} reviews`} icon="★" />
      </div>
    </div>
  );
}

function Stat({ label, value, sub, accent, icon }: { label: string; value: string; sub: string; accent?: boolean; icon?: string }) {
  return (
    <div className="col-span-1">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        {icon && <span className="text-[#F59E0B] text-[18px]">{icon}</span>}
        <div className={`text-[28px] font-bold tracking-tight ${accent ? 'text-[#14B8A6]' : 'text-white'}`}>{value}</div>
      </div>
      <div className="text-[11px] text-[#6B7785] mt-0.5">{sub}</div>
    </div>
  );
}

function UpcomingSessions({ sessions: list }: { sessions: typeof sessions }) {
  return (
    <Card padded={false}>
      <div className="px-5 pt-5 pb-3 flex items-end justify-between">
        <div>
          <h2 className="text-[15px] font-bold">Upcoming Sessions</h2>
          <div className="text-[12px] text-[#6B7785] mt-0.5">Next {list.length} bookings on your schedule</div>
        </div>
        <Link to="/roster" className="text-[12px] text-[#14B8A6] hover:text-white font-semibold">View roster →</Link>
      </div>
      <div className="divide-y divide-[#1A222B]">
        {list.length === 0 && <div className="px-5 py-8 text-center text-[#6B7785] text-sm">No upcoming sessions.</div>}
        {list.map(s => {
          const a = getAthlete(s.athleteId)!;
          const mins = minutesUntil(s.date);
          const showJoin = mins >= -5 && mins <= 15;
          return (
            <div key={s.id} className="px-5 py-4 flex items-center gap-4 card-hover">
              <Avatar name={a.name} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-[14px]">{a.name}</div>
                  {showJoin && <Pill tone="teal">Starting soon</Pill>}
                </div>
                <div className="text-[12px] text-[#9BA8B5] mt-0.5">{s.type}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-semibold">{formatDay(s.date)}</div>
                <div className="text-[12px] text-[#6B7785]">{formatTime(s.date)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/athletes/$athleteId" params={{ athleteId: a.id }} className="px-3.5 py-2 rounded-[10px] border border-[#222C36] bg-[#161D24] hover:bg-[#1C242C] text-[12px] font-semibold text-[#9BA8B5] hover:text-white transition-colors">View Profile & Files</Link>
                {showJoin && (
                  <button className="px-3.5 py-2 rounded-[10px] bg-[#0E9E8E] hover:bg-[#0B7F73] text-[12px] font-bold text-white transition-colors teal-glow">Join</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function EarningsWidget({ earn }: { earn: { daily: number; weekly: number; monthly: number } }) {
  const [tab, setTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const labels = { daily: 'Today', weekly: 'This Week', monthly: 'This Month' };
  const subs = { daily: 'vs $380 yesterday', weekly: 'vs $1,920 last week', monthly: 'vs $7,400 last month' };
  const trend = { daily: '+14%', weekly: '+13%', monthly: '+21%' };
  return (
    <Card>
      <SectionTitle title="Earnings" />
      <div className="flex p-1 rounded-[10px] bg-[#0A0E11] border border-[#1A222B]">
        {(['daily','weekly','monthly'] as const).map(k => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 text-[12px] font-semibold py-1.5 rounded-[8px] capitalize transition-all ${tab === k ? 'bg-[#161D24] text-white' : 'text-[#6B7785] hover:text-[#9BA8B5]'}`}>{k}</button>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-[11px] text-[#6B7785] uppercase tracking-[0.18em] font-semibold">{labels[tab]}</div>
        <div className="text-[36px] font-bold tracking-tight mt-1 text-white">{currency(earn[tab])}</div>
        <div className="flex items-center gap-2 mt-1">
          <Pill tone="success">↑ {trend[tab]}</Pill>
          <span className="text-[11px] text-[#6B7785]">{subs[tab]}</span>
        </div>
      </div>
      <div className="mt-5 h-[72px] flex items-end gap-1.5">
        {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-[4px] bg-gradient-to-t from-[#0E9E8E]/20 to-[#14B8A6]/60" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[#4A5563] uppercase tracking-wider font-semibold">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </Card>
  );
}

function QuickStats({ provider }: { provider: Provider }) {
  return (
    <Card>
      <SectionTitle title="At a glance" />
      <div className="space-y-4">
        <Row label="Active athletes" value={String(athletes.length)} />
        <Row label="Hourly rate" value={currency(provider.hourlyRate)} />
        <Row label="Sessions this month" value="24" />
        <Row label="Profile completeness" value="" custom={(
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 rounded-full bg-[#1C242C] overflow-hidden"><div className="h-full bg-[#14B8A6]" style={{ width: '85%' }} /></div>
            <span className="text-[12px] font-semibold text-white">85%</span>
          </div>
        )} />
      </div>
    </Card>
  );
}
function Row({ label, value, custom }: { label: string; value: string; custom?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#9BA8B5]">{label}</span>
      {custom ?? <span className="text-[13px] font-semibold text-white">{value}</span>}
    </div>
  );
}

function ActionItems({ outstanding, requests, credentialWarning, daysToExpiry, messages }: {
  outstanding: typeof sessions;
  requests: typeof rosterRequests;
  credentialWarning: boolean;
  daysToExpiry: number;
  messages: typeof adminMessages;
}) {
  const totalCount = outstanding.length + requests.length + (credentialWarning ? 1 : 0) + messages.length;
  return (
    <Card padded={false}>
      <div className="px-5 pt-5 pb-3 flex items-end justify-between">
        <div>
          <h2 className="text-[15px] font-bold flex items-center gap-2">Action Items <Pill tone="warning">{totalCount}</Pill></h2>
          <div className="text-[12px] text-[#6B7785] mt-0.5">Items needing your attention</div>
        </div>
      </div>
      <div className="divide-y divide-[#1A222B]">
        {outstanding.length > 0 && (
          <ActionGroup title="Outstanding post-session reports" tone="warning" count={outstanding.length}>
            {outstanding.map(s => {
              const a = getAthlete(s.athleteId)!;
              return (
                <ActionRow key={s.id} title={`${a.name} · ${s.type}`} sub={`Completed ${formatDay(s.date)} · Report required`} cta="Write Report" to="/reports" />
              );
            })}
          </ActionGroup>
        )}
        {requests.length > 0 && (
          <ActionGroup title="Roster requests" tone="info" count={requests.length}>
            {requests.map(r => {
              const a = getAthlete(r.athleteId)!;
              return (
                <ActionRow key={r.id} title={`${a.name} wants to join your roster`} sub={`“${r.message}”`} cta="Review" to="/roster" />
              );
            })}
          </ActionGroup>
        )}
        {credentialWarning && (
          <ActionGroup title="Expiring credentials" tone="danger" count={1}>
            <ActionRow
              title={`Credentials expire in ${daysToExpiry} days`}
              sub="Upload renewed certifications to stay verified."
              cta="Update"
              to="/profile"
            />
          </ActionGroup>
        )}
        {messages.length > 0 && (
          <ActionGroup title="Messages from Pinnacle" tone="teal" count={messages.length}>
            {messages.map(m => (
              <ActionRow key={m.id} title={m.subject} sub={m.preview} cta="Open" to="/reports" />
            ))}
          </ActionGroup>
        )}
      </div>
    </Card>
  );
}

function ActionGroup({ title, tone, count, children }: { title: string; tone: 'warning' | 'info' | 'danger' | 'teal'; count: number; children: React.ReactNode }) {
  return (
    <div className="px-5 py-3">
      <div className="flex items-center gap-2 mb-2">
        <Pill tone={tone}>{count}</Pill>
        <span className="text-[12px] font-semibold text-[#9BA8B5] uppercase tracking-wider">{title}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function ActionRow({ title, sub, cta, to }: { title: string; sub: string; cta: string; to: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-[12px] bg-[#0F1418] border border-[#1A222B] hover:border-[#222C36] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-white">{title}</div>
        <div className="text-[12px] text-[#6B7785] mt-0.5 truncate">{sub}</div>
      </div>
      <Link to={to} className="px-3.5 py-2 rounded-[10px] bg-[#0E9E8E] hover:bg-[#0B7F73] text-[12px] font-bold text-white transition-colors">{cta}</Link>
    </div>
  );
}
