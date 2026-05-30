import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router';
import { useSession, toggleConnectNow, setActiveProvider } from '../lib/session-store';
import { providers } from '../lib/mock-data';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '\u25A3' },
  { to: '/roster', label: 'Roster', icon: '\u2638' },
  { to: '/calendar', label: 'Calendar', icon: '\u25A4' },
  { to: '/reports', label: 'Reports', icon: '\u25A8' },
  { to: '/profile', label: 'Profile & Settings', icon: '\u2699' },
];

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { provider, connectNow } = useSession();
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-[#0A0E11] text-white">
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 border-r border-[#1A222B] bg-[#0D1216] flex flex-col">
        <div className="px-6 pt-6 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-[10px] bg-gradient-to-br from-[#14B8A6] to-[#0B7F73] flex items-center justify-center font-bold text-white shadow-lg shadow-[#0E9E8E]/20">
              <span className="text-base">P</span>
            </div>
            <div>
              <div className="font-bold tracking-tight text-[15px]">Pinnacle</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Provider</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(item => {
            const active = item.to === '/' ? path === '/' : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-[#0E9E8E]/12 text-white border border-[#0E9E8E]/30'
                    : 'text-[#9BA8B5] hover:text-white hover:bg-[#161D24] border border-transparent'
                }`}
              >
                <span className={`text-[15px] ${active ? 'text-[#14B8A6]' : 'text-[#6B7785] group-hover:text-[#9BA8B5]'}`}>{item.icon}</span>
                <span>{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#14B8A6] pulse-dot" />}
              </Link>
            );
          })}
        </nav>

        {/* Provider switcher */}
        <div className="p-3 border-t border-[#1A222B]">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold px-2 mb-2">Acting as</div>
          <div className="space-y-1">
            {providers.map(p => {
              const active = p.id === provider.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProvider(p.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] text-left transition-colors ${active ? 'bg-[#161D24]' : 'hover:bg-[#11171C]'}`}
                >
                  <img src={p.photo} alt={p.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-[#222C36]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{p.name}</div>
                    <div className="text-[11px] text-[#6B7785]">{p.role === 'PT' ? 'Physical Therapist' : 'Coach'}</div>
                  </div>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[#1A222B] bg-[#0A0E11]/80 backdrop-blur-md sticky top-0 z-20 flex items-center px-8 gap-6">
          <div className="flex-1">
            <PageTitle path={path} />
          </div>

          {/* Connect Now toggle */}
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-[12px] bg-[#11171C] border border-[#1A222B]">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${connectNow ? 'bg-[#10B981] pulse-dot' : 'bg-[#4A5563]'}`} />
              <span className="text-[12px] font-semibold text-[#9BA8B5]">Connect Now</span>
            </div>
            <button
              onClick={toggleConnectNow}
              role="switch"
              aria-checked={connectNow}
              className={`relative h-[22px] w-[40px] rounded-full transition-colors duration-200 ${connectNow ? 'bg-[#0E9E8E]' : 'bg-[#222C36]'}`}
            >
              <span className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-md transition-all duration-200 ${connectNow ? 'left-[20px]' : 'left-0.5'}`} />
            </button>
          </div>

          <button className="h-9 w-9 rounded-[10px] border border-[#222C36] bg-[#11171C] hover:bg-[#161D24] transition-colors flex items-center justify-center text-[#9BA8B5]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>

          <div className="flex items-center gap-3">
            <img src={provider.photo} alt={provider.name} className="h-9 w-9 rounded-full object-cover ring-1 ring-[#222C36]" />
            <div className="text-right">
              <div className="text-[13px] font-semibold leading-tight">{provider.name}</div>
              <div className="text-[11px] text-[#6B7785]">{provider.role === 'PT' ? 'Physical Therapist' : 'Coach'}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PageTitle({ path }: { path: string }) {
  const map: Record<string, { title: string; sub: string }> = {
    '/': { title: 'Dashboard', sub: 'Today at a glance' },
    '/roster': { title: 'Roster', sub: 'Athletes you coach' },
    '/calendar': { title: 'Calendar', sub: 'Availability & booked sessions' },
    '/reports': { title: 'Reports', sub: 'Create and attach session reports' },
    '/profile': { title: 'Profile & Settings', sub: 'Manage your provider profile' },
  };
  let key = '/';
  if (path.startsWith('/athletes')) {
    return (
      <div>
        <div className="text-[18px] font-bold leading-tight">Athlete Detail</div>
        <div className="text-[12px] text-[#6B7785]">Profile, history & files</div>
      </div>
    );
  }
  for (const k of Object.keys(map)) {
    if (k === '/' ? path === '/' : path.startsWith(k)) key = k;
  }
  const { title, sub } = map[key];
  return (
    <div>
      <div className="text-[18px] font-bold leading-tight">{title}</div>
      <div className="text-[12px] text-[#6B7785]">{sub}</div>
    </div>
  );
}
