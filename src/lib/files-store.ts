import { create } from 'zustand';
import type { SharedFile } from './types';
import { files as seedFiles } from './mock-data';

export type ReportSubmission = {
  athleteId: string;
  providerId: string;
  type: SharedFile['type'];
  title: string;
  templateName: string;
  content: string;
};

interface FilesState {
  files: SharedFile[];
  addReport: (submission: ReportSubmission) => SharedFile;
  filesForAthlete: (athleteId: string) => SharedFile[];
}

export const useFilesStore = create<FilesState>((set, get) => ({
  files: [...seedFiles],
  addReport: (submission) => {
    const newFile: SharedFile = {
      id: `file-${crypto.randomUUID()}`,
      athleteId: submission.athleteId,
      providerId: submission.providerId,
      type: submission.type,
      title: submission.title,
      templateName: submission.templateName,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ files: [newFile, ...state.files] }));
    return newFile;
  },
  filesForAthlete: (athleteId) =>
    get().files
      .filter((f) => f.athleteId === athleteId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
}));
