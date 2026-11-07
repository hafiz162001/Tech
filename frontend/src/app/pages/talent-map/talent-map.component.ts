import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Talent, ClientCompany } from '../../core/models/talent.model';

@Component({
  selector: 'app-talent-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="talent-map-page">
      <div class="map-header">
        <div>
          <div class="badge badge-indigo mb-2">
            <span class="material-icons" style="font-size: 14px;">map</span>
            Google Maps & Timezone Integration
          </div>
          <h1>Global Distributed Teams & Talent Corridors</h1>
          <p class="map-subtitle">
            Visualize Indonesian engineering clusters connected to global client teams in San Francisco, London, Singapore, and Sydney.
          </p>
        </div>

        <div class="live-clock-card">
          <span class="clock-label">Indonesia Core Time (WIB)</span>
          <span class="clock-time">{{ wibTime }}</span>
          <span class="clock-sub">Jakarta • Bandung • Yogyakarta (UTC+7)</span>
        </div>
      </div>

      <!-- Main Interactive Visualizer -->
      <div class="map-container-card">
        <div class="world-canvas">
          <!-- Animated Connection Arcs (SVG) -->
          <svg class="connection-svg" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#3B82F6" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.8" />
              </linearGradient>
            </defs>

            <!-- Jakarta/Bandung to San Francisco -->
            <path d="M 720 280 Q 500 80 180 180" class="flight-path" />
            <!-- Jakarta/Bandung to London -->
            <path d="M 720 280 Q 580 120 480 140" class="flight-path" />
            <!-- Jakarta/Bandung to Singapore -->
            <path d="M 720 280 Q 720 270 710 260" class="flight-path active-flight" />
            <!-- Jakarta/Bandung to Sydney -->
            <path d="M 720 280 Q 790 350 860 380" class="flight-path" />
          </svg>

          <!-- Client Hub Markers -->
          <div
            class="map-marker client-marker sf-marker"
            [class.active]="selectedClient?.name === 'OmniStream Global'"
            (click)="selectClientByName('OmniStream Global')"
          >
            <div class="pulse-ring"></div>
            <span class="marker-dot"></span>
            <div class="marker-card">
              <span class="marker-city">San Francisco</span>
              <span class="marker-tz">PST (UTC-8) • {{ pstTime }}</span>
            </div>
          </div>

          <div
            class="map-marker client-marker london-marker"
            [class.active]="selectedClient?.name === 'Veloce Health UK'"
            (click)="selectClientByName('Veloce Health UK')"
          >
            <div class="pulse-ring"></div>
            <span class="marker-dot"></span>
            <div class="marker-card">
              <span class="marker-city">London</span>
              <span class="marker-tz">GMT (UTC+0) • {{ gmtTime }}</span>
            </div>
          </div>

          <div
            class="map-marker client-marker sg-marker"
            [class.active]="selectedClient?.name === 'NexaScale Asia'"
            (click)="selectClientByName('NexaScale Asia')"
          >
            <div class="pulse-ring"></div>
            <span class="marker-dot"></span>
            <div class="marker-card">
              <span class="marker-city">Singapore</span>
              <span class="marker-tz">SGT (UTC+8) • {{ sgtTime }}</span>
            </div>
          </div>

          <div
            class="map-marker client-marker sydney-marker"
            [class.active]="selectedClient?.name === 'Southern Cross Digital'"
            (click)="selectClientByName('Southern Cross Digital')"
          >
            <div class="pulse-ring"></div>
            <span class="marker-dot"></span>
            <div class="marker-card">
              <span class="marker-city">Sydney</span>
              <span class="marker-tz">AEST (UTC+10) • {{ aestTime }}</span>
            </div>
          </div>

          <!-- Indonesian Engineering Hubs -->
          <div class="indonesia-cluster">
            <div class="hub-item jkt-hub" (click)="filterCity('Jakarta')">
              <span class="hub-pulse"></span>
              <span class="hub-label">Jakarta (12 Eng)</span>
            </div>
            <div class="hub-item bdg-hub" (click)="filterCity('Bandung')">
              <span class="hub-pulse"></span>
              <span class="hub-label">Bandung (18 Eng)</span>
            </div>
            <div class="hub-item ygy-hub" (click)="filterCity('Yogyakarta')">
              <span class="hub-pulse"></span>
              <span class="hub-label">Yogyakarta (10 Eng)</span>
            </div>
            <div class="hub-item sby-hub" (click)="filterCity('Surabaya')">
              <span class="hub-pulse"></span>
              <span class="hub-label">Surabaya (8 Eng)</span>
            </div>
            <div class="hub-item dps-hub" (click)="filterCity('Denpasar')">
              <span class="hub-pulse"></span>
              <span class="hub-label">Bali (14 Eng)</span>
            </div>
          </div>
        </div>

        <!-- Overlap Calculator Drawer -->
        <div class="overlap-panel">
          <div class="panel-header">
            <h3>Live Timezone Overlap Matrix</h3>
            <span class="badge badge-cyan">Realtime Sync Calculator</span>
          </div>

          <div class="client-tabs">
            <button
              *ngFor="let client of clients"
              class="client-tab-btn"
              [class.active]="selectedClient?.id === client.id"
              (click)="selectedClient = client"
            >
              {{ client.city }} ({{ client.timezone }})
            </button>
          </div>

          <div *ngIf="selectedClient" class="overlap-details">
            <div class="overlap-score-banner">
              <div class="score-pill">
                <span class="score-val">{{ getOverlapHours(selectedClient) }} Hours</span>
                <span class="score-lbl">Daily Working Overlap</span>
              </div>
              <div class="score-desc">
                <p><strong>{{ selectedClient.name }}</strong> ({{ selectedClient.industry }})</p>
                <span class="text-muted">Overlapping hours enable live daily standups, pull request reviews, and synchronized sprint planning.</span>
              </div>
            </div>

            <!-- Hour-by-hour timeline visualizer -->
            <div class="timeline-visualizer">
              <div class="tz-timeline-row">
                <span class="row-label">Client ({{ selectedClient.city }}):</span>
                <div class="hours-bar">
                  <span
                    *ngFor="let h of hoursRange; let i = index"
                    class="hour-block"
                    [class.work-hour]="isClientWorkingHour(i, selectedClient)"
                  >
                    {{ i }}:00
                  </span>
                </div>
              </div>

              <div class="tz-timeline-row">
                <span class="row-label">Eterna (Indonesia WIB):</span>
                <div class="hours-bar">
                  <span
                    *ngFor="let h of hoursRange; let i = index"
                    class="hour-block"
                    [class.overlap-hour]="isOverlapHour(i, selectedClient)"
                  >
                    {{ (i + 7) % 24 }}:00
                  </span>
                </div>
              </div>
            </div>

            <div class="legend-row">
              <span class="legend-item"><span class="legend-box overlap"></span> Working Overlap Window</span>
              <span class="legend-item"><span class="legend-box client"></span> Client Standup / Office Hours</span>
              <span class="legend-item"><span class="legend-box off"></span> Deep Work / Async Handoff</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .talent-map-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .map-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      h1 {
        font-size: 1.85rem;
        font-weight: 800;
      }
    }
    .map-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    .live-clock-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px 20px;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-sm);
      .clock-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
      }
      .clock-time {
        font-size: 1.5rem;
        font-weight: 800;
        font-family: var(--font-mono);
        color: var(--accent-cyan-light);
      }
      .clock-sub {
        font-size: 0.75rem;
        color: var(--text-muted);
      }
    }
    .map-container-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-md);
    }
    .world-canvas {
      position: relative;
      height: 440px;
      background: radial-gradient(circle at 70% 60%, rgba(6, 182, 212, 0.08) 0%, transparent 60%),
                  radial-gradient(circle at 20% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
                  #070D1C;
      overflow: hidden;
      border-bottom: 1px solid var(--border-subtle);
    }
    .connection-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .flight-path {
      fill: none;
      stroke: rgba(6, 182, 212, 0.35);
      stroke-width: 2;
      stroke-dasharray: 6 6;
      animation: dashMove 30s linear infinite;
    }
    .active-flight {
      stroke: url(#arcGradient);
      stroke-width: 3;
      filter: drop-shadow(0 0 6px rgba(6, 182, 212, 0.5));
    }
    @keyframes dashMove {
      to { stroke-dashoffset: -200; }
    }
    .map-marker {
      position: absolute;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.2s ease;
      z-index: 10;
      &:hover, &.active {
        transform: scale(1.1);
        z-index: 20;
        .marker-card {
          border-color: var(--accent-cyan);
          background: rgba(15, 23, 42, 0.95);
        }
      }
    }
    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 12px var(--accent-cyan);
    }
    .pulse-ring {
      position: absolute;
      top: 0;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--accent-cyan);
      animation: pulse 2s infinite ease-out;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(3.5); opacity: 0; }
    }
    .marker-card {
      margin-top: 6px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 4px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      backdrop-filter: blur(4px);
    }
    .marker-city {
      font-size: 0.8rem;
      font-weight: 700;
    }
    .marker-tz {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .sf-marker { top: 32%; left: 16%; }
    .london-marker { top: 24%; left: 46%; }
    .sg-marker { top: 52%; left: 69%; }
    .sydney-marker { top: 72%; left: 84%; }

    .indonesia-cluster {
      position: absolute;
      top: 55%;
      left: 68%;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .hub-item {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 3px 8px;
      border-radius: 4px;
      transition: all 0.2s;
      &:hover {
        background: rgba(16, 185, 129, 0.3);
        transform: scale(1.05);
      }
    }
    .hub-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 6px #10B981;
    }
    .hub-label {
      font-size: 0.72rem;
      font-weight: 600;
      color: #34D399;
    }

    .overlap-panel {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      background: var(--bg-card);
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 { font-size: 1.1rem; font-weight: 700; }
    }
    .client-tabs {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .client-tab-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      padding: 7px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      cursor: pointer;
      font-family: var(--font-main);
      transition: all 0.2s ease;
      &:hover { background: rgba(255, 255, 255, 0.08); color: var(--text-primary); }
      &.active {
        background: rgba(6, 182, 212, 0.15);
        color: var(--accent-cyan-light);
        border-color: var(--accent-cyan);
        font-weight: 600;
      }
    }
    .overlap-score-banner {
      display: flex;
      align-items: center;
      gap: 20px;
      background: rgba(6, 182, 212, 0.06);
      border: 1px solid rgba(6, 182, 212, 0.25);
      border-radius: var(--radius-md);
      padding: 16px 20px;
    }
    .score-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 10px 18px;
      min-width: 140px;
    }
    .score-val {
      font-size: 1.4rem;
      font-weight: 800;
      color: #34D399;
    }
    .score-lbl {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .score-desc {
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .timeline-visualizer {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px;
      overflow-x: auto;
    }
    .tz-timeline-row {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 780px;
    }
    .row-label {
      font-size: 0.8rem;
      font-weight: 600;
      width: 180px;
      color: var(--text-secondary);
    }
    .hours-bar {
      display: flex;
      gap: 3px;
      flex: 1;
    }
    .hour-block {
      flex: 1;
      text-align: center;
      padding: 6px 2px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 4px;
      font-size: 0.72rem;
      color: var(--text-muted);
      font-family: var(--font-mono);
      &.work-hour {
        background: rgba(59, 130, 246, 0.2);
        color: #93C5FD;
        border: 1px solid rgba(59, 130, 246, 0.4);
      }
      &.overlap-hour {
        background: rgba(16, 185, 129, 0.25);
        color: #34D399;
        font-weight: 700;
        border: 1px solid rgba(16, 185, 129, 0.5);
      }
    }
    .legend-row {
      display: flex;
      gap: 20px;
      font-size: 0.78rem;
      color: var(--text-secondary);
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .legend-box {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      &.overlap { background: rgba(16, 185, 129, 0.5); }
      &.client { background: rgba(59, 130, 246, 0.4); }
      &.off { background: rgba(255, 255, 255, 0.08); }
    }
  `]
})
export class TalentMapComponent implements OnInit {
  clients: ClientCompany[] = [];
  selectedClient: ClientCompany | null = null;

  wibTime: string = '';
  pstTime: string = '';
  gmtTime: string = '';
  sgtTime: string = '';
  aestTime: string = '';

  hoursRange = Array.from({ length: 24 }, (_, i) => i);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getClients().subscribe(clients => {
      this.clients = clients;
      if (clients.length > 0) {
        this.selectedClient = clients[0];
      }
    });

    this.updateClocks();
    setInterval(() => this.updateClocks(), 1000);
  }

  updateClocks() {
    const now = new Date();
    const fmt = (offset: number) => {
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const target = new Date(utc + (3600000 * offset));
      return target.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    this.wibTime = fmt(7);
    this.pstTime = fmt(-8);
    this.gmtTime = fmt(0);
    this.sgtTime = fmt(8);
    this.aestTime = fmt(10);
  }

  selectClientByName(name: string) {
    const c = this.clients.find(item => item.name === name);
    if (c) {
      this.selectedClient = c;
    }
  }

  filterCity(city: string) {
    // Interactive filter for talent
  }

  getOverlapHours(client: ClientCompany): number {
    switch (client.timezone) {
      case 'PST (UTC-8)': return 4;
      case 'GMT (UTC+0)': return 5;
      case 'SGT (UTC+8)': return 8;
      case 'AEST (UTC+10)': return 7;
      default: return 5;
    }
  }

  isClientWorkingHour(hour: number, client: ClientCompany): boolean {
    return hour >= 9 && hour <= 17;
  }

  isOverlapHour(hour: number, client: ClientCompany): boolean {
    // Indonesian working hour: 09:00 - 18:00 WIB
    const wibHour = (hour + 7) % 24;
    const isWibWork = (wibHour >= 9 && wibHour <= 18) || (wibHour >= 18 && wibHour <= 22); // Night shift overlap for US clients
    const isClientWork = hour >= 9 && hour <= 18;
    return isWibWork && isClientWork;
  }
}
