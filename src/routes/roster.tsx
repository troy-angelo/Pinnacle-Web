import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { athletes, sessions, getSession } from '../lib/mock-data';
import { Card, Pill } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { formatDay, formatTime } from '../lib/format';
import type { Athlete } from '../lib/types';

export const Route = createFileRoute('/roster')({ component: Roster });

function Roster() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAthletes = athletes.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.primaryGoal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNextSession = (athleteId: string) => {
    const upcomingSessions = sessions
      .filter(s => s.athleteId === athleteId && s.status === 'Upcoming')
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
    return upcomingSessions[0];
  };

  const getInjuryStatus = (athlete: Athlete) => {
    const activeInjuries = athlete.injuries.filter(i => i.status === 'Active');
    if (activeInjuries.length === 0) return null;
    if (activeInjuries.length === 1) {
      return activeInjuries[0];
    }
    return { count: activeInjuries.length };
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-[#6B7785] text-[12px] uppercase tracking-[0.18em] font-semibold">Team Management</div>
        <h1 className="text-[28px] font-bold tracking-tight mt-1">Your Roster</h1>
        <p className="text-[14px] text-[#9BA8B5] mt-2">{filteredAthletes.length} athlete{filteredAthletes.length !== 1 ? 's' : ''} assigned to your profile</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or goal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-white placeholder-[#6B7785] focus:outline-none focus:border-[#0E9E8E] transition-colors text-[14px]"
          />
        </div>
      </div>

      {/* Roster List */}
      <div className="space-y-3">
        {filteredAthletes.length === 0 ? (
          <Card>
            <div className="py-12 text-center">
              <div className="text-[14px] text-[#6B7785]">No athletes found</div>
            </div>
          </Card>
        ) : (
          filteredAthletes.map(athlete => {
            const nextSession = getNextSession(athlete.id);
            const injuryStatus = getInjuryStatus(athlete);
            return (
              <Link
                key={athlete.id}
                to="/athletes/$athleteId"
                params={{ athleteId: athlete.id }}
                className="block"
              >
                <Card className="hover:border-[#0E9E8E]/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar name={athlete.name} size={56} />
                    
                    {/* Name & Goal */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-white">{athlete.name}</h3>
                      <p className="text-[12px] text-[#9BA8B5] mt-1">{athlete.primaryGoal}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Pill tone="neutral">
                          {athlete.experienceLevel}
                        </Pill>
                        {injuryStatus && 'bodyRegion' in injuryStatus && (
                          <Pill tone="warning">
                            {`Injury: ${injuryStatus.bodyRegion}`}
                          </Pill>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 min-w-fit">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Age</div>
                        <div className="text-[16px] font-bold text-white mt-1">{athlete.age}</div>
                      </div>
                      
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Upcoming Race</div>
                        <div className="text-[13px] font-semibold text-white mt-1">
                          {athlete.races.length > 0 ? athlete.races[0].name : '—'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold">Next Session</div>
                        {nextSession ? (
                          <div className="mt-1">
                            <div className="text-[13px] font-semibold text-white">{formatDay(nextSession.date)}</div>
                            <div className="text-[11px] text-[#6B7785]">{formatTime(nextSession.date)}</div>
                          </div>
                        ) : (
                          <div className="text-[13px] text-[#6B7785] mt-1">No sessions</div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="px-4 py-2 rounded-[10px] bg-[#161D24] border border-[#222C36] text-[12px] font-semibold text-[#9BA8B5] hover:text-white hover:border-[#0E9E8E] transition-colors"
                    >
                      View →
                    </button>
                  </div>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
