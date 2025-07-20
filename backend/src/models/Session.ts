export interface SessionModel {
  id: string;
  name: string;
  createdAt: string;
  isActive: boolean;
}

export const sessions: SessionModel[] = [];