import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useSession } from '../lib/session-store';
import { athletes, files } from '../lib/mock-data';
import { Card, SectionTitle, Pill } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { FileViewer } from '../components/FileViewer';

export const Route = createFileRoute('/reports')({ component: Reports });

const coachTemplates = [
  { id: 'coach-1', name: 'Training Assessment', description: 'Evaluate athlete\'s current fitness level and training readiness' },
  { id: 'coach-2', name: 'Race Readiness Check', description: 'Pre-race assessment and race day preparation checklist' },
  { id: 'coach-3', name: 'Return to Training', description: 'Clearance and protocol for return after break or injury' },
  { id: 'coach-4', name: 'Goal Setting Session', description: 'Document goals, milestones, and progress indicators' },
  { id: 'coach-5', name: 'Performance Review', description: 'Comprehensive season or cycle performance analysis' },
  { id: 'coach-6', name: 'General Coaching Note', description: 'Free-form session notes and observations' },
];

const ptTemplates = [
  { id: 'pt-1', name: 'Initial Movement and Running Assessment', description: 'Baseline movement patterns and running mechanics' },
  { id: 'pt-2', name: 'Injury Evaluation', description: 'Comprehensive injury assessment and diagnosis' },
  { id: 'pt-3', name: 'Rehab Progress Check', description: 'Track rehabilitation progress and adjust protocol' },
  { id: 'pt-4', name: 'Pre-Race Medical Screen', description: 'Medical clearance and injury prevention briefing' },
  { id: 'pt-5', name: 'Strength and Conditioning Assessment', description: 'Strength, power, and conditioning evaluation' },
  { id: 'pt-6', name: 'Return to Run Protocol', description: 'Structured return-to-running plan after injury' },
  { id: 'pt-7', name: 'Maintenance and Prevention Check', description: 'Preventive assessment and maintenance plan' },
  { id: 'pt-8', name: 'General PT Note', description: 'Free-form clinical notes and observations' },
];

function Reports() {
  const { provider } = useSession();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const [content, setContent] = useState('');

  const templates = provider.role === 'Coach' ? coachTemplates : ptTemplates;
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const handleCreate = () => {
    if (selectedTemplate && selectedAthlete) {
      // Mock create - in real app would save to database
      setTitle('');
      setContent('');
      setSelectedTemplate(null);
      setSelectedAthlete(null);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-[#6B7785] text-[12px] uppercase tracking-[0.18em] font-semibold">Documentation</div>
        <h1 className="text-[28px] font-bold tracking-tight mt-1">Reports & Files</h1>
        <p className="text-[14px] text-[#9BA8B5] mt-2">Create assessments, reports, and share files with your athletes</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Template Selection & Form */}
        <div className="col-span-2 space-y-6">
          {/* Create New Report */}
          <Card>
            <SectionTitle title="New Report" subtitle="Select a template to get started" />
            
            {!selectedTemplate ? (
              <div className="space-y-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className="w-full text-left p-4 rounded-[12px] border border-[#222C36] bg-[#0F1418] hover:bg-[#161D24] hover:border-[#0E9E8E] transition-all"
                  >
                    <div className="font-semibold text-[14px] text-white">{template.name}</div>
                    <div className="text-[12px] text-[#9BA8B5] mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-[12px] bg-[#0E9E8E]/10 border border-[#0E9E8E]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[12px] text-[#6B7785] uppercase font-semibold">Selected Template</div>
                      <div className="text-[15px] font-bold text-white mt-1">{selectedTemplateData?.name}</div>
                    </div>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="text-[12px] text-[#9BA8B5] hover:text-white font-semibold"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Athlete Selection */}
                <div>
                  <label className="text-[12px] font-semibold text-[#9BA8B5] uppercase tracking-wider">Athlete</label>
                  <select
                    value={selectedAthlete || ''}
                    onChange={(e) => setSelectedAthlete(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-white text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors"
                  >
                    <option value="">Select an athlete...</option>
                    {athletes.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="text-[12px] font-semibold text-[#9BA8B5] uppercase tracking-wider">Title <span className="text-[#6B7785]">(optional — auto-filled if blank)</span></label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`${selectedTemplateData?.name} — ${new Date().toLocaleDateString()}`}
                    className="w-full mt-2 px-4 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-white placeholder-[#4A5563] text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-[12px] font-semibold text-[#9BA8B5] uppercase tracking-wider">Notes & Observations</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your assessment details, observations, and recommendations here..."
                    rows={8}
                    className="w-full mt-2 px-4 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-white placeholder-[#4A5563] text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCreate}
                    disabled={!selectedAthlete || !content.trim()}
                    className="flex-1 px-6 py-3 rounded-[12px] bg-[#0E9E8E] hover:bg-[#0B7F73] disabled:bg-[#222C36] disabled:text-[#6B7785] text-white font-bold transition-colors"
                  >
                    Create & Save
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTemplate(null);
                      setTitle('');
                      setContent('');
                      setSelectedAthlete(null);
                    }}
                    className="px-6 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-[#9BA8B5] hover:text-white font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Recent Files */}
        <div className="space-y-6">
          <FileViewer files={files} emptyState="No reports yet. Create your first one." />
        </div>
      </div>
    </div>
  );
}
