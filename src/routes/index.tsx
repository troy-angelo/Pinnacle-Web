import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useSession, toggleConnectNow } from '../lib/session-store';
import { sessions, earningsByProvider, rosterRequests, adminMessages, getAthlete } from '../lib/mock-data';
import { Card } from '../components/Card';
import { currency, formatTime, minutesUntil, sameDay } from '../lib/format';
import type { Provider } from '../lib/types';

export const Route = createFileRoute('/')({ component: Dashboard });

/* ── Unified icon set — 1.8 stroke, currentColor ── */
function Icon({ name, className = '', size = 20 }: { name: string; className?: string; size?: number }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className };
  switch (name) {
    case 'calendar':
      return <svg {...c}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case 'dollar':
      return <svg {...c}><circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.4 0-2.5.7-2.5 2s1.1 1.7 2.5 2 2.5.7 2.5 2-1.1 2-2.5 2A2.5 2 0 0 1 9.5 16"/><path d="M12 6v1.5M12 16.5V18"/></svg>;
    case 'star':
      return <svg {...c} fill="currentColor" stroke="none"><path d="m12 2 2.9 6.3 6.8.7-5 4.6 1.4 6.7L12 17.6 5.9 20.3l1.4-6.7-5-4.6 6.8-.7z"/></svg>;
    case 'users':
      return <svg {...c}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'report':
      return <svg {...c}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg>;
    case 'message':
      return <svg {...c}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>;
    case 'alert':
      return <svg {...c}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>;
    case 'chevron':
      return <svg {...c}><path d="m9 18 6-6-6-6"/></svg>;
    case 'check':
      return <svg {...c}><path d="M20 6 9 17l-5-5"/></svg>;
    default:
      return null;
  }
}

function Dashboard() {
  const { provider, connectNow } = useSession();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(i); }, []);

  const today = new Date(now);
  const mySessions = sessions.filter(s => s.providerId === provider.id);
  const todaysSessions = mySessions.filter(s => s.status === 'Upcoming' && sameDay(new Date(s.date), today));
  const upcoming = mySessions.filter(s => s.status === 'Upcoming').sort((a, b) => +new Date(a.date) - +new Date(b.date)).slice(0, 3);
  const earn = earningsByProvider[provider.id];

  const outstandingReports = mySessions.filter(s => s.status === 'Completed' && !s.reportAttached);
  const requests = rosterRequests;
  const credExpiry = new Date(provider.credentialExpiry);
  const daysToExpiry = Math.round((+credExpiry - now) / (1000 * 60 * 60 * 24));
  const credentialWarning = daysToExpiry < 90;
  const messages = adminMessages;

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-[1500px] mx-auto w-full">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl lg:text-[34px] font-bold tracking-tight text-[#111827]">Welcome back, {provider.name.split(' ')[0]}</h1>
        <p className="text-[14px] text-[#6B7280] mt-1.5">Here's what's happening with your practice today.</p>
      </div>

      {/* Hero — Connect Now */}
      <ConnectHero connectNow={connectNow} />

      {/* Stats Row */}
      <StatsRow provider={provider} todaysCount={todaysSessions.length} weeklyEarn={earn.weekly} connectNow={connectNow} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodaysSessions sessions={upcoming} />
        </div>
        <div>
          <ActionItems
            outstanding={outstandingReports}
            requests={requests}
            credentialWarning={credentialWarning}
            daysToExpiry={daysToExpiry}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
}

