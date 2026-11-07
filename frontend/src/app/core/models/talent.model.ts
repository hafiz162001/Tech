export interface Talent {
  id: number;
  fullName: string;
  email: string;
  primaryRole: string;
  experienceYears: number;
  skills: string[];
  locationCity: string;
  timezone: string;
  hourlyRateUsd: number;
  monthlyRateIdr: number;
  englishFluencyScore: number;
  status: 'AVAILABLE' | 'INTERVIEWING' | 'PLACED' | 'ON_LEAVE';
  avatarUrl: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  coordinates: { lat: number; lng: number };
  timezoneOffsetHours: number; // UTC+7 (WIB)
  verifiedScore: number; // Eterna Technical Vetting Score / 100
  topProjects: string[];
}

export interface ClientCompany {
  id: number;
  name: string;
  country: string;
  city: string;
  timezone: string;
  timezoneOffsetHours: number;
  coordinates: { lat: number; lng: number };
  activeTalentsCount: number;
  industry: string;
  logo: string;
}

export interface Placement {
  id: number;
  talent: Talent;
  client: ClientCompany;
  roleTitle: string;
  startDate: string;
  status: 'INTERVIEW' | 'OFFERED' | 'ACTIVE' | 'COMPLETED';
  clientRateUsd: number;
  talentSalaryIdr: number;
  dailyOverlapHours: number;
}

export interface Timesheet {
  id: number;
  placementId: number;
  talentName: string;
  clientName: string;
  weekStartDate: string;
  hoursLogged: number;
  status: 'SUBMITTED' | 'APPROVED' | 'PAID';
  deliverables: string;
  submittedDate: string;
}

export interface PayrollRecord {
  id: number;
  talentId: number;
  talentName: string;
  role: string;
  periodMonth: string;
  grossSalaryIdr: number;
  taxPph21Idr: number;
  bpjsKesehatanIdr: number;
  bpjsKetenagakerjaanIdr: number;
  totalDeductionsIdr: number;
  netPayoutIdr: number;
  clientInvoiceUsd: number;
  exchangeRateUsdIdr: number;
  status: 'CALCULATED' | 'APPROVED' | 'DISBURSED';
  payslipId: string;
}
