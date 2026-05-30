export type Provider = {
  id: string;
  name: string;
  role: 'Coach' | 'PT';
  specialty: string;
  rating: number;
  reviews: number;
  bio: string;
  credentials: string[];
  credentialExpiry: string;
  connectNowActive: boolean;
  hourlyRate: number;
  photo: string;
};

export type Athlete = {
  id: string;
  name: string;
  age: number;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  primaryGoal: string;
  injuries: Injury[];
  races: Race[];
  photo: string;
};

export type Injury = {
  id: string;
  bodyRegion: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  status: 'Active' | 'Recovering' | 'Resolved';
  dateReported: string;
};

export type Race = {
  id: string;
  name: string;
  date: string;
  distance: string;
  location: string;
};

export type Session = {
  id: string;
  athleteId: string;
  providerId: string;
  type: string;
  date: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  reportAttached: boolean;
};

export type SharedFile = {
  id: string;
  athleteId: string;
  providerId: string;
  type: 'plan' | 'assessment' | 'note' | 'video' | 'invoice';
  title: string;
  templateName: string;
  createdAt: string;
};

export type Earnings = {
  daily: number;
  weekly: number;
  monthly: number;
};

export type TimeSlot = {
  id: string;
  providerId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  isRecurring: boolean;
  specificDate?: string; // ISO date for one-time slots
};

export type Availability = {
  recurring: TimeSlot[];
  oneTime: TimeSlot[];
};
