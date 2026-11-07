import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PayrollRecord, Placement, Talent } from '../models/talent.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private readonly DEFAULT_USD_IDR_RATE = 15850;

  private mockPayrollRecords: PayrollRecord[] = [
    {
      id: 1,
      talentId: 1,
      talentName: 'Arya Wibowo',
      role: 'Lead Java & Angular Fullstack Architect',
      periodMonth: '2026-09',
      grossSalaryIdr: 42000000,
      taxPph21Idr: 6300000, // 15% bracket
      bpjsKesehatanIdr: 120000, // capped at 12M
      bpjsKetenagakerjaanIdr: 940423, // 2% JHT + 1% JP
      totalDeductionsIdr: 7360423,
      netPayoutIdr: 34639577,
      clientInvoiceUsd: 8800,
      exchangeRateUsdIdr: 15850,
      status: 'APPROVED',
      payslipId: 'ETR-PAY-202609-001'
    },
    {
      id: 2,
      talentId: 2,
      talentName: 'Dewi Anggraini',
      role: 'Senior Frontend & Ionic Mobile Specialist',
      periodMonth: '2026-09',
      grossSalaryIdr: 32000000,
      taxPph21Idr: 3840000, // 12% bracket
      bpjsKesehatanIdr: 120000,
      bpjsKetenagakerjaanIdr: 740423,
      totalDeductionsIdr: 4700423,
      netPayoutIdr: 27299577,
      clientInvoiceUsd: 7200,
      exchangeRateUsdIdr: 15850,
      status: 'APPROVED',
      payslipId: 'ETR-PAY-202609-002'
    }
  ];

  /**
   * Indonesian TER (Tarif Efektif Rata-rata) monthly withholding calculator
   */
  calculatePph21(grossIdr: number): number {
    if (grossIdr <= 5400000) return 0;
    if (grossIdr <= 5650000) return Math.round(grossIdr * 0.0025);
    if (grossIdr <= 5950000) return Math.round(grossIdr * 0.005);
    if (grossIdr <= 6300000) return Math.round(grossIdr * 0.0075);
    if (grossIdr <= 6750000) return Math.round(grossIdr * 0.01);
    if (grossIdr <= 7500000) return Math.round(grossIdr * 0.015);
    if (grossIdr <= 8550000) return Math.round(grossIdr * 0.02);
    if (grossIdr <= 9650000) return Math.round(grossIdr * 0.03);
    if (grossIdr <= 10050000) return Math.round(grossIdr * 0.04);
    if (grossIdr <= 12200000) return Math.round(grossIdr * 0.05);
    if (grossIdr <= 14000000) return Math.round(grossIdr * 0.06);
    if (grossIdr <= 16000000) return Math.round(grossIdr * 0.07);
    if (grossIdr <= 19000000) return Math.round(grossIdr * 0.08);
    if (grossIdr <= 23000000) return Math.round(grossIdr * 0.09);
    if (grossIdr <= 28000000) return Math.round(grossIdr * 0.10);
    if (grossIdr <= 34000000) return Math.round(grossIdr * 0.12);
    if (grossIdr <= 40000000) return Math.round(grossIdr * 0.15);
    if (grossIdr <= 50000000) return Math.round(grossIdr * 0.17);
    return Math.round(grossIdr * 0.20);
  }

  calculateBpjsHealth(grossIdr: number): number {
    const cap = 12000000;
    const basis = Math.min(grossIdr, cap);
    return Math.round(basis * 0.01);
  }

  calculateBpjsLabor(grossIdr: number): number {
    const jht = grossIdr * 0.02;
    const jpCap = 10042300;
    const jpBasis = Math.min(grossIdr, jpCap);
    const jp = jpBasis * 0.01;
    return Math.round(jht + jp);
  }

  computePayrollDetails(grossIdr: number, hourlyBillingUsd: number = 45): {
    grossSalaryIdr: number;
    taxPph21Idr: number;
    bpjsKesehatanIdr: number;
    bpjsKetenagakerjaanIdr: number;
    totalDeductionsIdr: number;
    netPayoutIdr: number;
    clientInvoiceUsd: number;
    clientInvoiceIdr: number;
    eternaMarginIdr: number;
  } {
    const taxPph21Idr = this.calculatePph21(grossIdr);
    const bpjsKesehatanIdr = this.calculateBpjsHealth(grossIdr);
    const bpjsKetenagakerjaanIdr = this.calculateBpjsLabor(grossIdr);
    const totalDeductionsIdr = taxPph21Idr + bpjsKesehatanIdr + bpjsKetenagakerjaanIdr;
    const netPayoutIdr = grossIdr - totalDeductionsIdr;

    const standardHours = 160;
    const clientInvoiceUsd = hourlyBillingUsd * standardHours;
    const clientInvoiceIdr = clientInvoiceUsd * this.DEFAULT_USD_IDR_RATE;
    const eternaMarginIdr = clientInvoiceIdr - grossIdr;

    return {
      grossSalaryIdr: grossIdr,
      taxPph21Idr,
      bpjsKesehatanIdr,
      bpjsKetenagakerjaanIdr,
      totalDeductionsIdr,
      netPayoutIdr,
      clientInvoiceUsd,
      clientInvoiceIdr,
      eternaMarginIdr
    };
  }

  getPayrollRecords(): Observable<PayrollRecord[]> {
    return of(this.mockPayrollRecords);
  }

  disbursePayroll(id: number): Observable<PayrollRecord> {
    const rec = this.mockPayrollRecords.find(r => r.id === id);
    if (rec) {
      rec.status = 'DISBURSED';
    }
    return of(rec!);
  }

  runBatchPayroll(periodMonth: string, talents: Talent[]): Observable<PayrollRecord[]> {
    // Process placed talents
    const newRecords: PayrollRecord[] = talents.map((t, idx) => {
      const details = this.computePayrollDetails(t.monthlyRateIdr, t.hourlyRateUsd);
      return {
        id: Date.now() + idx,
        talentId: t.id,
        talentName: t.fullName,
        role: t.primaryRole,
        periodMonth: periodMonth,
        grossSalaryIdr: details.grossSalaryIdr,
        taxPph21Idr: details.taxPph21Idr,
        bpjsKesehatanIdr: details.bpjsKesehatanIdr,
        bpjsKetenagakerjaanIdr: details.bpjsKetenagakerjaanIdr,
        totalDeductionsIdr: details.totalDeductionsIdr,
        netPayoutIdr: details.netPayoutIdr,
        clientInvoiceUsd: details.clientInvoiceUsd,
        exchangeRateUsdIdr: this.DEFAULT_USD_IDR_RATE,
        status: 'CALCULATED',
        payslipId: `ETR-PAY-${periodMonth.replace('-', '')}-00${idx + 1}`
      };
    });

    this.mockPayrollRecords = [...newRecords, ...this.mockPayrollRecords];
    return of(this.mockPayrollRecords);
  }
}
