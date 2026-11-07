import { TestBed } from '@angular/core/testing';
import { PayrollService } from './payroll.service';

describe('PayrollService', () => {
  let service: PayrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate 0 tax for monthly gross salary under PTKP 5.4M IDR', () => {
    const tax = service.calculatePph21(5000000);
    expect(tax).toBe(0);
  });

  it('should calculate 12% TER PPh 21 tax for 32M IDR salary bracket', () => {
    const tax = service.calculatePph21(32000000);
    // 32,000,000 * 12% = 3,840,000 IDR
    expect(tax).toBe(3840000);
  });

  it('should cap BPJS Kesehatan employee contribution at 12M IDR base', () => {
    const bpjsHigh = service.calculateBpjsHealth(45000000);
    expect(bpjsHigh).toBe(120000);
  });

  it('should compute complete payroll details and client invoicing', () => {
    const result = service.computePayrollDetails(35000000, 45);
    expect(result.grossSalaryIdr).toBe(35000000);
    expect(result.taxPph21Idr).toBe(5250000); // 15%
    expect(result.bpjsKesehatanIdr).toBe(120000);
    expect(result.netPayoutIdr).toBeLessThan(35000000);
    expect(result.clientInvoiceUsd).toBe(7200); // 45 * 160
    expect(result.eternaMarginIdr).toBeGreaterThan(0);
  });
});
