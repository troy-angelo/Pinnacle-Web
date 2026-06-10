import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useSession } from '../lib/session-store';
import { athletes } from '../lib/mock-data';
import { useFilesStore } from '../lib/files-store';
import { Card, SectionTitle, Pill } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { FileViewer } from '../components/FileViewer';

export const Route = createFileRoute('/reports')({ component: Reports });

const coachTemplates = [
  { id: 'coach-1', name: 'Training Assessment', description: 'Evaluate athlete\'s current fitness level and training readiness', icon: '📊' },
  { id: 'coach-2', name: 'Race Readiness Check', description: 'Pre-race assessment and race day preparation checklist', icon: '🏁' },
  { id: 'coach-3', name: 'Return to Training', description: 'Clearance and protocol for return after break or injury', icon: '↩️' },
  { id: 'coach-4', name: 'Goal Setting Session', description: 'Document goals, milestones, and progress indicators', icon: '🎯' },
  { id: 'coach-5', name: 'Performance Review', description: 'Comprehensive season or cycle performance analysis', icon: '📈' },
  { id: 'coach-6', name: 'General Coaching Note', description: 'Free-form session notes and observations', icon: '📝' },
];

const ptTemplates = [
  { id: 'pt-1', name: 'Initial Movement Assessment', description: 'Baseline movement patterns and running mechanics', icon: '🔍' },
  { id: 'pt-2', name: 'Injury Evaluation', description: 'Comprehensive injury assessment and diagnosis', icon: '⚕️' },
  { id: 'pt-3', name: 'Rehab Progress Check', description: 'Track rehabilitation progress and adjust protocol', icon: '💪' },
  { id: 'pt-4', name: 'Pre-Race Medical Screen', description: 'Medical clearance and injury prevention briefing', icon: '✅' },
  { id: 'pt-5', name: 'Strength Assessment', description: 'Strength, power, and conditioning evaluation', icon: '⚡' },
  { id: 'pt-6', name: 'Return to Run Protocol', description: 'Structured return-to-running plan after injury', icon: '🏃' },
  { id: 'pt-7', name: 'Maintenance Check', description: 'Preventive assessment and maintenance plan', icon: '🛡️' },
  { id: 'pt-8', name: 'General PT Note', description: 'Free-form clinical notes and observations', icon: '📋' },
];

interface ReportFormState {
  template: string | null;
  athlete: string | null;
  title: string;
  content: string;
  files: string[];
}

