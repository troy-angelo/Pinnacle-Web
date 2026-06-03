import { useState } from 'react';
import { Card, SectionTitle, Pill } from './Card';
import { Avatar } from './Avatar';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'textarea' | 'text' | 'select' | 'checkbox' | 'date';
  placeholder?: string;
  options?: string[];
  required: boolean;
}

interface ReportFormProps {
  template: Template;
  athleteName: string;
  athleteGoal: string;
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ReportFormGenerator({
  template,
  athleteName,
  athleteGoal,
  onSubmit,
  onCancel,
  isLoading = false,
}: ReportFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(template.fields.map(f => [f.id, '']))
  );

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const canSubmit = template.fields
    .filter(f => f.required)
    .every(f => formData[f.id]?.trim());

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.id}
            value={value}
            onChange={e => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={8}
            className="w-full px-4 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-white placeholder-[#4A5563] text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors resize-none"
          />
        );

      case 'text':
        return (
          <input
            key={field.id}
            type="text"
            value={value}
            onChange={e => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-white placeholder-[#4A5563] text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors"
          />
        );

      case 'date':
        return (
          <input
            key={field.id}
            type="date"
            value={value}
            onChange={e => handleFieldChange(field.id, e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-white text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors"
          />
        );

      case 'select':
        return (
          <select
            key={field.id}
            value={value}
            onChange={e => handleFieldChange(field.id, e.target.value)}
            className="w-full px-4 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-white text-[14px] focus:outline-none focus:border-[#0E9E8E] transition-colors"
          >
            <option value="">Select {field.label.toLowerCase()}...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label key={field.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={e => handleFieldChange(field.id, e.target.checked ? 'true' : 'false')}
              className="w-4 h-4 rounded border border-[#222C36] bg-[#161D24] cursor-pointer accent-[#0E9E8E]"
            />
            <span className="text-[14px] text-white">{field.label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between pb-4 border-b border-[#1A222B] mb-4">
        <div>
          <SectionTitle title="Create Report" subtitle={template.name} />
        </div>
        <button
          onClick={onCancel}
          className="text-[12px] text-[#9BA8B5] hover:text-white font-semibold"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-4">
        {/* Template Info */}
        <div className="p-4 rounded-[12px] bg-[#0E9E8E]/10 border border-[#0E9E8E]/30">
          <div className="flex items-center gap-3">
            <span className="text-[24px]">{template.icon}</span>
            <div>
              <div className="text-[12px] text-[#6B7785] uppercase font-semibold">Template</div>
              <div className="text-[14px] font-bold text-[#14B8A6]">{template.name}</div>
            </div>
          </div>
        </div>

        {/* Athlete Info */}
        <div className="p-3 rounded-[10px] bg-[#0F1418] border border-[#1A222B] flex items-center gap-3">
          <Avatar name={athleteName} size={40} />
          <div>
            <div className="text-[13px] font-semibold text-white">{athleteName}</div>
            <div className="text-[11px] text-[#9BA8B5]">{athleteGoal}</div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 pt-2">
          {template.fields.map(field => (
            <div key={field.id}>
              <label className="text-[12px] font-semibold text-[#9BA8B5] uppercase tracking-wider">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              <div className="mt-2">
                {renderField(field)}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-[#1A222B]">
          <button
            onClick={() => onSubmit(formData)}
            disabled={!canSubmit || isLoading}
            className="flex-1 px-6 py-3 rounded-[12px] bg-[#0E9E8E] hover:bg-[#0B7F73] disabled:bg-[#222C36] disabled:text-[#6B7785] disabled:cursor-not-allowed text-white font-bold transition-colors"
          >
            {isLoading ? 'Saving...' : 'Create & Save'}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 rounded-[12px] bg-[#161D24] border border-[#222C36] text-[#9BA8B5] hover:text-white font-semibold transition-colors disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </Card>
  );
}

// Template definitions with specialized fields
export const getCoachTemplateFields = (templateId: string): FormField[] => {
  const baseFields: Record<string, FormField[]> = {
    'coach-1': [ // Training Assessment
      {
        id: 'current-fitness',
        label: 'Current Fitness Level',
        type: 'select',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
        required: true,
      },
      {
        id: 'training-readiness',
        label: 'Training Readiness Assessment',
        type: 'textarea',
        placeholder: 'Evaluate the athlete\'s current fitness level, recent training loads, and readiness for intensity...',
        required: true,
      },
      {
        id: 'recommendations',
        label: 'Recommendations',
        type: 'textarea',
        placeholder: 'Specific training recommendations based on assessment...',
        required: false,
      },
    ],
    'coach-2': [ // Race Readiness Check
      {
        id: 'race-date',
        label: 'Race Date',
        type: 'date',
        required: true,
      },
      {
        id: 'race-readiness',
        label: 'Overall Race Readiness',
        type: 'select',
        options: ['Not Ready', 'Needs Work', 'Ready', 'Very Ready'],
        required: true,
      },
      {
        id: 'preparation',
        label: 'Pre-Race Preparation Plan',
        type: 'textarea',
        placeholder: 'Tapering strategy, nutrition plan, mental preparation, and race day logistics...',
        required: true,
      },
      {
        id: 'concerns',
        label: 'Concerns & Contingencies',
        type: 'textarea',
        placeholder: 'Any concerns and contingency plans...',
        required: false,
      },
    ],
    'coach-3': [ // Return to Training
      {
        id: 'clearance-status',
        label: 'Clearance Status',
        type: 'select',
        options: ['Cleared to Full Training', 'Cleared with Modifications', 'Not Yet Cleared'],
        required: true,
      },
      {
        id: 'return-protocol',
        label: 'Return to Training Protocol',
        type: 'textarea',
        placeholder: 'Step-by-step protocol for safe return, volume progression, intensity guidelines...',
        required: true,
      },
      {
        id: 'precautions',
        label: 'Precautions & Monitoring',
        type: 'textarea',
        placeholder: 'Any precautions and what to monitor for...',
        required: false,
      },
    ],
    'coach-4': [ // Goal Setting Session
      {
        id: 'short-term-goals',
        label: 'Short-Term Goals (Next 4-8 Weeks)',
        type: 'textarea',
        placeholder: 'Specific, measurable short-term objectives...',
        required: true,
      },
      {
        id: 'long-term-goals',
        label: 'Long-Term Goals (Next Season)',
        type: 'textarea',
        placeholder: 'Major season objectives and targets...',
        required: true,
      },
      {
        id: 'milestones',
        label: 'Key Milestones & Progress Indicators',
        type: 'textarea',
        placeholder: 'How you\'ll measure progress...',
        required: true,
      },
    ],
    'coach-5': [ // Performance Review
      {
        id: 'period',
        label: 'Review Period',
        type: 'text',
        placeholder: 'e.g., Fall 2024, Spring 2025 Season',
        required: true,
      },
      {
        id: 'performance-analysis',
        label: 'Performance Analysis',
        type: 'textarea',
        placeholder: 'Key performances, PRs, race results, and trends...',
        required: true,
      },
      {
        id: 'strengths',
        label: 'Strengths & Areas for Development',
        type: 'textarea',
        placeholder: 'What went well and what needs improvement...',
        required: true,
      },
      {
        id: 'next-cycle',
        label: 'Planning for Next Cycle',
        type: 'textarea',
        placeholder: 'Goals and focus areas for upcoming training cycle...',
        required: false,
      },
    ],
    'coach-6': [ // General Coaching Note
      {
        id: 'session-summary',
        label: 'Session Summary',
        type: 'textarea',
        placeholder: 'Overview of the session or topic discussed...',
        required: true,
      },
      {
        id: 'observations',
        label: 'Observations & Notes',
        type: 'textarea',
        placeholder: 'Key observations, athlete feedback, performance notes...',
        required: true,
      },
      {
        id: 'action-items',
        label: 'Action Items & Next Steps',
        type: 'textarea',
        placeholder: 'Follow-ups, homework, or next meeting focus...',
        required: false,
      },
    ],
  };

  return baseFields[templateId] || [];
};

export const getPTTemplateFields = (templateId: string): FormField[] => {
  const baseFields: Record<string, FormField[]> = {
    'pt-1': [ // Initial Movement Assessment
      {
        id: 'running-mechanics',
        label: 'Running Mechanics & Gait Analysis',
        type: 'textarea',
        placeholder: 'Observations on gait, cadence, form, asymmetries...',
        required: true,
      },
      {
        id: 'movement-patterns',
        label: 'Movement Patterns & Flexibility',
        type: 'textarea',
        placeholder: 'Range of motion, flexibility limitations, movement quality...',
        required: true,
      },
      {
        id: 'strength-baseline',
        label: 'Baseline Strength & Power Assessment',
        type: 'textarea',
        placeholder: 'Key strength metrics and observations...',
        required: false,
      },
    ],
    'pt-2': [ // Injury Evaluation
      {
        id: 'injury-location',
        label: 'Injury Location & Mechanism',
        type: 'text',
        placeholder: 'Specific body region and how injury occurred',
        required: true,
      },
      {
        id: 'pain-characteristics',
        label: 'Pain Characteristics & Severity',
        type: 'textarea',
        placeholder: 'Pain quality (sharp, dull, throbbing), location, severity scale 1-10, activities that aggravate...',
        required: true,
      },
      {
        id: 'clinical-findings',
        label: 'Clinical Findings & Tests',
        type: 'textarea',
        placeholder: 'Special tests performed, ROM limitations, strength deficits...',
        required: true,
      },
      {
        id: 'diagnosis-impression',
        label: 'Clinical Impression & Diagnosis',
        type: 'textarea',
        placeholder: 'Working diagnosis and explanation for athlete...',
        required: true,
      },
    ],
    'pt-3': [ // Rehab Progress Check
      {
        id: 'progress-since-last',
        label: 'Progress Since Last Visit',
        type: 'textarea',
        placeholder: 'Changes in pain, function, ROM, strength...',
        required: true,
      },
      {
        id: 'current-status',
        label: 'Current Rehabilitation Status',
        type: 'select',
        options: ['Early Phase', 'Mid Phase', 'Late Phase', 'Return to Sport Phase'],
        required: true,
      },
      {
        id: 'protocol-adjustments',
        label: 'Protocol Adjustments',
        type: 'textarea',
        placeholder: 'Updates to exercises, progressions, intensity changes...',
        required: false,
      },
    ],
    'pt-4': [ // Pre-Race Medical Screen
      {
        id: 'medical-clearance',
        label: 'Medical Clearance Status',
        type: 'select',
        options: ['Cleared', 'Cleared with Restrictions', 'Not Cleared'],
        required: true,
      },
      {
        id: 'pre-race-screening',
        label: 'Pre-Race Screening Findings',
        type: 'textarea',
        placeholder: 'Any findings from movement assessment, pain assessment...',
        required: true,
      },
      {
        id: 'injury-prevention-brief',
        label: 'Injury Prevention Brief',
        type: 'textarea',
        placeholder: 'Key points to prevent aggravation of any injuries during race...',
        required: false,
      },
    ],
    'pt-5': [ // Strength Assessment
      {
        id: 'strength-tests',
        label: 'Strength Test Results',
        type: 'textarea',
        placeholder: 'Specific strength tests performed (e.g., single leg hop, squat depth, glute activation) and results...',
        required: true,
      },
      {
        id: 'power-assessment',
        label: 'Power & Explosive Strength',
        type: 'textarea',
        placeholder: 'Vertical jump, broad jump, bounding assessments...',
        required: false,
      },
      {
        id: 'conditioning-level',
        label: 'Conditioning Level',
        type: 'select',
        options: ['Below Average', 'Average', 'Good', 'Excellent'],
        required: true,
      },
    ],
    'pt-6': [ // Return to Run Protocol
      {
        id: 'return-to-run-phase',
        label: 'Current Return-to-Run Phase',
        type: 'select',
        options: ['Phase 1: Walk/Jog Mix', 'Phase 2: Increase Running', 'Phase 3: Sport-Specific', 'Phase 4: Return to Sport'],
        required: true,
      },
      {
        id: 'protocol-details',
        label: 'Weekly Protocol Details',
        type: 'textarea',
        placeholder: 'Distance, pace, frequency, cross-training recommendations...',
        required: true,
      },
      {
        id: 'signs-to-watch',
        label: 'Signs of Progress & Red Flags to Monitor',
        type: 'textarea',
        placeholder: 'What indicates good progress vs what would indicate regression...',
        required: false,
      },
    ],
    'pt-7': [ // Maintenance Check
      {
        id: 'current-status-check',
        label: 'Current Status & Function',
        type: 'textarea',
        placeholder: 'Overall health status, any current complaints, functional abilities...',
        required: true,
      },
      {
        id: 'maintenance-plan',
        label: 'Maintenance & Prevention Plan',
        type: 'textarea',
        placeholder: 'Exercises and strategies to maintain health and prevent future injuries...',
        required: true,
      },
      {
        id: 'recommended-frequency',
        label: 'Recommended Check-in Frequency',
        type: 'select',
        options: ['Monthly', 'Every 6 weeks', 'Every 3 months', 'Every 6 months'],
        required: false,
      },
    ],
    'pt-8': [ // General PT Note
      {
        id: 'session-focus',
        label: 'Session Focus & Treatment',
        type: 'textarea',
        placeholder: 'What was addressed in this session...',
        required: true,
      },
      {
        id: 'patient-response',
        label: 'Patient Response & Tolerance',
        type: 'textarea',
        placeholder: 'How athlete responded to treatment, tolerance level...',
        required: true,
      },
      {
        id: 'home-exercises',
        label: 'Home Exercise Program Updates',
        type: 'textarea',
        placeholder: 'Any changes to HEP or new exercises assigned...',
        required: false,
      },
    ],
  };

  return baseFields[templateId] || [];
};
