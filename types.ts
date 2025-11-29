
export enum UserRole {
  ADMIN = 'Admin',
  HOSPITAL = 'Hospital',
  RESEARCHER = 'Researcher',
  USER = 'User',
}

export interface User {
  email: string;
  role: UserRole;
  displayName: string;
}

export interface AdvisoryContent {
  english: string;
  hindi: string;
  telugu: string;
  tamil: string;
  recommendation: string;
  severity: 'Low' | 'Medium' | 'High';
}