import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, SectionTitle, Pill } from '../components/Card';
import { useSession } from '../lib/session-store';
import { sessions, athletes, getAthlete } from '../lib/mock-data';
import { formatDay, formatTime } from '../lib/format';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i).padStart(2, '0');
  return `${hour}:00`;
});

interface RecurringSlot {
  day: number;
  startHour: number;
  endHour: number;
}

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
});

function CalendarPage() {
  const { provider } = useSession();
  const [slots, setSlots] = useState<RecurringSlot[]>([
    { day: 0, startHour: 9, endHour: 12 },
    { day: 0, startHour: 14, endHour: 17 },
    { day: 1, startHour: 9, endHour: 17 },
    { day: 3, startHour: 10, endHour: 18 },
  ]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(12);

  const upcomingSessions = sessions
    .filter(s => s.providerId === provider.id && s.status === 'Upcoming')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const addSlot = () => {
    if (endHour > startHour) {
      setSlots([...slots, { day: selectedDay, startHour, endHour }]);
    }
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const getSlotsForDay = (day: number) => slots.filter(s => s.day === day);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight">Availability & Calendar</h1>
        <p className="text-[14px] text-[#9BA8B5] mt-1">Set your recurring availability for {provider.name}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Week View & Sessions */}
        <div className="col-span-2 space-y-6">
          <Card>
            <SectionTitle title="Weekly Availability" />
            <div className="space-y-3">
              {DAYS.map((day, dayIndex) => {
                const daySlots = getSlotsForDay(dayIndex);
                return (
                  <div key={day} className="p-4 rounded-[12px] bg-[#0F1418] border border-[#1A222B]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-semibold text-white">{day}</h3>
                      {daySlots.length > 0 && (
                        <span className="text-[12px] px-2 py-1 rounded-full bg-[#0E9E8E]/20 text-[#14B8A6]">
                          {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {daySlots.length === 0 ? (
                      <p className="text-[12px] text-[#6B7785]">No availability set</p>
                    ) : (
                      <div className="space-y-2">
                        {daySlots.map((slot, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-2 rounded-[8px] bg-[#0E9E8E]/10 border border-[#0E9E8E]/30"
                          >
                            <span className="text-[12px] font-medium text-[#14B8A6]">
                              {String(slot.startHour).padStart(2, '0')}:00 - {String(slot.endHour).padStart(2, '0')}:00
                            </span>
                            <button
                              onClick={() => removeSlot(slots.indexOf(slot))}
                              className="text-[#6B7785] hover:text-[#FF6B6B] transition-colors text-[14px]"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Booked Sessions */}
          <Card padded={false}>
            <div className="px-5 pt-5 pb-3">
              <SectionTitle title="Upcoming Sessions" />
            </div>
            <div className="divide-y divide-[#1A222B]">
              {upcomingSessions.length === 0 ? (
                <div className="px-5 py-8 text-center text-[#6B7785] text-[13px]">No upcoming sessions booked</div>
              ) : (
                upcomingSessions.map(session => {
                  const athlete = getAthlete(session.athleteId);
                  if (!athlete) return null;
                  return (
                    <div key={session.id} className="px-5 py-4 flex items-start justify-between hover:bg-[#0F1418]/50 transition-colors card-hover">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[14px] font-semibold text-white">{athlete.name}</h4>
                          <Pill tone="info">{session.type}</Pill>
                        </div>
                        <p className="text-[12px] text-[#9BA8B5]">
                          {formatDay(session.date)} at {formatTime(session.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <button className="px-3 py-1.5 rounded-[8px] bg-[#0E9E8E]/20 border border-[#0E9E8E]/30 text-[11px] font-semibold text-[#14B8A6] hover:bg-[#0E9E8E]/30 transition-colors">
                          Join
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right: Add Slot Form */}
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Add Availability" />
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold mb-2 block">
                  Day
                </label>
                <select
                  value={selectedDay}
                  onChange={e => setSelectedDay(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-[#0F1418] border border-[#222C36] text-white text-[13px] font-medium focus:outline-none focus:border-[#0E9E8E]"
                >
                  {DAYS.map((day, idx) => (
                    <option key={day} value={idx}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold mb-2 block">
                  Start Time
                </label>
                <select
                  value={startHour}
                  onChange={e => setStartHour(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-[#0F1418] border border-[#222C36] text-white text-[13px] font-medium focus:outline-none focus:border-[#0E9E8E]"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#6B7785] font-semibold mb-2 block">
                  End Time
                </label>
                <select
                  value={endHour}
                  onChange={e => setEndHour(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-[#0F1418] border border-[#222C36] text-white text-[13px] font-medium focus:outline-none focus:border-[#0E9E8E]"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <div className="text-[12px] text-[#9BA8B5] mb-3 p-3 rounded-[8px] bg-[#0F1418] border border-[#1A222B]">
                  <strong>Duration:</strong> {endHour > startHour ? `${endHour - startHour}h` : '—'}
                </div>
                <button
                  onClick={addSlot}
                  disabled={endHour <= startHour}
                  className="w-full px-4 py-2.5 bg-[#0E9E8E] text-white rounded-[10px] font-semibold text-[13px] hover:bg-[#0D8A78] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Time Slot
                </button>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card>
            <SectionTitle title="Weekly Summary" />
            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#9BA8B5]">Total slots:</span>
                <span className="font-semibold text-white">{slots.length}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#9BA8B5]">Total hours:</span>
                <span className="font-semibold text-white">{slots.reduce((sum, s) => sum + (s.endHour - s.startHour), 0)}h</span>
              </div>
              <div className="text-[12px] text-[#6B7785] mt-4 p-3 rounded-[8px] bg-[#0F1418] border border-[#1A222B]">
                💡 <strong>Tip:</strong> Athletes see available times in "Connect Now" based on your slots and booked sessions.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