function ConnectHero({ connectNow }: { connectNow: boolean }) {
  return (
    <Card className="!p-0 overflow-hidden card-shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Left: toggle — primary feature emphasis */}
        <div className="md:col-span-3 p-7 lg:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#6B7280]">Connect Now</span>
            <span className="text-[11px] font-semibold text-[#9CA3AF]">· Instant athlete availability</span>
          </div>
          <div className="mt-5 flex items-center gap-5">
            <button
              onClick={toggleConnectNow}
              role="switch"
              aria-checked={connectNow}
              className={`relative h-[60px] w-[180px] rounded-full transition-all duration-300 flex-shrink-0 flex items-center ${
                connectNow ? 'bg-[#0E9E8E]' : 'bg-[#E5E7EB]'
              }`}
            >
              <span
                className={`absolute h-[52px] w-[52px] rounded-full bg-white shadow-md transition-all duration-300 ${
                  connectNow ? 'left-[124px]' : 'left-1'
                }`}
              />
              <span className={`absolute font-bold text-[15px] tracking-wide transition-all duration-300 ${
                connectNow ? 'left-7 text-white' : 'right-6 text-[#9CA3AF]'
              }`}>
                {connectNow ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </button>
          </div>
        </div>

        {/* Right: status */}
        <div className={`md:col-span-2 p-7 lg:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[#E5E7EB] ${
          connectNow ? 'bg-[#0E9E8E]/[0.04]' : 'bg-[#FAFBFC]'
        }`}>
          {connectNow ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#0E9E8E] pulse-ring" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#0E9E8E]" />
                </span>
                <div className="text-[17px] font-bold text-[#111827]">Window is live now</div>
              </div>
              <p className="text-[13px] text-[#6B7280] leading-relaxed">Athletes can connect with you until 6:00 PM</p>
              <Link to="/calendar" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0E9E8E] hover:text-[#0B7F73] mt-2">
                <Icon name="calendar" size={15} /> View today's window
              </Link>
            </div>
          ) : (
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#9CA3AF]">Next window opens in</div>
              <div className="text-[40px] leading-none font-bold text-[#111827] mt-2">47 min</div>
              <p className="text-[13px] text-[#6B7280] mt-2">Today at 4:00 PM · scheduled block</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function StatsRow({
  provider,
  todaysCount,
  weeklyEarn,
  connectNow,
}: {
  provider: Provider;
  todaysCount: number;
  weeklyEarn: number;
  connectNow: boolean;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard icon="calendar" label="SESSIONS TODAY" value={String(todaysCount)} sub="2 upcoming" />
      <StatCard icon="dollar" label="THIS WEEK'S EARNINGS" value={currency(weeklyEarn)} sub="+18% vs last week" trend accent />
      <StatCard icon="star" label="AVERAGE RATING" value={provider.rating.toFixed(1)} sub={`From ${provider.reviews} reviews`} starIcon />
      <StatCard icon="users" label="CONNECT NOW SESSIONS THIS MONTH" value={connectNow ? '8' : '6'} sub="+23% vs last month" trend />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
  trend,
  starIcon,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  trend?: boolean;
  starIcon?: boolean;
}) {
  return (
    <Card className="!p-5">
      <div className="h-10 w-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">
        <Icon name={icon} size={18} className={starIcon ? 'text-[#F59E0B]' : ''} />
      </div>
      <div className="mt-4 text-[10.5px] uppercase tracking-[0.08em] font-bold text-[#6B7280] leading-tight">{label}</div>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className={`text-[28px] leading-none font-bold ${accent ? 'text-[#0E9E8E]' : 'text-[#111827]'}`}>{value}</span>
        {starIcon && <Icon name="star" size={18} className="text-[#F59E0B]" />}
      </div>
      <div className={`text-[12px] mt-2 ${trend ? 'text-[#0E9E8E] font-semibold' : 'text-[#9CA3AF]'} flex items-center gap-1`}>
        {trend && <span className="text-[#0E9E8E]">↑</span>}{sub}
      </div>
    </Card>
  );
}

function TodaysSessions({ sessions: list }: { sessions: typeof sessions }) {
  return (
    <Card padded={false} className="card-shadow-lg">
      <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
        <h2 className="text-[13px] uppercase tracking-[0.08em] font-bold text-[#111827]">Today's Sessions</h2>
        <Link to="/calendar" className="text-[13px] text-[#0E9E8E] hover:text-[#0B7F73] font-semibold">
          View full schedule
        </Link>
      </div>
      <div className="divide-y divide-[#F1F2F4]">
        {list.length === 0 && (
          <div className="px-6 py-12 text-center text-[#9CA3AF]">No sessions scheduled for today.</div>
        )}
        {list.map(s => {
          const a = getAthlete(s.athleteId)!;
          const mins = minutesUntil(s.date);
          const showJoin = mins >= -5 && mins <= 120;
          const initials = a.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
          return (
            <div key={s.id} className="px-6 py-4 flex items-center gap-4 card-hover">
              <div className="flex-shrink-0 h-11 w-11 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <span className="text-[13px] font-bold text-[#374151]">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-[#111827]">{a.name}</div>
                <div className="text-[13px] text-[#6B7280] mt-0.5">{s.type}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[14px] font-semibold text-[#111827]">{formatTime(s.date)}</div>
                  <div className="text-[12px] text-[#9CA3AF]">45 min</div>
                </div>
                {showJoin ? (
                  <button className="px-5 py-2.5 rounded-lg bg-[#0E9E8E] hover:bg-[#0B7F73] text-[13px] font-semibold text-white transition-colors whitespace-nowrap">
                    Join Session
                  </button>
                ) : (
                  <button className="px-5 py-2.5 rounded-lg border border-[#D1D5DB] hover:bg-[#F8F9FA] text-[13px] font-semibold text-[#374151] transition-colors whitespace-nowrap">
                    View Details
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ActionItems({
  outstanding,
  requests,
  credentialWarning,
  daysToExpiry,
  messages,
}: {
  outstanding: typeof sessions;
  requests: typeof rosterRequests;
  credentialWarning: boolean;
  daysToExpiry: number;
  messages: typeof adminMessages;
}) {
  return (
    <Card padded={false} className="card-shadow-lg">
      <div className="px-6 py-5 border-b border-[#E5E7EB]">
        <h2 className="text-[13px] uppercase tracking-[0.08em] font-bold text-[#111827]">Action Items</h2>
      </div>
      <div className="p-3 space-y-2">
        {outstanding.length > 0 && (
          <ActionItemRow
            title="Write Report"
            subtitle={`${outstanding.length} ${outstanding.length === 1 ? 'session needs' : 'sessions need'} reports`}
            icon="report"
            to="/reports"
            style="teal"
          />
        )}
        {requests.length > 0 && (
          <ActionItemRow
            title="Roster Review"
            subtitle={`${requests.length} ${requests.length === 1 ? 'athlete' : 'athletes'} pending review`}
            icon="users"
            to="/roster"
            style="outline"
          />
        )}
        {messages.length > 0 && (
          <ActionItemRow
            title="Messages"
            subtitle={`${messages.length} unread ${messages.length === 1 ? 'message' : 'messages'}`}
            icon="message"
            to="/reports"
            style="grey"
          />
        )}
        {credentialWarning && (
          <ActionItemRow
            title="Credential Expiring Soon"
            subtitle={`Your CPR certification expires in ${daysToExpiry} days`}
            icon="alert"
            to="/profile"
            style="warning"
          />
        )}
        {!outstanding.length && !requests.length && !messages.length && !credentialWarning && (
          <div className="px-4 py-10 text-center text-[#9CA3AF] text-sm flex flex-col items-center gap-2">
            <Icon name="check" size={22} className="text-[#0E9E8E]" />
            <p>All caught up!</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function ActionItemRow({
  title,
  subtitle,
  icon,
  to,
  style,
}: {
  title: string;
  subtitle: string;
  icon: string;
  to: string;
  style: 'teal' | 'outline' | 'grey' | 'warning';
}) {
  const styles = {
    teal: { wrap: 'border border-[#E5E7EB] hover:border-[#0E9E8E]/40 bg-white', iconWrap: 'bg-[#0E9E8E] text-white' },
    outline: { wrap: 'border border-[#E5E7EB] hover:border-[#0E9E8E]/40 bg-white', iconWrap: 'border border-[#0E9E8E]/40 text-[#0E9E8E] bg-white' },
    grey: { wrap: 'border border-[#E5E7EB] hover:border-[#D1D5DB] bg-white', iconWrap: 'border border-[#D1D5DB] text-[#6B7280] bg-white' },
    warning: { wrap: 'border border-[#F59E0B]/30 border-l-4 border-l-[#F59E0B] bg-[#FFFBEB]', iconWrap: 'border border-[#F59E0B]/40 text-[#F59E0B] bg-white' },
  };
  const s = styles[style];
  return (
    <Link
      to={to}
      className={`group p-3.5 rounded-xl flex items-center gap-3.5 transition-all duration-200 ${s.wrap}`}
    >
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${s.iconWrap}`}>
        <Icon name={icon} size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold text-[#111827]">{title}</div>
        <div className="text-[12px] text-[#6B7280] mt-0.5">{subtitle}</div>
      </div>
      <span className="text-[#9CA3AF] group-hover:text-[#6B7280] transition-colors flex-shrink-0">
        <Icon name="chevron" size={18} />
      </span>
    </Link>
  );
}
