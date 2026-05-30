import type { Provider, Athlete, Session, SharedFile, Earnings } from './types';

const now = new Date();

export const providers: Provider[] = [
  {
    id: 'coach-marcus',
    name: 'Marcus Williams',
    role: 'Coach',
    specialty: 'Marathon Training',
    rating: 4.9,
    reviews: 47,
    bio: 'Former elite runner with 15+ years coaching experience. Specializes in distance running and race strategy.',
    credentials: ['USSF Level 1', 'ACE Certification'],
    credentialExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    connectNowActive: true,
    hourlyRate: 85,
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561426081-2c6h5ydtqxe-coach_2.webp',
  },
  {
    id: 'pt-elena',
    name: 'Elena Rodriguez',
    role: 'PT',
    specialty: 'Sports Medicine & Injury Prevention',
    rating: 4.8,
    reviews: 52,
    bio: 'Licensed Physical Therapist specializing in runner injuries and performance optimization.',
    credentials: ['DPT', 'CSCS', 'IASTM Certified'],
    credentialExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    connectNowActive: false,
    hourlyRate: 120,
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561425750-rfo651p6oq8-coach_1.webp',
  },
  {
    id: 'coach-david',
    name: 'David Chen',
    role: 'Coach',
    specialty: 'Track & Field',
    rating: 4.7,
    reviews: 38,
    bio: 'Track coach with expertise in sprints and middle-distance training. Olympic trials experience.',
    credentials: ['USATF Certified', 'Level 2 Coach'],
    credentialExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
    connectNowActive: true,
    hourlyRate: 95,
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561426202-n9noi9ng1i-athlete_avatar.webp',
  },
];

