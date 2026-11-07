import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Talent, ClientCompany, Placement, Timesheet, PayrollRecord } from '../models/talent.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/v1';

  // Rich initial dataset representing top Indonesian Tech Talent vetted by Eterna
  private mockTalents: Talent[] = [
    {
      id: 1,
      fullName: 'Arya Wibowo',
      email: 'arya.wibowo@eterna.dev',
      primaryRole: 'Lead Java & Angular Fullstack Architect',
      experienceYears: 7,
      skills: ['Java 21', 'Spring Boot 3', 'Angular 19', 'Ionic 8', 'NgRx', 'Redis', 'Docker', 'AWS CDK'],
      locationCity: 'Bandung',
      timezone: 'Asia/Jakarta (WIB UTC+7)',
      hourlyRateUsd: 48,
      monthlyRateIdr: 42000000,
      englishFluencyScore: 9.5,
      status: 'AVAILABLE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Ex-Gojek and Traveloka senior engineer specializing in distributed JVM services, high-concurrency Redis caching, and reactive Angular 19 hybrid mobile apps.',
      githubUrl: 'https://github.com/aryawibowo',
      linkedinUrl: 'https://linkedin.com/in/aryawibowo',
      coordinates: { lat: -6.9175, lng: 107.6191 },
      timezoneOffsetHours: 7,
      verifiedScore: 98,
      topProjects: ['Fintech Payment Gateway with 12K TPS', 'Cross-Platform Ionic Logistics App']
    },
    {
      id: 2,
      fullName: 'Dewi Anggraini',
      email: 'dewi.anggraini@eterna.dev',
      primaryRole: 'Senior Frontend & Ionic Mobile Specialist',
      experienceYears: 5,
      skills: ['Angular 19', 'Ionic 8', 'Capacitor 8', 'TypeScript', 'RxJS', 'NgRx', 'Angular Material', 'Jest'],
      locationCity: 'Jakarta',
      timezone: 'Asia/Jakarta (WIB UTC+7)',
      hourlyRateUsd: 40,
      monthlyRateIdr: 32000000,
      englishFluencyScore: 9.3,
      status: 'PLACED',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Passionate UI/UX focused frontend engineer with extensive experience building enterprise hybrid mobile applications using Ionic 8 and Capacitor for global startups.',
      githubUrl: 'https://github.com/dewianggr',
      coordinates: { lat: -6.2088, lng: 106.8456 },
      timezoneOffsetHours: 7,
      verifiedScore: 96,
      topProjects: ['E-Commerce Hybrid App on App Store & Play Store', 'Design System with Angular Material']
    },
    {
      id: 3,
      fullName: 'Rizky Maulana',
      email: 'rizky.maulana@eterna.dev',
      primaryRole: 'Fullstack Spring Boot & Angular Engineer',
      experienceYears: 4,
      skills: ['Java 21', 'Spring Boot 3', 'MySQL', 'Redis', 'Angular 19', 'Playwright', 'Docker'],
      locationCity: 'Yogyakarta',
      timezone: 'Asia/Jakarta (WIB UTC+7)',
      hourlyRateUsd: 36,
      monthlyRateIdr: 26000000,
      englishFluencyScore: 9.0,
      status: 'AVAILABLE',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Fullstack specialist from Yogyakarta with a solid background in MySQL performance optimization, Quartz scheduling, and modern Angular component development.',
      coordinates: { lat: -7.7956, lng: 110.3695 },
      timezoneOffsetHours: 7,
      verifiedScore: 94,
      topProjects: ['Automated Payroll Scheduler with Quartz & Redis', 'Customer Support Portal']
    },
    {
      id: 4,
      fullName: 'Siti Rahmawati',
      email: 'siti.rahma@eterna.dev',
      primaryRole: 'DevOps & Cloud Backend Engineer',
      experienceYears: 6,
      skills: ['Java 21', 'Spring Boot', 'AWS CDK', 'Docker', 'Kubernetes', 'MySQL', 'Terraform'],
      locationCity: 'Surabaya',
      timezone: 'Asia/Jakarta (WIB UTC+7)',
      hourlyRateUsd: 45,
      monthlyRateIdr: 36000000,
      englishFluencyScore: 9.1,
      status: 'INTERVIEWING',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      bio: 'Cloud and platform engineer focused on reliable CI/CD pipelines, AWS CDK infrastructure-as-code, and microservices resilience.',
      coordinates: { lat: -7.2575, lng: 112.7521 },
      timezoneOffsetHours: 7,
      verifiedScore: 97,
      topProjects: ['AWS Multi-Region ECS Fargate Cluster', 'Zero-Downtime Migration for 500K Users']
    },
    {
      id: 5,
      fullName: 'I Made Bagus Suryanata',
      email: 'bagus.suryanata@eterna.dev',
      primaryRole: 'Fullstack Mobile & Web Engineer',
      experienceYears: 5,
      skills: ['Angular 19', 'Ionic 8', 'Capacitor 8', 'Java 21', 'Spring Boot', 'Google Maps SDK', 'Firebase'],
      locationCity: 'Denpasar',
      timezone: 'Asia/Makassar (WITA UTC+8)',
      hourlyRateUsd: 42,
      monthlyRateIdr: 30000000,
      englishFluencyScore: 9.4,
      status: 'AVAILABLE',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Remote-first engineer based in Bali with 5+ years building location-aware apps with Google Maps SDK and cross-platform Ionic interfaces for Silicon Valley companies.',
      coordinates: { lat: -8.6705, lng: 115.2126 },
      timezoneOffsetHours: 8,
      verifiedScore: 95,
      topProjects: ['Fleet Tracking App with Google Maps SDK', 'Hospitality Booking Engine']
    }
  ];

  private mockClients: ClientCompany[] = [
    {
      id: 1,
      name: 'OmniStream Global',
      country: 'United States',
      city: 'San Francisco, CA',
      timezone: 'PST (UTC-8)',
      timezoneOffsetHours: -8,
      coordinates: { lat: 37.7749, lng: -122.4194 },
      activeTalentsCount: 3,
      industry: 'Fintech & Payments',
      logo: 'assets/clients/omnistream.svg'
    },
    {
      id: 2,
      name: 'Veloce Health UK',
      country: 'United Kingdom',
      city: 'London',
      timezone: 'GMT (UTC+0)',
      timezoneOffsetHours: 0,
      coordinates: { lat: 51.5074, lng: -0.1278 },
      activeTalentsCount: 2,
      industry: 'HealthTech & Telemedicine',
      logo: 'assets/clients/veloce.svg'
    },
    {
      id: 3,
      name: 'NexaScale Asia',
      country: 'Singapore',
      city: 'Singapore',
      timezone: 'SGT (UTC+8)',
      timezoneOffsetHours: 8,
      coordinates: { lat: 1.3521, lng: 103.8198 },
      activeTalentsCount: 4,
      industry: 'Enterprise SaaS',
      logo: 'assets/clients/nexascale.svg'
    },
    {
      id: 4,
      name: 'Southern Cross Digital',
      country: 'Australia',
      city: 'Sydney',
      timezone: 'AEST (UTC+10)',
      timezoneOffsetHours: 10,
      coordinates: { lat: -33.8688, lng: 151.2093 },
      activeTalentsCount: 2,
      industry: 'Logistics & Supply Chain',
      logo: 'assets/clients/southerncross.svg'
    }
  ];

  private mockPlacements: Placement[] = [
    {
      id: 101,
      talent: this.mockTalents[1],
      client: this.mockClients[0],
      roleTitle: 'Lead Mobile UI/UX Engineer',
      startDate: '2026-03-01',
      status: 'ACTIVE',
      clientRateUsd: 45,
      talentSalaryIdr: 32000000,
      dailyOverlapHours: 4
    },
    {
      id: 102,
      talent: this.mockTalents[0],
      client: this.mockClients[2],
      roleTitle: 'Principal Fullstack Java Architect',
      startDate: '2026-04-15',
      status: 'ACTIVE',
      clientRateUsd: 55,
      talentSalaryIdr: 42000000,
      dailyOverlapHours: 8
    }
  ];

  private mockTimesheets: Timesheet[] = [
    {
      id: 1,
      placementId: 101,
      talentName: 'Dewi Anggraini',
      clientName: 'OmniStream Global',
      weekStartDate: '2026-09-08',
      hoursLogged: 40.0,
      status: 'APPROVED',
      deliverables: 'Migrated Angular 18 hybrid app to Angular 19 & Ionic 8; integrated Capacitor camera & push notification plugins.',
      submittedDate: '2026-09-12'
    },
    {
      id: 2,
      placementId: 102,
      talentName: 'Arya Wibowo',
      clientName: 'NexaScale Asia',
      weekStartDate: '2026-09-08',
      hoursLogged: 40.0,
      status: 'APPROVED',
      deliverables: 'Optimized Redis cache serialization, upgraded Spring Boot 3 JPA queries, implemented Jest/Playwright test pipeline.',
      submittedDate: '2026-09-12'
    },
    {
      id: 3,
      placementId: 101,
      talentName: 'Dewi Anggraini',
      clientName: 'OmniStream Global',
      weekStartDate: '2026-09-15',
      hoursLogged: 32.0,
      status: 'SUBMITTED',
      deliverables: 'Implemented Google Maps SDK geolocation view for customer deliveries with live markers and route polyline.',
      submittedDate: '2026-09-15'
    }
  ];

  constructor(private http: HttpClient) {}

  getTalents(): Observable<Talent[]> {
    return this.http.get<Talent[]>(`${this.baseUrl}/talents`).pipe(
      catchError(() => of(this.mockTalents))
    );
  }

  getClients(): Observable<ClientCompany[]> {
    return of(this.mockClients);
  }

  getPlacements(): Observable<Placement[]> {
    return of(this.mockPlacements);
  }

  getTimesheets(): Observable<Timesheet[]> {
    return of(this.mockTimesheets);
  }

  updateTimesheetStatus(id: number, status: Timesheet['status']): Observable<Timesheet> {
    const ts = this.mockTimesheets.find(t => t.id === id);
    if (ts) {
      ts.status = status;
    }
    return of(ts!);
  }

  submitTimesheet(timesheet: Partial<Timesheet>): Observable<Timesheet> {
    const newTs: Timesheet = {
      id: Date.now(),
      placementId: timesheet.placementId || 101,
      talentName: timesheet.talentName || 'Dewi Anggraini',
      clientName: timesheet.clientName || 'OmniStream Global',
      weekStartDate: timesheet.weekStartDate || new Date().toISOString().substring(0, 10),
      hoursLogged: timesheet.hoursLogged || 40,
      status: 'SUBMITTED',
      deliverables: timesheet.deliverables || '',
      submittedDate: new Date().toISOString().substring(0, 10)
    };
    this.mockTimesheets.unshift(newTs);
    return of(newTs);
  }
}
