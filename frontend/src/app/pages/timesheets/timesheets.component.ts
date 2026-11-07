import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Timesheet } from '../../core/models/talent.model';
import { DatadogLoggerService } from '../../core/services/datadog-logger.service';

@Component({
  selector: 'app-timesheets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="timesheets-page">
      <div class="header-row">
        <div>
          <div class="badge badge-cyan mb-2">
            <span class="material-icons" style="font-size: 14px;">timer</span>
            HR & Time Tracking
          </div>
          <h1>Weekly Engineering Timesheets</h1>
          <p class="subtitle">
            Synchronized async time logging, sprint deliverable validation, and one-click manager sign-off.
          </p>
        </div>

        <button class="btn-primary" (click)="showSubmitModal = true">
          <span class="material-icons" style="font-size: 16px;">add</span>
          Log Weekly Timesheet
        </button>
      </div>

      <!-- Quick Metrics -->
      <div class="metrics-row">
        <div class="metric-card">
          <span class="lbl">Total Hours Logged (Sep)</span>
          <span class="val">472.0 hrs</span>
        </div>
        <div class="metric-card">
          <span class="lbl">Approval Rate</span>
          <span class="val highlight-emerald">98.5%</span>
        </div>
        <div class="metric-card">
          <span class="lbl">Pending Review</span>
          <span class="val highlight-amber">1 Timesheet</span>
        </div>
        <div class="metric-card">
          <span class="lbl">Quartz Friday Alert</span>
          <span class="val highlight-cyan">Active (16:00 WIB)</span>
        </div>
      </div>

      <!-- Timesheets Table / Cards -->
      <div class="table-container">
        <table class="eterna-table">
          <thead>
            <tr>
              <th>Engineer</th>
              <th>Client Company</th>
              <th>Week Commencing</th>
              <th>Logged Hours</th>
              <th>Deliverables Summary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ts of timesheets">
              <td>
                <div class="engineer-col">
                  <strong>{{ ts.talentName }}</strong>
                </div>
              </td>
              <td>{{ ts.clientName }}</td>
              <td>{{ ts.weekStartDate }}</td>
              <td>
                <span class="hours-badge">{{ ts.hoursLogged }} hrs</span>
              </td>
              <td class="deliverables-cell">{{ ts.deliverables }}</td>
              <td>
                <span
                  class="badge"
                  [ngClass]="{
                    'badge-emerald': ts.status === 'APPROVED',
                    'badge-amber': ts.status === 'SUBMITTED',
                    'badge-cyan': ts.status === 'PAID'
                  }"
                >
                  {{ ts.status }}
                </span>
              </td>
              <td>
                <button
                  *ngIf="ts.status === 'SUBMITTED'"
                  class="btn-approve"
                  (click)="approveTimesheet(ts)"
                >
                  <span class="material-icons" style="font-size: 14px;">check</span>
                  Approve
                </button>
                <span *ngIf="ts.status === 'APPROVED'" class="approved-text">
                  <span class="material-icons" style="font-size: 14px; color: #10B981;">done_all</span>
                  Ready for Payroll
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- New Timesheet Submission Modal -->
      <div *ngIf="showSubmitModal" class="modal-backdrop" (click)="showSubmitModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>Log Weekly Engineering Hours</h3>
            <button class="btn-close" (click)="showSubmitModal = false">×</button>
          </header>

          <form (ngSubmit)="submitTimesheet()" class="modal-form">
            <div class="form-group">
              <label>Engineer Profile</label>
              <select [(ngModel)]="newTs.talentName" name="talentName" class="form-control">
                <option value="Arya Wibowo">Arya Wibowo (Lead Java & Angular)</option>
                <option value="Dewi Anggraini">Dewi Anggraini (Senior Frontend)</option>
                <option value="Rizky Maulana">Rizky Maulana (Fullstack Spring Boot)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Assigned Client</label>
              <input type="text" [(ngModel)]="newTs.clientName" name="clientName" class="form-control" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Week Starting (Monday)</label>
                <input type="date" [(ngModel)]="newTs.weekStartDate" name="weekStartDate" class="form-control" />
              </div>
              <div class="form-group">
                <label>Hours Logged</label>
                <input type="number" [(ngModel)]="newTs.hoursLogged" name="hoursLogged" class="form-control" />
              </div>
            </div>

            <div class="form-group">
              <label>Sprint Deliverables & Code Shipped</label>
              <textarea
                [(ngModel)]="newTs.deliverables"
                name="deliverables"
                rows="3"
                class="form-control"
                placeholder="e.g. Completed NgRx store refactoring, fixed Redis token cache serialization, and shipped 4 Playwright E2E tests..."
              ></textarea>
            </div>

            <footer class="modal-actions">
              <button type="button" class="btn-secondary" (click)="showSubmitModal = false">Cancel</button>
              <button type="submit" class="btn-primary">Submit to Client Review</button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timesheets-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      h1 { font-size: 1.85rem; font-weight: 800; }
      .subtitle { color: var(--text-secondary); font-size: 0.95rem; }
    }
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
    }
    .metric-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      .lbl { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
      .val { font-size: 1.35rem; font-weight: 800; }
    }
    .highlight-emerald { color: #34D399; }
    .highlight-amber { color: #FBBF24; }
    .highlight-cyan { color: var(--accent-cyan-light); }

    .table-container {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow-x: auto;
    }
    .eterna-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
      th {
        background: var(--bg-card);
        padding: 14px 18px;
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        border-bottom: 1px solid var(--border-subtle);
      }
      td {
        padding: 16px 18px;
        border-bottom: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        vertical-align: middle;
      }
      tr:hover td {
        background: rgba(255, 255, 255, 0.02);
      }
    }
    .engineer-col {
      strong { color: var(--text-primary); font-size: 0.95rem; }
    }
    .hours-badge {
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.25);
      color: var(--accent-cyan-light);
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.8rem;
    }
    .deliverables-cell {
      max-width: 320px;
      line-height: 1.45;
    }
    .btn-approve {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34D399;
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        background: rgba(16, 185, 129, 0.25);
      }
    }
    .approved-text {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: #34D399;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(6px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-content {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 520px;
      overflow: hidden;
    }
    .modal-header {
      padding: 18px 24px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 { font-size: 1.15rem; font-weight: 700; }
    }
    .btn-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
    }
    .modal-form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      label {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 600;
      }
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-control {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 10px 14px;
      color: var(--text-primary);
      font-family: var(--font-main);
      font-size: 0.9rem;
      outline: none;
      &:focus { border-color: var(--border-focus); }
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 10px;
    }
  `]
})
export class TimesheetsComponent implements OnInit {
  timesheets: Timesheet[] = [];
  showSubmitModal = false;

  newTs: Partial<Timesheet> = {
    talentName: 'Arya Wibowo',
    clientName: 'OmniStream Global',
    weekStartDate: new Date().toISOString().substring(0, 10),
    hoursLogged: 40,
    deliverables: ''
  };

  constructor(
    private apiService: ApiService,
    private datadog: DatadogLoggerService
  ) {}

  ngOnInit() {
    this.datadog.info('Navigated to Timesheets page');
    this.apiService.getTimesheets().subscribe(data => {
      this.timesheets = data;
    });
  }

  approveTimesheet(ts: Timesheet) {
    this.datadog.info('User approving timesheet', { timesheetId: ts.id, talent: ts.talentName });
    this.apiService.updateTimesheetStatus(ts.id, 'APPROVED').subscribe(updated => {
      ts.status = 'APPROVED';
      this.datadog.info('Timesheet approval succeeded in UI', { timesheetId: ts.id });
    });
  }

  submitTimesheet() {
    this.datadog.info('User submitting new timesheet', { ...this.newTs });
    this.apiService.submitTimesheet(this.newTs).subscribe(created => {
      this.datadog.info('Timesheet submitted successfully', { timesheetId: created.id });
      this.showSubmitModal = false;
      this.newTs = {
        talentName: 'Arya Wibowo',
        clientName: 'OmniStream Global',
        weekStartDate: new Date().toISOString().substring(0, 10),
        hoursLogged: 40,
        deliverables: ''
      };
    });
  }
}