export const athletes: Athlete[] = [
  {
    id: 'athlete-1',
    name: 'Sarah Chen',
    age: 28,
    experienceLevel: 'Advanced',
    primaryGoal: 'Sub-2:50 Marathon',
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561426202-n9noi9ng1i-athlete_avatar.webp',
    injuries: [
      {
        id: 'inj-1',
        bodyRegion: 'Left Knee',
        severity: 'Mild',
        status: 'Recovering',
        dateReported: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    races: [
      {
        id: 'race-1',
        name: 'Chicago Marathon',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        distance: '42.2 km',
        location: 'Chicago, IL',
      },
    ],
  },
  {
    id: 'athlete-2',
    name: 'James Rodriguez',
    age: 35,
    experienceLevel: 'Intermediate',
    primaryGoal: 'Complete First 5K Race',
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561426081-2c6h5ydtqxe-coach_2.webp',
    injuries: [],
    races: [
      {
        id: 'race-2',
        name: 'City 5K',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        distance: '5 km',
        location: 'Downtown',
      },
    ],
  },
  {
    id: 'athlete-3',
    name: 'Alex Thompson',
    age: 22,
    experienceLevel: 'Elite',
    primaryGoal: 'Olympic Trials Qualifier',
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561425750-rfo651p6oq8-coach_1.webp',
    injuries: [
      {
        id: 'inj-2',
        bodyRegion: 'Right Ankle',
        severity: 'Moderate',
        status: 'Active',
        dateReported: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    races: [
      {
        id: 'race-3',
        name: 'Regional Track Meet',
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        distance: '1500m',
        location: 'Eugene, OR',
      },
    ],
  },
  {
    id: 'athlete-4',
    name: 'Maria Santos',
    age: 31,
    experienceLevel: 'Advanced',
    primaryGoal: 'Sub-1:30 Half Marathon',
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561426202-n9noi9ng1i-athlete_avatar.webp',
    injuries: [
      {
        id: 'inj-3',
        bodyRegion: 'Lower Back',
        severity: 'Mild',
        status: 'Recovering',
        dateReported: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    races: [
      {
        id: 'race-4',
        name: 'Boston Half Marathon',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        distance: '21.1 km',
        location: 'Boston, MA',
      },
    ],
  },
  {
    id: 'athlete-5',
    name: 'Jason Lee',
    age: 26,
    experienceLevel: 'Beginner',
    primaryGoal: 'Build Fitness & Run Consistently',
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561426081-2c6h5ydtqxe-coach_2.webp',
    injuries: [],
    races: [
      {
        id: 'race-5',
        name: 'Local 10K Fun Run',
        date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        distance: '10 km',
        location: 'Local Park',
      },
    ],
  },
  {
    id: 'athlete-6',
    name: 'Nina Patel',
    age: 29,
    experienceLevel: 'Elite',
    primaryGoal: 'National Championship Qualifier',
    photo: 'https://cdn.shipper.now/image/users/cmpinmadj0000jv04dnvd2tr7/1779561425750-rfo651p6oq8-coach_1.webp',
    injuries: [
      {
        id: 'inj-4',
        bodyRegion: 'Right Hamstring',
        severity: 'Moderate',
        status: 'Active',
        dateReported: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    races: [
      {
        id: 'race-6',
        name: 'National Championships',
        date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
        distance: '5000m',
        location: 'Indianapolis, IN',
      },
    ],
  },
];

export const sessions: Session[] = [
  {
    id: 'sess-1',
    athleteId: 'athlete-1',
    providerId: 'coach-marcus',
    type: 'Strategy Session',
    date: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
    reportAttached: false,
  },
  {
    id: 'sess-2',
    athleteId: 'athlete-2',
    providerId: 'coach-marcus',
    type: 'Form Analysis',
    date: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
    reportAttached: false,
  },
  {
    id: 'sess-3',
    athleteId: 'athlete-3',
    providerId: 'pt-elena',
    type: 'Injury Assessment',
    date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
    reportAttached: false,
  },
  {
    id: 'sess-4',
    athleteId: 'athlete-1',
    providerId: 'coach-marcus',
    type: 'Recovery Debrief',
    date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    reportAttached: false,
  },
  {
    id: 'sess-5',
    athleteId: 'athlete-2',
    providerId: 'coach-marcus',
    type: 'Goal Setting',
    date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    reportAttached: true,
  },
  {
    id: 'sess-6',
    athleteId: 'athlete-3',
    providerId: 'pt-elena',
    type: 'Pre-Race Medical Screen',
    date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    reportAttached: false,
  },
  {
    id: 'sess-7',
    athleteId: 'athlete-4',
    providerId: 'coach-marcus',
    type: 'Pace Training Review',
    date: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    reportAttached: true,
  },
  {
    id: 'sess-8',
    athleteId: 'athlete-5',
    providerId: 'coach-david',
    type: 'Baseline Fitness Assessment',
    date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
    reportAttached: false,
  },
  {
    id: 'sess-9',
    athleteId: 'athlete-6',
    providerId: 'pt-elena',
    type: 'Hamstring Rehabilitation',
    date: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    status: 'Completed',
    reportAttached: false,
  },
];

export const earningsByProvider: Record<string, Earnings> = {
  'coach-marcus': {
    daily: 425,
    weekly: 2890,
    monthly: 12560,
  },
  'pt-elena': {
    daily: 720,
    weekly: 4320,
    monthly: 18750,
  },
  'coach-david': {
    daily: 380,
    weekly: 2280,
    monthly: 9880,
  },
};

export const rosterRequests = [
  {
    id: 'req-1',
    athleteId: 'athlete-1',
    athleteName: 'Sarah Chen',
    message: 'Requesting to join your roster for marathon prep',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'req-2',
    athleteId: 'athlete-4',
    athleteName: 'Maria Santos',
    message: 'Interested in half-marathon coaching',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const adminMessages = [
  {
    id: 'msg-1',
    subject: 'Platform Update: New Report Templates Available',
    preview: 'We\'ve added 3 new report templates to improve athlete communication...',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-2',
    subject: 'Reminder: Credential Expiration Coming Up',
    preview: 'Some of your credentials expire in the next 90 days...',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const files: SharedFile[] = [
  {
    id: 'file-1',
    athleteId: 'athlete-1',
    providerId: 'coach-marcus',
    type: 'plan',
    title: 'Marathon Training Plan',
    templateName: 'Training Plan',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'file-2',
    athleteId: 'athlete-2',
    providerId: 'coach-marcus',
    type: 'assessment',
    title: '5K Race Strategy & Pacing Guide',
    templateName: 'Race Strategy',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'file-3',
    athleteId: 'athlete-3',
    providerId: 'pt-elena',
    type: 'note',
    title: 'Ankle Stability Exercises',
    templateName: 'Rehabilitation Notes',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'file-4',
    athleteId: 'athlete-4',
    providerId: 'coach-marcus',
    type: 'plan',
    title: 'Half Marathon 12-Week Training Cycle',
    templateName: 'Training Plan',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getAthlete(id: string): Athlete | undefined {
  return athletes.find((a) => a.id === id);
}

export function getSession(id: string): Session | undefined {
  return sessions.find((s) => s.id === id);
}

export function getProvider(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}
