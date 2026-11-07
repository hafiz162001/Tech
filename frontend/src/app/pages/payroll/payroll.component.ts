import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../core/services/payroll.service';
import { ApiService } from '../../core/services/api.service';
import { PayrollRecord, Talent } from '../../core/models/talent.model';
import { DatadogLoggerService } from '../../core/services/datadog-logger.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payroll-page">
      <div class="payroll-header">
        <div>
          <div class="badge badge-amber mb-2">
            <span class="material-icons" style="font-size: 14px;">payments</span>
            Multi-Currency Payroll & Indonesian Tax Engine
          </div>
          <h1>Indonesian Payroll & Global Invoicing</h1>
          <p class="subtitle">
            Automated PPh 21 TER tax withholding, BPJS Kesehatan & Ketenagakerjaan statutory deductions, and USD client invoicing.
          </p>
        </div>

        <div class="header-actions">
          <button class="btn-primary" (click)="triggerBatchPayroll()">
            <span class="material-icons" style="font-size: 16px;">schedule_send</span>
            Execute Monthly Payroll Run
          </button>
        </div>
      </div>

      <!-- Live Interactive Tax & Compensation Calculator -->
      <section class="tax-calculator-section">
        <div class="calc-card">
          <div class="calc-header">
            <h3>
              <span class="material-icons-outlined text-cyan" style="font-size: 20px;">calculate</span>
              Interactive Indonesian Gross-to-Net Tax Simulator
            </h3>
            <span class="badge badge-cyan">PP No. 58/2023 & PMK 168/2023 (TER PPh 21)</span>
          </div>

          <div class="calc-body">
            <div class="calc-controls">
              <div class="control-group">
                <div class="label-row">
                  <label>Monthly Gross Salary (IDR):</label>
                  <strong class="highlight-cyan">Rp {{ simGrossSalary | number }} / mo</strong>
                </div>
                <input
                  type="range"
                  min="15000000"
                  max="65000000"
                  step="1000000"
                  [(ngModel)]="simGrossSalary"
                  (ngModelChange)="recalculateSimulator()"
                  class="range-slider"
                />
              </div>

              <div class="control-group">
                <div class="label-row">
                  <label>Overseas Client Billing Rate (USD/hr):</label>
                  <strong class="highlight-emerald">\${{ simBillingRateUsd }}/hr USD</strong>
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  step="2"
                  [(ngModel)]="simBillingRateUsd"
                  (ngModelChange)="recalculateSimulator()"
                  class="range-slider"
                />
              </div>
            </div>

            <!-- Tax Breakdown Results Grid -->
            <div class="breakdown-grid">
              <div class="breakdown-col gross-col">
                <span class="bd-title">Gross Base Pay</span>
                <span class="bd-amount">Rp {{ simResults.grossSalaryIdr | number }}</span>
                <span class="bd-sub">Pre-tax Indonesian compensation</span>
              </div>

              <div class="breakdown-col deduction-col">
                <span class="bd-title">Statutory Deductions</span>
                <div class="deduction-row">
                  <span>PPh 21 TER Tax:</span>
                  <strong>- Rp {{ simResults.taxPph21Idr | number }}</strong>
                </div>
                <div class="deduction-row">
                  <span>BPJS Kesehatan (1%):</span>
                  <strong>- Rp {{ simResults.bpjsKesehatanIdr | number }}</strong>
                </div>
                <div class="deduction-row">
                  <span>BPJS Ketenagakerjaan:</span>
                  <strong>- Rp {{ simResults.bpjsKetenagakerjaanIdr | number }}</strong>
                </div>
                <div class="deduction-total">
                  <span>Total Withholdings:</span>
                  <span class="text-rose">- Rp {{ simResults.totalDeductionsIdr | number }}</span>
                </div>
              </div>

              <div class="breakdown-col net-col">
                <span class="bd-title">Net Take-Home Pay</span>
                <span class="bd-amount highlight-emerald">Rp {{ simResults.netPayoutIdr | number }}</span>
                <span class="bd-sub">Transferred via Indonesian RTGS / BI-FAST</span>
              </div>

              <div class="breakdown-col invoice-col">
                <span class="bd-title">Client Invoice (USD)</span>
                <span class="bd-amount highlight-cyan">\${{ simResults.clientInvoiceUsd | number }}</span>
                <span class="bd-sub">160 hrs &#64; \${{ simBillingRateUsd }}/hr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Payroll Records Table -->
      <section class="payroll-records-section">
        <div class="section-top">
          <h2>Disbursed Payroll Slips (Period: 2026-09)</h2>
          <span class="meta-info">Bank transfers scheduled on the 25th via Quartz Automation</span>
        </div>

        <div class="table-card">
          <table class="payroll-table">
            <thead>
              <tr>
                <th>Slip ID</th>
                <th>Engineer Name</th>
                <th>Primary Role</th>
                <th>Gross (IDR)</th>
                <th>PPh 21 Tax</th>
                <th>BPJS Withholdings</th>
                <th>Net Payout (IDR)</th>
                <th>Client Invoice (USD)</th>
                <th>Status</th>
                <th>Payslip</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rec of records">
                <td class="code-font">{{ rec.payslipId }}</td>
                <td>
                  <strong>{{ rec.talentName }}</strong>
                </td>
                <td class="role-cell">{{ rec.role }}</td>
                <td>Rp {{ rec.grossSalaryIdr | number }}</td>
                <td class="text-rose">- Rp {{ rec.taxPph21Idr | number }}</td>
                <td class="text-rose">- Rp {{ (rec.bpjsKesehatanIdr + rec.bpjsKetenagakerjaanIdr) | number }}</td>
                <td class="highlight-emerald font-bold">Rp {{ rec.netPayoutIdr | number }}</td>
                <td class="highlight-cyan font-bold">\${{ rec.clientInvoiceUsd | number }}</td>
                <td>
                  <span
                    class="badge"
                    [ngClass]="{
                      'badge-emerald': rec.status === 'DISBURSED',
                      'badge-cyan': rec.status === 'APPROVED',
                      'badge-amber': rec.status === 'CALCULATED'
                    }"
                  >
                    {{ rec.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-slip" (click)="openPayslipModal(rec)">
                    <span class="material-icons" style="font-size: 14px;">description</span>
                    View Slip
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Payslip View Modal -->
      <div *ngIf="activeSlip" class="modal-backdrop" (click)="activeSlip = null">
        <div class="modal-payslip-card" (click)="$event.stopPropagation()">
          <header class="slip-header">
            <div class="brand-row">
              <span class="slip-logo">ETERNA</span>
              <span class="slip-badge">Official Indonesian Payslip</span>
            </div>
            <button class="btn-close" (click)="activeSlip = null">×</button>
          </header>

          <div class="slip-body">
            <div class="slip-info-grid">
              <div><span>Employee:</span> <strong>{{ activeSlip.talentName }}</strong></div>
              <div><span>Period:</span> <strong>September 2026</strong></div>
              <div><span>Role:</span> <strong>{{ activeSlip.role }}</strong></div>
              <div><span>Payslip Ref:</span> <strong>{{ activeSlip.payslipId }}</strong></div>
              <div><span>Currency:</span> <strong>IDR (Indonesian Rupiah)</strong></div>
              <div><span>Tax Bracket:</span> <strong>TER PPh 21 Category A</strong></div>
            </div>

            <hr class="slip-divider" />

            <div class="slip-lines">
              <div class="slip-line">
                <span>Basic Gross Salary</span>
                <span>Rp {{ activeSlip.grossSalaryIdr | number }}</span>
              </div>
              <div class="slip-line deduction">
                <span>Indonesian Income Tax (PPh 21 TER)</span>
                <span>- Rp {{ activeSlip.taxPph21Idr | number }}</span>
              </div>
              <div class="slip-line deduction">
                <span>BPJS Kesehatan (Employee 1%)</span>
                <span>- Rp {{ activeSlip.bpjsKesehatanIdr | number }}</span>
              </div>
              <div class="slip-line deduction">
                <span>BPJS Ketenagakerjaan (JHT 2% + JP 1%)</span>
                <span>- Rp {{ activeSlip.bpjsKetenagakerjaanIdr | number }}</span>
              </div>
            </div>

            <hr class="slip-divider" />

            <div class="slip-total-row">
              <span>Take Home Pay (Net Transfer)</span>
              <span class="total-amount">Rp {{ activeSlip.netPayoutIdr | number }}</span>
            </div>

            <div class="slip-footer-note">
              <p>Processed under Eterna Indonesian Legal Entity & Tax Compliance • Verified for Indonesian Tax Filing SPT Tahunan.</p>
            </div>
          </div>

          <footer class="slip-footer">
            <button class="btn-secondary" (click)="activeSlip = null">Close</button>
            <button class="btn-primary" (click)="printSlip()">
              <span class="material-icons" style="font-size: 16px;">print</span>
              Print / Save PDF
            </button>
          </footer>
        </div>
      </div>

      <!-- Batch Run Alert -->
      <div *ngIf="batchToast" class="toast-alert">
        <span class="material-icons text-emerald" style="font-size: 20px;">check_circle</span>
        <span>{{ batchToast }}</span>
      </div>
    </div>
  `,
  styles: [`
    .payroll-page {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .payroll-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      h1 { font-size: 1.85rem; font-weight: 800; }
      .subtitle { color: var(--text-secondary); font-size: 0.95rem; }
    }
    .tax-calculator-section {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-md);
    }
    .calc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.15rem;
        font-weight: 700;
      }
    }
    .calc-body {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .calc-controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }
    .control-group {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      label { font-size: 0.85rem; color: var(--text-secondary); }
    }
    .range-slider {
      width: 100%;
      accent-color: var(--accent-cyan);
      cursor: pointer;
    }
    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 540px) { grid-template-columns: 1fr; }
    }
    .breakdown-col {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .bd-title {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .bd-amount {
      font-size: 1.25rem;
      font-weight: 800;
      font-family: var(--font-mono);
    }
    .bd-sub {
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .deduction-col {
      gap: 4px;
    }
    .deduction-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-secondary);
      strong { color: var(--text-primary); }
    }
    .deduction-total {
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .text-rose { color: #F43F5E; }
    .highlight-emerald { color: #34D399; }
    .highlight-cyan { color: var(--accent-cyan-light); }
    .font-bold { font-weight: 700; }

    .payroll-records-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .section-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      h2 { font-size: 1.25rem; font-weight: 700; }
      .meta-info { font-size: 0.85rem; color: var(--text-muted); }
    }
    .table-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow-x: auto;
    }
    .payroll-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.85rem;
      th {
        background: var(--bg-card);
        padding: 12px 16px;
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        border-bottom: 1px solid var(--border-subtle);
      }
      td {
        padding: 14px 16px;
        border-bottom: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        vertical-align: middle;
      }
      tr:hover td {
        background: rgba(255, 255, 255, 0.02);
      }
    }
    .code-font {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent-cyan-light);
    }
    .role-cell {
      max-width: 200px;
    }
    .btn-slip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: var(--accent-cyan-light);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      &:hover {
        background: rgba(6, 182, 212, 0.2);
      }
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
    .modal-payslip-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 580px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }
    .slip-header {
      padding: 18px 24px;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .slip-logo {
      font-weight: 900;
      font-size: 1.25rem;
      letter-spacing: 0.08em;
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .slip-badge {
      font-size: 0.72rem;
      color: var(--text-muted);
      border-left: 1px solid var(--border-subtle);
      padding-left: 10px;
    }
    .btn-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
    }
    .slip-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .slip-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      font-size: 0.85rem;
      div {
        display: flex;
        justify-content: space-between;
        span { color: var(--text-muted); }
      }
    }
    .slip-divider {
      border: none;
      border-top: 1px solid var(--border-subtle);
    }
    .slip-lines {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .slip-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      &.deduction {
        color: #F43F5E;
      }
    }
    .slip-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1rem;
      font-weight: 700;
      .total-amount {
        font-size: 1.4rem;
        color: #34D399;
        font-family: var(--font-mono);
      }
    }
    .slip-footer-note {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-align: center;
      margin-top: 8px;
    }
    .slip-footer {
      padding: 16px 24px;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .toast-alert {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-card);
      border: 1px solid rgba(16, 185, 129, 0.4);
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
export class PayrollComponent implements OnInit {
  records: PayrollRecord[] = [];
  activeSlip: PayrollRecord | null = null;
  batchToast: string | null = null;

  simGrossSalary: number = 35000000;
  simBillingRateUsd: number = 45;
  simResults: any = {};

  private talents: Talent[] = [];

  constructor(
    private payrollService: PayrollService,
    private apiService: ApiService,
    private datadog: DatadogLoggerService
  ) {}

  ngOnInit() {
    this.datadog.info('Navigated to Payroll page');
    this.recalculateSimulator();
    this.payrollService.getPayrollRecords().subscribe(data => {
      this.records = data;
    });
    this.apiService.getTalents().subscribe(t => {
      this.talents = t;
    });
  }

  recalculateSimulator() {
    this.simResults = this.payrollService.computePayrollDetails(this.simGrossSalary, this.simBillingRateUsd);
  }

  triggerBatchPayroll() {
    this.datadog.info('Initiating batch payroll calculation', {
      period: '2026-09',
      talentCount: this.talents.length
    });
    this.payrollService.runBatchPayroll('2026-09', this.talents).subscribe({
      next: (updated) => {
        this.records = updated;
        this.batchToast = `Batch payroll executed for September 2026! Computed PPh 21 and generated ${this.talents.length} payslips.`;
        this.datadog.info('Batch payroll run completed successfully', {
          recordsGenerated: updated.length
        });
        setTimeout(() => {
          this.batchToast = null;
        }, 4000);
      },
      error: (err) => {
        this.datadog.error('Failed executing batch payroll', err);
      }
    });
  }

  openPayslipModal(rec: PayrollRecord) {
    this.datadog.info('Viewing payslip modal', { recordId: rec.id, talent: rec.talentName });
    this.activeSlip = rec;
  }

  printSlip() {
    this.datadog.info('Printing payslip', { recordId: this.activeSlip?.id });
    window.print();
  }
}
