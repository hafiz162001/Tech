import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Placement } from '../../core/models/talent.model';

@Component({
  selector: 'app-placements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="placements-page">
      <div class="page-header">
        <div>
          <div class="badge badge-emerald mb-2">
            <span class="material-icons" style="font-size: 14px;">handshake</span>
            Client Placement & Hiring Pipeline
          </div>
          <h1>End-to-End Placement & Contract Lifecycle</h1>
          <p class="subtitle">
            Track engineers from technical vetting through client interviews, employment contracts, and direct embedding into global engineering squads.
          </p>
        </div>

        <div class="stats-summary">
          <div class="stat-box">
            <span class="val">\$48.5K</span>
            <span class="lbl">Monthly Client ARR</span>
          </div>
          <div class="stat-box">
            <span class="val highlight-emerald">100%</span>
            <span class="lbl">Contract Retention</span>
          </div>
          <div class="stat-box">
            <span class="val highlight-cyan">8 Days</span>
            <span class="lbl">Avg Time to Match</span>
          </div>
        </div>
      </div>

      <!-- Pipeline Columns -->
      <div class="pipeline-board">
        <!-- Stage 1: Technical Vetting -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="col-title">
              <span class="step-num">1</span>
              <h3>Technical Vetting</h3>
            </div>
            <span class="count-badge">2</span>
          </div>

          <div class="cards-list">
            <div class="pipeline-card">
              <div class="card-top">
                <span class="badge badge-cyan">Java 21 • Spring Boot</span>
                <span class="rate-tag">\$45/hr</span>
              </div>
              <h4>Siti Rahmawati</h4>
              <p class="card-role">DevOps & Cloud Backend Engineer</p>
              <div class="meta-row">
                <span class="material-icons-outlined text-muted" style="font-size: 14px;">terminal</span>
                <span>Algorithm & System Design passed (97%)</span>
              </div>
              <div class="card-footer">
                <span class="city-tag">Surabaya</span>
                <button class="btn-advance" (click)="advanceStage('Siti Rahmawati', 'Client Interview')">
                  Advance to Interview →
                </button>
              </div>
            </div>

            <div class="pipeline-card">
              <div class="card-top">
                <span class="badge badge-indigo">Angular 19 • Ionic 8</span>
                <span class="rate-tag">\$42/hr</span>
              </div>
              <h4>I Made Bagus Suryanata</h4>
              <p class="card-role">Fullstack Mobile & Web Engineer</p>
              <div class="meta-row">
                <span class="material-icons-outlined text-muted" style="font-size: 14px;">verified_user</span>
                <span>English C1 & Live Coding passed</span>
              </div>
              <div class="card-footer">
                <span class="city-tag">Denpasar, Bali</span>
                <button class="btn-advance" (click)="advanceStage('I Made Bagus', 'Client Interview')">
                  Advance to Interview →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stage 2: Client Interview -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="col-title">
              <span class="step-num">2</span>
              <h3>Client Interview</h3>
            </div>
            <span class="count-badge">1</span>
          </div>

          <div class="cards-list">
            <div class="pipeline-card">
              <div class="card-top">
                <span class="badge badge-amber">Interview Scheduled</span>
                <span class="rate-tag">\$36/hr</span>
              </div>
              <h4>Rizky Maulana</h4>
              <p class="card-role">Fullstack Spring Boot & Angular Engineer</p>
              <div class="client-match-banner">
                <span class="material-icons-outlined text-cyan" style="font-size: 15px;">business</span>
                <span>Matching with: <strong>Veloce Health UK</strong></span>
              </div>
              <div class="meta-row">
                <span class="material-icons-outlined text-muted" style="font-size: 14px;">event</span>
                <span>Final Round: Sep 18, 15:00 WIB (09:00 GMT)</span>
              </div>
              <div class="card-footer">
                <span class="city-tag">Yogyakarta</span>
                <button class="btn-advance" (click)="advanceStage('Rizky Maulana', 'Offer & Contract')">
                  Extend Offer →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stage 3: Offer & HR Contract -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="col-title">
              <span class="step-num">3</span>
              <h3>Offer & Contract</h3>
            </div>
            <span class="count-badge">1</span>
          </div>

          <div class="cards-list">
            <div class="pipeline-card">
              <div class="card-top">
                <span class="badge badge-indigo">Contract Drafting</span>
                <span class="rate-tag">\$48/hr</span>
              </div>
              <h4>Arya Wibowo</h4>
              <p class="card-role">Lead Java & Angular Architect</p>
              <div class="client-match-banner">
                <span class="material-icons-outlined text-cyan" style="font-size: 15px;">business</span>
                <span>Client: <strong>NexaScale Asia (Singapore)</strong></span>
              </div>
              <div class="contract-breakdown">
                <div><span>Salary:</span> <strong>Rp 42.0M / mo</strong></div>
                <div><span>Client Billing:</span> <strong>\$55/hr USD</strong></div>
                <div><span>Eterna Handling:</span> <strong>PPh 21, BPJS, S3 Doc</strong></div>
              </div>
              <div class="card-footer">
                <span class="city-tag">Bandung</span>
                <button class="btn-advance highlight" (click)="advanceStage('Arya Wibowo', 'Placed & Active')">
                  Sign & Place →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stage 4: Placed & Active -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="col-title">
              <span class="step-num">4</span>
              <h3>Placed & Active</h3>
            </div>
            <span class="count-badge active-count">1</span>
          </div>

          <div class="cards-list">
            <div class="pipeline-card active-contract-card">
              <div class="card-top">
                <span class="badge badge-emerald">
                  <span class="material-icons" style="font-size: 13px;">check_circle</span>
                  Embedded in Squad
                </span>
                <span class="rate-tag">\$45/hr</span>
              </div>
              <h4>Dewi Anggraini</h4>
              <p class="card-role">Lead Mobile UI/UX Specialist</p>
              <div class="client-match-banner">
                <span class="material-icons-outlined text-emerald" style="font-size: 15px;">domain</span>
                <span>Company: <strong>OmniStream Global (USA)</strong></span>
              </div>
              <div class="meta-row">
                <span class="material-icons-outlined text-muted" style="font-size: 14px;">date_range</span>
                <span>Placed since March 2026 • 4 hrs daily overlap</span>
              </div>
              <div class="card-footer">
                <span class="status-pill-ok">Weekly Timesheet Active</span>
                <span class="city-tag">Jakarta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Toast -->
      <div *ngIf="actionToast" class="toast-alert">
        <span class="material-icons text-cyan">info</span>
        <span>{{ actionToast }}</span>
      </div>
    </div>
  `,
  styles: [`
    .placements-page {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      h1 { font-size: 1.85rem; font-weight: 800; }
      .subtitle { color: var(--text-secondary); font-size: 0.95rem; }
    }
    .stats-summary {
      display: flex;
      gap: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 12px 20px;
    }
    .stat-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .val { font-size: 1.35rem; font-weight: 800; }
      .lbl { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; }
    }
    .highlight-emerald { color: #34D399; }
    .highlight-cyan { color: var(--accent-cyan-light); }

    .pipeline-board {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
    .pipeline-column {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      min-height: 500px;
    }
    .column-header {
      padding: 16px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .col-title {
      display: flex;
      align-items: center;
      gap: 8px;
      h3 { font-size: 0.95rem; font-weight: 700; }
    }
    .step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-cyan-light);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .count-badge {
      background: rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-full);
      padding: 2px 8px;
      font-size: 0.75rem;
      color: var(--text-secondary);
      &.active-count {
        background: rgba(16, 185, 129, 0.2);
        color: #34D399;
      }
    }
    .cards-list {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1;
    }
    .pipeline-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, border-color 0.2s;
      &:hover {
        border-color: rgba(6, 182, 212, 0.3);
        transform: translateY(-2px);
      }
      h4 { font-size: 0.95rem; font-weight: 700; }
    }
    .active-contract-card {
      border-left: 3px solid #10B981;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .rate-tag {
      font-size: 0.85rem;
      font-weight: 700;
      color: #34D399;
    }
    .card-role {
      font-size: 0.8rem;
      color: var(--accent-cyan-light);
    }
    .client-match-banner {
      background: rgba(6, 182, 212, 0.06);
      border: 1px solid rgba(6, 182, 212, 0.15);
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .meta-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .contract-breakdown {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 4px;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 0.75rem;
      div {
        display: flex;
        justify-content: space-between;
        span { color: var(--text-muted); }
      }
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-subtle);
      padding-top: 8px;
      margin-top: 4px;
    }
    .city-tag {
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .btn-advance {
      background: none;
      border: 1px solid var(--border-subtle);
      color: var(--accent-cyan-light);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        background: rgba(6, 182, 212, 0.15);
        border-color: var(--accent-cyan);
      }
      &.highlight {
        background: var(--gradient-brand);
        color: #FFFFFF;
        border: none;
      }
    }
    .status-pill-ok {
      font-size: 0.72rem;
      color: #34D399;
      font-weight: 600;
    }
    .toast-alert {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-card);
      border: 1px solid rgba(6, 182, 212, 0.4);
      padding: 14px 20px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      font-size: 0.875rem;
    }
  `]
})
export class PlacementsComponent {
  actionToast: string | null = null;

  advanceStage(talentName: string, nextStage: string) {
    this.actionToast = `Advanced ${talentName} to stage: ${nextStage}. Candidate notified asynchronously.`;
    setTimeout(() => {
      this.actionToast = null;
    }, 3500);
  }
}
