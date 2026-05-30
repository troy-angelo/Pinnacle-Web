import { createFileRoute, Link } from '@tanstack/react-router';
import { athletes, sessions, files, getAthlete } from '../../lib/mock-data';
import { Card, SectionTitle, Pill } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { formatDay, formatTime } from '../../lib/format';
import type { Athlete } from '../../lib/types';

export const Route = createFileRoute('/athletes/$athleteId')({
  component: AthleteDetail,
});

function AthleteDetail() {
  const { athleteId } = Route.useParams();
  const athlete = getAthlete(athleteId);

  if (!athlete) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto">
        <Card>
          <div className="py-12 text-center text-[#6B7785]">Athlete not found</div>
        </Card>
      </div>
    );
  }

  const athleteSessions = sessions.filter(
    s => s.athleteId === athlete.id && s.status === 'Completed'
  ).sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const athleteFiles = files.filter(f => f.athleteId === athlete.id);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header & Navigation */}
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-4">
          <Avatar name={athlete.name} size={80} />
          <div>
            <h1 className="text-[28px] font-bold tracking-tight">{athlete.name}</h1>
            <p className="text-[14px] text-[#9BA8B5] mt-1">{athlete.primaryGoal}</p>
          </div>
        </div>
        <Link
          to="/roster"
          className="px-4 py-2 rounded-[10px] bg-[#161D24] border border-[#222C36] text-[12px] font-semibold text-[#9BA8B5] hover:text-white transition-colors"
        >
          ← Back to Roster
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left column */}
        <div className="col-span-2 space-y-6">
          {/* Profile Section */}
          <Card>
            <SectionTitle title="Profile" />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Age</div>
                <div className="text-[18px] font-bold text-white mt-2">{athlete.age}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Experience Level</div>
                <div className="text-[18px] font-bold text-white mt-2">{athlete.experienceLevel}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold mb-2">Primary Goal</div>
                <div className="text-[14px] text-[#9BA8B5]">{athlete.primaryGoal}</div>
              </div>
            </div>
          </Card>

          {/* Active Injuries */}
          <Card>
            <SectionTitle title="Active Injuries" />
            {athlete.injuries.length === 0 ? (
              <div className="text-[14px] text-[#6B7785]">No injuries recorded.</div>
            ) : (
              <div className="space-y-3">
                {athlete.injuries.map(injury => (
                  <div
                    key={injury.id}
                    className="p-4 rounded-[12px] bg-[#0F1418] border border-[#1A222B]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-[14px] font-semibold text-white">{injury.bodyRegion}</h4>
                        <p className="text-[12px] text-[#9BA8B5] mt-1">
                          Reported {formatDay(injury.dateReported)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Pill
                          tone={
                            injury.severity === 'Severe'
                              ? 'danger'
                              : injury.severity === 'Moderate'
                                ? 'warning'
                                : 'info'
                          }
                        >
                          {injury.severity}
                        </Pill>
                        <Pill
                          tone={injury.status === 'Active' ? 'danger' : injury.status === 'Recovering' ? 'warning' : 'success'}
                        >
                          {injury.status}
                        </Pill>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Races */}
          <Card>
            <SectionTitle title="Upcoming Races" />
            {athlete.races.length === 0 ? (
              <div className="text-[14px] text-[#6B7785]">No races scheduled.</div>
            ) : (
              <div className="space-y-3">
                {athlete.races.map(race => (
                  <div
                    key={race.id}
                    className="p-4 rounded-[12px] bg-[#0F1418] border border-[#1A222B]"
                  >
                    <h4 className="text-[14px] font-semibold text-white">{race.name}</h4>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Date</div>
                        <div className="text-[13px] font-semibold text-white mt-1">{formatDay(race.date)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Distance</div>
                        <div className="text-[13px] font-semibold text-white mt-1">{race.distance}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Location</div>
                        <div className="text-[13px] font-semibold text-white mt-1">{race.location}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Session History */}
          <Card padded={false}>
            <div className="px-5 pt-5 pb-3">
              <SectionTitle title="Session History" />
            </div>
            <div className="divide-y divide-[#1A222B]">
              {athleteSessions.length === 0 ? (
                <div className="px-5 py-8 text-center text-[#6B7785] text-sm">No completed sessions.</div>
              ) : (
                athleteSessions.map(session => (
                  <div key={session.id} className="px-5 py-4 flex items-center justify-between card-hover">
                    <div>
                      <h4 className="text-[14px] font-semibold text-white">{session.type}</h4>
                      <p className="text-[12px] text-[#6B7785] mt-1">
                        {formatDay(session.date)} at {formatTime(session.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.reportAttached && (
                        <Pill tone="success">Report attached</Pill>
                      )}
                      <button className="px-3.5 py-2 rounded-[10px] bg-[#161D24] border border-[#222C36] text-[12px] font-semibold text-[#9BA8B5] hover:text-white transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Files & Reports */}
          <Card padded={false}>
            <div className="px-5 pt-5 pb-3">
              <SectionTitle title="Files & Reports" />
            </div>
            <div className="divide-y divide-[#1A222B]">
              {athleteFiles.length === 0 ? (
                <div className="px-5 py-8 text-center text-[#6B7785] text-sm">No files shared yet.</div>
              ) : (
                athleteFiles.map(file => (
                  <div key={file.id} className="px-5 py-4 card-hover">
                    <h4 className="text-[13px] font-semibold text-white truncate">{file.title}</h4>
                    <p className="text-[11px] text-[#6B7785] mt-1">
                      {file.templateName} · {formatDay(file.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <SectionTitle title="Actions" />
            <div className="space-y-2">
              <Link
                to="/reports"
                className="block w-full px-4 py-2.5 rounded-[10px] bg-[#161D24] border border-[#222C36] text-[12px] font-semibold text-[#9BA8B5] hover:bg-[#1C242C] hover:text-white transition-colors text-center"
              >
                Schedule Session
              </Link>
              <Link
                to="/reports"
                className="block w-full px-4 py-2.5 rounded-[10px] bg-[#0E9E8E] hover:bg-[#0B7F73] text-[12px] font-bold text-white transition-colors text-center"
              >
                Create Report
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
