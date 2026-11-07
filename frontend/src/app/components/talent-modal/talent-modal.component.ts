import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Talent } from '../../core/models/talent.model';

@Component({
  selector: 'app-talent-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <div class="profile-header-left">
            <img [src]="talent.avatarUrl" [alt]="talent.fullName" class="profile-avatar">
            <div>
              <div class="name-badge-row">
                <h2>{{ talent.fullName }}</h2>
                <span class="badge badge-emerald">
                  <span class="material-icons" style="font-size: 14px;">verified</span>
                  Vetted {{ talent.verifiedScore }}%
                </span>
              </div>
              <p class="role-title">{{ talent.primaryRole }}</p>
              <div class="location-timezone">
                <span class="material-icons-outlined text-muted" style="font-size: 15px;">location_on</span>
                <span>{{ talent.locationCity }}, Indonesia</span>
                <span class="dot">•</span>
                <span class="material-icons-outlined text-muted" style="font-size: 15px;">schedule</span>
                <span>{{ talent.timezone }}</span>
              </div>
            </div>
          </div>
          <button class="btn-close" (click)="close()">
            <span class="material-icons">close</span>
          </button>
        </header>

        <div class="modal-body">
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">Experience</span>
              <span class="metric-val">{{ talent.experienceYears }}+ Years</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">English Fluency</span>
              <span class="metric-val highlight-cyan">{{ talent.englishFluencyScore }} / 10 (C1 Proficient)</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Billing Rate (Client)</span>
              <span class="metric-val highlight-emerald">\${{ talent.hourlyRateUsd }}/hr</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Base Salary (IDR)</span>
              <span class="metric-val">Rp {{ talent.monthlyRateIdr | number }} / mo</span>
            </div>
          </div>

          <div class="section-block">
            <h3>Technical Skill Stack & Mastery</h3>
            <div class="skills-wrap">
              <span *ngFor="let skill of talent.skills" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="section-block">
            <h3>Executive Summary</h3>
            <p class="bio-text">{{ talent.bio }}</p>
          </div>

          <div class="section-block">
            <h3>Featured Enterprise Deliverables</h3>
            <ul class="projects-list">
              <li *ngFor="let proj of talent.topProjects">
                <span class="material-icons-outlined text-cyan" style="font-size: 18px;">check_circle</span>
                <span>{{ proj }}</span>
              </li>
            </ul>
          </div>

          <div class="section-block timezone-overlap-box">
            <div class="tz-header">
              <span class="material-icons-outlined text-cyan">public</span>
              <h4>Global Timezone Overlap Matrix</h4>
            </div>
            <div class="tz-grid">
              <div class="tz-chip">
                <strong>US West (PST):</strong> 4 hrs live sync (18:00 - 22:00 WIB)
              </div>
              <div class="tz-chip">
                <strong>US East (EST):</strong> 5 hrs live sync (19:00 - 00:00 WIB)
              </div>
              <div class="tz-chip">
                <strong>Europe (GMT/CET):</strong> 5 hrs live sync (13:00 - 18:00 WIB)
              </div>
              <div class="tz-chip">
                <strong>APAC (SGT / AEST):</strong> 7-8 hrs full working day sync
              </div>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn-secondary" (click)="close()">Close</button>
          <button class="btn-primary" (click)="requestPlacement()">
            <span class="material-icons" style="font-size: 16px;">handshake</span>
            Schedule Placement Interview
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(4, 8, 17, 0.82);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 720px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      animation: modalFadeIn 0.25s ease-out;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .modal-header {
      padding: 24px;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .profile-header-left {
      display: flex;
      gap: 18px;
      align-items: center;
    }
    .profile-avatar {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-md);
      object-fit: cover;
      border: 2px solid var(--accent-cyan);
    }
    .name-badge-row {
      display: flex;
      align-items: center;
      gap: 12px;
      h2 {
        font-size: 1.35rem;
        font-weight: 700;
      }
    }
    .role-title {
      color: var(--accent-cyan-light);
      font-size: 0.95rem;
      font-weight: 500;
      margin: 4px 0 6px 0;
    }
    .location-timezone {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 0.85rem;
      .dot { color: var(--text-muted); }
    }
    .btn-close {
      background: rgba(255, 255, 255, 0.06);
      border: none;
      color: var(--text-secondary);
      width: 34px;
      height: 34px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: var(--text-primary);
      }
    }
    .modal-body {
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .metric-item {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .metric-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .metric-val {
      font-size: 0.95rem;
      font-weight: 700;
    }
    .highlight-cyan { color: var(--accent-cyan-light); }
    .highlight-emerald { color: #34D399; }
    .section-block {
      h3 {
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 10px;
        color: var(--text-primary);
      }
    }
    .skills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-tag {
      background: rgba(6, 182, 212, 0.09);
      border: 1px solid rgba(6, 182, 212, 0.25);
      color: var(--accent-cyan-light);
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .bio-text {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.55;
    }
    .projects-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      li {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    }
    .timezone-overlap-box {
      background: rgba(6, 182, 212, 0.05);
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: var(--radius-md);
      padding: 16px;
      .tz-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-cyan-light);
        }
      }
      .tz-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        @media (max-width: 600px) {
          grid-template-columns: 1fr;
        }
      }
      .tz-chip {
        font-size: 0.8rem;
        color: var(--text-secondary);
        strong { color: var(--text-primary); }
      }
    }
    .modal-footer {
      padding: 18px 24px;
      background: var(--bg-card);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `]
})
export class TalentModalComponent {
  @Input({ required: true }) talent!: Talent;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() hireEvent = new EventEmitter<Talent>();

  close() {
    this.closeEvent.emit();
  }

  requestPlacement() {
    this.hireEvent.emit(this.talent);
  }
}
