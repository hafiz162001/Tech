import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Talent } from '../../core/models/talent.model';
import { ApiService } from '../../core/services/api.service';
import * as TalentActions from '../../store/talent/talent.actions';
import * as TalentSelectors from '../../store/talent/talent.selectors';
import { TalentModalComponent } from '../../components/talent-modal/talent-modal.component';

@Component({
  selector: 'app-talent-hub',
  standalone: true,
  imports: [CommonModule, FormsModule, TalentModalComponent],
  template: `
    <div class="talent-hub-page">
      <!-- Hero Banner -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="badge badge-cyan mb-3">
            <span class="material-icons" style="font-size: 14px;">bolt</span>
            Eterna Global Talent Placement
          </div>
          <h1>Indonesian Tech Talent.<br><span class="gradient-text">Directly Embedded In Your Product Team.</span></h1>
          <p class="hero-subtitle">
            We source, vet, and place top Indonesian Java, Spring Boot, Angular, and Mobile engineers. Eterna handles end-to-end legal entity compliance, HR, and multi-currency payroll.
          </p>

          <div class="hero-stats-row">
            <div class="hero-stat">
              <span class="stat-number">Top 2%</span>
              <span class="stat-label">Vetted Indonesian Engineers</span>
            </div>
            <div class="stat-divider"></div>
            <div class="hero-stat">
              <span class="stat-number">C1/C2</span>
              <span class="stat-label">English Fluency Verified</span>
            </div>
            <div class="stat-divider"></div>
            <div class="hero-stat">
              <span class="stat-number">4-8 Hours</span>
              <span class="stat-label">Daily Timezone Overlap</span>
            </div>
            <div class="stat-divider"></div>
            <div class="hero-stat">
              <span class="stat-number">100%</span>
              <span class="stat-label">Indonesian Tax & BPJS Compliant</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Filters & Search Toolbar -->
      <section class="toolbar-section">
        <div class="search-box">
          <span class="material-icons-outlined text-muted">search</span>
          <input
            type="text"
            placeholder="Search engineers by tech stack, role, or keywords (e.g. Java 21, Angular 19, Ionic)..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
          />
          <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">
            <span class="material-icons" style="font-size: 16px;">close</span>
          </button>
        </div>

        <div class="filter-groups">
          <div class="filter-pill-group">
            <span class="group-title">Tech Stack:</span>
            <button
              *ngFor="let s of skillOptions"
              class="filter-pill"
              [class.active]="currentSkill === s"
              (click)="selectSkill(s)"
            >
              {{ s }}
            </button>
          </div>

          <div class="filter-pill-group">
            <span class="group-title">City Hub:</span>
            <button
              *ngFor="let c of cityOptions"
              class="filter-pill"
              [class.active]="currentCity === c"
              (click)="selectCity(c)"
            >
              {{ c }}
            </button>
          </div>

          <div class="filter-pill-group">
            <span class="group-title">Status:</span>
            <button
              *ngFor="let st of statusOptions"
              class="filter-pill"
              [class.active]="currentStatus === st"
              (click)="selectStatus(st)"
            >
              {{ st }}
            </button>
          </div>
        </div>
      </section>

      <!-- Talent Grid -->
      <section class="talents-grid-section">
        <div class="section-meta">
          <h2>Available Indonesian Engineers ({{ (filteredTalents$ | async)?.length || 0 }})</h2>
          <span class="meta-note">Ready for immediate client interview & placement</span>
        </div>

        <div class="talents-grid">
          <div *ngFor="let talent of filteredTalents$ | async" class="talent-card">
            <div class="card-header">
              <div class="avatar-wrap">
                <img [src]="talent.avatarUrl" [alt]="talent.fullName" class="avatar-img" />
                <span class="status-indicator" [ngClass]="talent.status.toLowerCase()"></span>
              </div>
              <div class="card-title-area">
                <div class="name-row">
                  <h3>{{ talent.fullName }}</h3>
                  <span class="vetting-badge">
                    <span class="material-icons text-cyan" style="font-size: 13px;">verified</span>
                    {{ talent.verifiedScore }}%
                  </span>
                </div>
                <p class="role-text">{{ talent.primaryRole }}</p>
                <div class="city-tz">
                  <span class="material-icons-outlined" style="font-size: 14px;">location_on</span>
                  <span>{{ talent.locationCity }}</span>
                  <span class="dot">•</span>
                  <span>{{ talent.experienceYears }} yrs exp</span>
                </div>
              </div>
            </div>

            <p class="card-bio">{{ talent.bio }}</p>

            <div class="skills-chips">
              <span *ngFor="let sk of talent.skills.slice(0, 5)" class="skill-chip">
                {{ sk }}
              </span>
              <span *ngIf="talent.skills.length > 5" class="skill-chip-more">
                +{{ talent.skills.length - 5 }}
              </span>
            </div>

            <div class="card-footer">
              <div class="rate-box">
                <div class="rate-usd">\${{ talent.hourlyRateUsd }}<span class="unit">/hr USD</span></div>
                <div class="rate-idr">Rp {{ (talent.monthlyRateIdr / 1000000) | number:'1.0-1' }}M / mo</div>
              </div>
              <div class="actions-box">
                <button class="btn-secondary btn-sm" (click)="openTalentModal(talent)">
                  View Profile
                </button>
                <button class="btn-primary btn-sm" (click)="initiatePlacement(talent)">
                  Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Talent Detail Modal -->
      <app-talent-modal
        *ngIf="selectedTalent"
        [talent]="selectedTalent"
        (closeEvent)="selectedTalent = null"
        (hireEvent)="initiatePlacement($event)"
      ></app-talent-modal>

      <!-- Placement Toast Notification -->
      <div *ngIf="toastMessage" class="toast-alert">
        <span class="material-icons text-emerald" style="font-size: 20px;">check_circle</span>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .talent-hub-page {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .hero-section {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.04) 50%, rgba(139, 92, 246, 0.08) 100%);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 40px;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-md);

      &::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
        pointer-events: none;
      }
    }
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 860px;
      h1 {
        font-size: 2.25rem;
        font-weight: 800;
        line-height: 1.25;
        margin-bottom: 14px;
        @media (max-width: 768px) { font-size: 1.65rem; }
      }
    }
    .gradient-text {
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      color: var(--text-secondary);
      font-size: 1.05rem;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .hero-stats-row {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid var(--border-subtle);
      padding: 18px 24px;
      border-radius: var(--radius-md);
      backdrop-filter: blur(8px);
    }
    .hero-stat {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .stat-number {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--accent-cyan-light);
    }
    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat-divider {
      width: 1px;
      height: 28px;
      background: var(--border-subtle);
      @media (max-width: 600px) { display: none; }
    }
    .toolbar-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 20px;
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 10px 16px;
      transition: border-color 0.2s;

      &:focus-within {
        border-color: var(--border-focus);
      }
      input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-primary);
        font-family: var(--font-main);
        font-size: 0.95rem;
        &::placeholder {
          color: var(--text-muted);
        }
      }
    }
    .clear-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      &:hover { color: var(--text-primary); }
    }
    .filter-groups {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .filter-pill-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .group-title {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
      min-width: 80px;
    }
    .filter-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      padding: 5px 12px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-family: var(--font-main);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: var(--text-primary);
      }
      &.active {
        background: rgba(6, 182, 212, 0.15);
        color: var(--accent-cyan-light);
        border-color: rgba(6, 182, 212, 0.4);
        font-weight: 600;
      }
    }
    .talents-grid-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .section-meta {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      h2 {
        font-size: 1.35rem;
        font-weight: 700;
      }
      .meta-note {
        font-size: 0.85rem;
        color: var(--text-muted);
      }
    }
    .talents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }
    .talent-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-3px);
        border-color: rgba(6, 182, 212, 0.3);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
      }
    }
    .card-header {
      display: flex;
      gap: 14px;
      align-items: center;
    }
    .avatar-wrap {
      position: relative;
    }
    .avatar-img {
      width: 58px;
      height: 58px;
      border-radius: 12px;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.1);
    }
    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--bg-card);
      &.available { background-color: #10B981; }
      &.placed { background-color: #3B82F6; }
      &.interviewing { background-color: #F59E0B; }
    }
    .card-title-area {
      flex: 1;
    }
    .name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        font-size: 1.05rem;
        font-weight: 700;
      }
    }
    .vetting-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-cyan-light);
      background: rgba(6, 182, 212, 0.1);
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid rgba(6, 182, 212, 0.2);
    }
    .role-text {
      color: var(--accent-cyan-light);
      font-size: 0.85rem;
      font-weight: 500;
      margin: 2px 0 4px 0;
    }
    .city-tz {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--text-muted);
      font-size: 0.8rem;
      .dot { color: var(--text-muted); }
    }
    .card-bio {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .skills-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .skill-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .skill-chip-more {
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.2);
      color: var(--accent-cyan-light);
      border-radius: 6px;
      padding: 3px 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 14px;
      margin-top: auto;
    }
    .rate-box {
      display: flex;
      flex-direction: column;
    }
    .rate-usd {
      font-size: 1.05rem;
      font-weight: 800;
      color: #34D399;
      .unit {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-muted);
      }
    }
    .rate-idr {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .actions-box {
      display: flex;
      gap: 8px;
    }
    .btn-sm {
      padding: 7px 12px;
      font-size: 0.8rem;
    }
    .toast-alert {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-card);
      border: 1px solid rgba(16, 185, 129, 0.3);
      box-shadow: var(--shadow-lg);
      border-radius: var(--radius-md);
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 2000;
      animation: toastSlide 0.3s ease-out;
    }
    @keyframes toastSlide {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class TalentHubComponent implements OnInit {
  filteredTalents$: Observable<Talent[]>;
  searchQuery: string = '';
  selectedTalent: Talent | null = null;
  toastMessage: string | null = null;

  skillOptions = ['ALL', 'Java 21', 'Spring Boot 3', 'Angular 19', 'Ionic 8', 'NgRx', 'Redis', 'AWS CDK'];
  cityOptions = ['ALL', 'Bandung', 'Jakarta', 'Yogyakarta', 'Surabaya', 'Denpasar'];
  statusOptions = ['ALL', 'AVAILABLE', 'INTERVIEWING', 'PLACED'];

  currentSkill = 'ALL';
  currentCity = 'ALL';
  currentStatus = 'ALL';

  constructor(
    private store: Store,
    private apiService: ApiService
  ) {
    this.filteredTalents$ = this.store.select(TalentSelectors.selectFilteredTalents);
  }

  ngOnInit() {
    this.apiService.getTalents().subscribe(talents => {
      this.store.dispatch(TalentActions.loadTalentsSuccess({ talents }));
    });
  }

  onSearchChange(keyword: string) {
    this.store.dispatch(TalentActions.setFilterKeyword({ keyword }));
  }

  clearSearch() {
    this.searchQuery = '';
    this.store.dispatch(TalentActions.setFilterKeyword({ keyword: '' }));
  }

  selectSkill(skill: string) {
    this.currentSkill = skill;
    this.store.dispatch(TalentActions.setFilterSkill({ skill }));
  }

  selectCity(city: string) {
    this.currentCity = city;
    this.store.dispatch(TalentActions.setFilterCity({ city }));
  }

  selectStatus(status: string) {
    this.currentStatus = status;
    this.store.dispatch(TalentActions.setFilterStatus({ status }));
  }

  openTalentModal(talent: Talent) {
    this.selectedTalent = talent;
  }

  initiatePlacement(talent: Talent) {
    this.selectedTalent = null;
    this.toastMessage = `Interview request submitted for ${talent.fullName}! Eterna Placement Lead will connect with you in 2 hours.`;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4500);
  }
}