function Reports() {
  const { provider } = useSession();
  const allFiles = useFilesStore(s => s.files);
  const addReport = useFilesStore(s => s.addReport);
  const [formState, setFormState] = useState<ReportFormState>({
    template: null,
    athlete: null,
    title: '',
    content: '',
    files: [],
  });
  const [view, setView] = useState<'template-select' | 'form' | 'success'>('template-select');

  const templates = provider.role === 'Coach' ? coachTemplates : ptTemplates;
  const selectedTemplateData = templates.find(t => t.id === formState.template);
  const selectedAthleteData = athletes.find(a => a.id === formState.athlete);
  const athleteFiles = allFiles.filter(f => f.athleteId === formState.athlete);

  const handleSelectTemplate = (templateId: string) => {
    setFormState(prev => ({ ...prev, template: templateId }));
    setView('form');
  };

  const handleBackToTemplates = () => {
    setFormState(prev => ({
      ...prev,
      template: null,
      athlete: null,
      title: '',
      content: '',
      files: [],
    }));
    setView('template-select');
  };

  const generateDefaultTitle = (templateName: string): string => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${templateName} — ${dateStr}`;
  };

  const handleCreate = () => {
    if (formState.athlete && formState.content.trim()) {
      const finalTitle = formState.title.trim() || generateDefaultTitle(selectedTemplateData?.name || 'Report');
      const fileType: 'assessment' | 'note' = provider.role === 'PT' ? 'assessment' : 'note';
      addReport({
        athleteId: formState.athlete,
        providerId: provider.id,
        type: fileType,
        title: finalTitle,
        templateName: selectedTemplateData?.name || 'Report',
        content: formState.content,
      });
      setView('success');
      setTimeout(() => {
        handleBackToTemplates();
        setView('template-select');
      }, 2000);
    }
  };

  const canSubmit = formState.athlete && formState.content.trim();

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="text-[#6B7280] text-[12px] uppercase tracking-[0.18em] font-semibold">Documentation</div>
        <h1 className="text-[28px] font-bold tracking-tight mt-1 text-[#111827]">Reports & Files</h1>
        <p className="text-[14px] text-[#6B7280] mt-2">Create assessments, share files with athletes, and manage documentation</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Template Selection & Form */}
        <div className="lg:col-span-2 space-y-6">
          {view === 'template-select' && (
            <Card>
              <SectionTitle title="New Report" subtitle="Choose a template to create an assessment" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className="text-left p-4 rounded-[12px] border border-[#E5E7EB] bg-white hover:bg-[#F8F9FA] hover:border-[#0E9E8E] transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[24px]">{template.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-[13px] text-[#111827]">{template.name}</div>
                        <div className="text-[11px] text-[#6B7280] mt-1">{template.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {view === 'form' && (
            <Card>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
                <div>
                  <SectionTitle title="Create Report" subtitle={selectedTemplateData?.name} />
                </div>
                <button
                  onClick={handleBackToTemplates}
                  className="text-[12px] text-[#6B7280] hover:text-[#111827] font-semibold"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-4">
                {/* Selected Template Info */}
                <div className="p-4 rounded-[12px] bg-[#0E9E8E]/8 border border-[#0E9E8E]/25">
                  <div className="flex items-center gap-3">
                    <span className="text-[24px]">{selectedTemplateData?.icon}</span>
                    <div>
                      <div className="text-[12px] text-[#6B7280] uppercase font-semibold">Template</div>
                      <div className="text-[14px] font-bold text-[#0B7F73]">{selectedTemplateData?.name}</div>
                    </div>
                  </div>
                </div>

                {/* Athlete Selection */}
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Select Athlete *</label>
                  <select
                    value={formState.athlete || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, athlete: e.target.value }))}
                    className="w-full mt-2 px-4 py-3 rounded-[12px] bg-white border border-[#E5E7EB] text-[#111827] text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors"
                  >
                    <option value="">Choose an athlete...</option>
                    {athletes.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {selectedAthleteData && (
                    <div className="mt-3 p-3 rounded-[10px] bg-[#F8F9FA] border border-[#E5E7EB] flex items-center gap-3">
                      <Avatar name={selectedAthleteData.name} size={40} />
                      <div>
                        <div className="text-[13px] font-semibold text-[#111827]">{selectedAthleteData.name}</div>
                        <div className="text-[11px] text-[#6B7280]">{selectedAthleteData.primaryGoal}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Title <span className="text-[#9CA3AF]">(optional)</span></label>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={`${selectedTemplateData?.name} — ${new Date().toLocaleDateString()}`}
                    className="w-full mt-2 px-4 py-3 rounded-[12px] bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Assessment Notes & Observations *</label>
                  <textarea
                    value={formState.content}
                    onChange={(e) => setFormState(prev => ({ ...prev, content: e.target.value }))}
                    placeholder={`Enter your ${selectedTemplateData?.name.toLowerCase()} details, observations, and recommendations here...`}
                    rows={10}
                    className="w-full mt-2 px-4 py-3 rounded-[12px] bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors resize-none"
                  />
                </div>

                {/* File Attachments */}
                {athleteFiles.length > 0 && (
                  <div>
                    <label className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Athlete Files to Reference</label>
                    <div className="mt-2 space-y-2">
                      {athleteFiles.map(file => (
                        <div
                          key={file.id}
                          className="p-3 rounded-[10px] bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-between hover:border-[#0E9E8E] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-semibold text-[#111827] truncate">{file.title}</div>
                            <div className="text-[11px] text-[#6B7280]">{file.templateName}</div>
                          </div>
                          <Pill tone={file.type === 'plan' ? 'teal' : file.type === 'assessment' ? 'info' : 'neutral'}>{file.type}</Pill>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                  <button
                    onClick={handleCreate}
                    disabled={!canSubmit}
                    className="flex-1 px-6 py-3 rounded-[12px] bg-[#0E9E8E] hover:bg-[#0B7F73] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed text-white font-bold transition-colors"
                  >
                    Create & Save
                  </button>
                  <button
                    onClick={handleBackToTemplates}
                    className="px-6 py-3 rounded-[12px] bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA] font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Card>
          )}

          {view === 'success' && (
            <Card>
              <div className="text-center py-12">
                <div className="h-14 w-14 rounded-full bg-[#0E9E8E]/10 text-[#0E9E8E] text-[28px] flex items-center justify-center mx-auto mb-4">✓</div>
                <h3 className="text-[18px] font-bold text-[#111827] mb-2">Report Created Successfully</h3>
                <p className="text-[14px] text-[#6B7280]">Your {selectedTemplateData?.name.toLowerCase()} has been saved and shared with {selectedAthleteData?.name}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Files & Summary */}
        <div className="space-y-6">
          {view === 'form' && (
            <Card>
              <SectionTitle title="Report Summary" />
              <div className="space-y-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">Template</div>
                  <div className="text-[13px] font-medium text-[#111827] mt-1">{selectedTemplateData?.name || 'Not selected'}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">Athlete</div>
                  <div className="text-[13px] font-medium text-[#111827] mt-1">{selectedAthleteData?.name || 'Not selected'}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">Content Length</div>
                  <div className="text-[13px] font-medium text-[#111827] mt-1">{formState.content.length} characters</div>
                </div>
                {athleteFiles.length > 0 && (
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">Related Files</div>
                    <div className="text-[13px] font-medium text-[#111827] mt-1">{athleteFiles.length} file(s)</div>
                  </div>
                )}
              </div>
            </Card>
          )}

          <FileViewer files={allFiles} emptyState="No reports yet. Create your first one." />
        </div>
      </div>
    </div>
  );
}
