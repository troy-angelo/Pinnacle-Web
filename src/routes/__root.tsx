import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { useSession } from '../lib/session-store';
import { providers } from '../lib/mock-data';
import { setActiveProvider } from '../lib/session-store';

function Icon({ name, className = '' }: { name: string; className?: string }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className };
  switch (name) {
    case 'dashboard':
      return <svg {...common}><path d="M3 12 12 3l9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"/></svg>;
    case 'athletes':
      return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'schedule':
      return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case 'earnings':
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.4 0-2.5.7-2.5 2s1.1 1.7 2.5 2 2.5.7 2.5 2-1.1 2-2.5 2A2.5 2 0 0 1 9.5 16"/><path d="M12 6v1.5M12 16.5V18"/></svg>;
    case 'reports':
      return <svg {...common}><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></svg>;
    case 'profile':
      return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 14 0v1"/></svg>;
    default:
      return null;
  }
}

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/roster', label: 'My Athletes', icon: 'athletes' },
  { to: '/calendar', label: 'Schedule', icon: 'schedule' },
  { to: '/earnings', label: 'Earnings', icon: 'earnings' },
  { to: '/reports', label: 'Reports', icon: 'reports' },
  { to: '/profile', label: 'Profile', icon: 'profile' },
];

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { provider } = useSession();
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-[#111827]">
      {/* Sidebar */}
      <aside className="w-[208px] lg:w-[248px] shrink-0 border-r border-[#E5E7EB] bg-white flex flex-col">
        <div className="px-7 pt-7 pb-9">
          <div className="text-[19px] font-extrabold tracking-[0.22em] text-[#111827]">PINNACLE</div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(item => {
            const active = item.to === '/' ? path === '/' : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-3 pl-4 pr-3.5 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[#0E9E8E]/8 text-[#0B7F73]'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA]'
                }`}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#0E9E8E]" />}
                <Icon name={item.icon} className={active ? 'text-[#0E9E8E]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round"/><path d="M12 17h.01" strokeLinecap="round"/></svg>
              <span className="text-[12px] font-semibold text-[#111827]">Need help?</span>
            </div>
            <div className="text-[12px] text-[#0E9E8E] font-semibold mt-1 cursor-pointer hover:text-[#0B7F73]">Visit our Help Center</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[#E5E7EB] bg-white sticky top-0 z-20 flex items-center px-4 sm:px-6 lg:px-8 gap-4 sm:gap-6">
          <div className="flex-1" />

          <button className="h-9 w-9 rounded-lg hover:bg-[#F8F9FA] transition-colors flex items-center justify-center text-[#6B7280] relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>

          <ProfileSwitcher />
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ProfileSwitcher() {
  const { provider } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative pl-5 border-l border-[#E5E7EB]">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 hover:bg-[#F8F9FA] rounded-lg px-2 py-1.5 transition-colors"
      >
        <img src={provider.photo} alt={provider.name} className="h-9 w-9 rounded-full object-cover ring-1 ring-[#E5E7EB]" />
        <div className="text-left">
          <div className="text-[14px] font-semibold leading-tight text-[#111827]">{provider.name}</div>
          <div className="text-[12px] text-[#6B7280]">{provider.role === 'PT' ? 'Physical Therapist' : 'Coach'}</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[#E5E7EB] bg-white shadow-lg z-40 p-2">
            <div className="px-2 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#9CA3AF]">Switch Profile</div>
            {providers.map(p => {
              const active = p.id === provider.id;
              return (
                <button
                  key={p.id}
                  onClick={() => { setActiveProvider(p.id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors ${
                    active ? 'bg-[#0E9E8E]/8' : 'hover:bg-[#F8F9FA]'
                  }`}
                >
                  <img src={p.photo} alt={p.name} className="h-9 w-9 rounded-full object-cover ring-1 ring-[#E5E7EB]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate text-[#111827]">{p.name}</div>
                    <div className="text-[11px] text-[#6B7280]">{p.role === 'PT' ? 'Physical Therapist' : 'Coach'}</div>
                  </div>
                  {active && <span className="h-2 w-2 rounded-full bg-[#0E9E8E]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
