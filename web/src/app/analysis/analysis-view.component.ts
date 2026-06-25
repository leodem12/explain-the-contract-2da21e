import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  DOCUMENT,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AnalysisDto,
  ContractApiService,
  ContractDto,
} from '../contracts/contract-api.service';
import { NotesPanelComponent } from '../notes/notes-panel.component';

interface Section {
  key: string;
  title: string;
  items: string[];
  panelClass: string;
}

@Component({
  selector: 'app-analysis-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NotesPanelComponent,
  ],
  styles: [`
    .breadcrumb { font-size: 14px; color: var(--mat-sys-neutral); margin-bottom: 16px; }
    .breadcrumb a { color: var(--mat-sys-primary); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .status-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .analysis-wrapper { display: flex; gap: 24px; align-items: flex-start; }
    .analysis-main { flex: 3; min-width: 0; }
    .notes-sidebar { flex: 1; min-width: 240px; }
    @media (max-width: 959px) {
      .analysis-wrapper { flex-direction: column; }
      .notes-sidebar { width: 100%; }
    }
    .info-card { border-left: 4px solid var(--mat-sys-primary); padding: 16px; margin-bottom: 24px; }
    .error-card { border-left: 4px solid var(--mat-sys-error); }
    mat-expansion-panel { margin-bottom: 8px; }
    .analysis-section--red-flags { border-left: 4px solid #C87533; padding-left: 16px; }
    .analysis-content p { margin: 0 0 8px; }
    .chip-analysed { background: var(--mat-sys-tertiary-container) !important; }
    .chip-failed { background: var(--mat-sys-error-container) !important; }
    .chip-extracted { background: transparent !important; border: 1px solid var(--mat-sys-outline) !important; }
    .export-row { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
  `],
  template: `
    @if (loading()) {
      <mat-progress-bar mode="indeterminate" aria-label="Loading contract…" />
    }

    @if (loadError()) {
      <mat-card class="error-card">
        <mat-card-content style="display:flex;align-items:center;gap:8px;">
          <mat-icon color="warn">error</mat-icon>
          <span>Could not load the contract. Please try again.</span>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-button (click)="load()">Try again</button>
        </mat-card-actions>
      </mat-card>
    }

    @if (contract(); as c) {
      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a routerLink="/contracts">My Contracts</a>
        &nbsp;/&nbsp;{{ c.fileName }}
      </nav>

      <!-- Status chip -->
      <div class="status-row">
        <mat-chip-set>
          <mat-chip [class]="statusChipClass()" [attr.aria-label]="'Status: ' + c.status">
            {{ c.status }}
          </mat-chip>
        </mat-chip-set>
      </div>

      <!-- Awaiting analysis -->
      @if (c.status === 'Extracted') {
        <mat-card class="info-card" style="margin-bottom:24px;">
          <mat-card-content>
            Text extracted and ready. Click Analyse to generate the breakdown.
          </mat-card-content>
          <mat-card-actions align="end">
            <button
              mat-raised-button
              color="primary"
              [disabled]="analysing()"
              (click)="analyse()"
            >
              @if (analysing()) {
                <mat-spinner diameter="18" style="display:inline-block;margin-right:6px;" />
                Analysing…
              } @else {
                Analyse
              }
            </button>
          </mat-card-actions>
        </mat-card>
      }

      <!-- Analysis failed -->
      @if (c.status === 'AnalysisFailed') {
        <mat-card class="error-card" style="margin-bottom:24px;">
          <mat-card-content style="display:flex;align-items:center;gap:8px;">
            <mat-icon color="warn">warning</mat-icon>
            <span>Analysis could not be completed. Your contract is saved.</span>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-raised-button [disabled]="analysing()" (click)="analyse()">
              @if (analysing()) {
                <mat-spinner diameter="18" style="display:inline-block;margin-right:6px;" />
                Retrying…
              } @else {
                Retry Analysis
              }
            </button>
          </mat-card-actions>
        </mat-card>
      }

      <!-- Compare version button (available when contract is loaded) -->
      @if (contract()) {
        <div style="margin-bottom: 16px;">
          <button mat-stroked-button [routerLink]="['/contracts', contractId(), 'compare']">
            <mat-icon>compare_arrows</mat-icon>
            Compare with newer version
          </button>
        </div>
      }

      <!-- Two-column: analysis sections (flex 3) + notes sidebar (flex 1) -->
      <div class="analysis-wrapper">
        <!-- Main: five-section analysis -->
        <div class="analysis-main">
          @if (analysis(); as a) {
            <mat-accordion [multi]="true">
              @for (section of sections(); track section.key) {
                <mat-expansion-panel [expanded]="true">
                  <mat-expansion-panel-header>
                    <mat-panel-title>{{ section.title }}</mat-panel-title>
                  </mat-expansion-panel-header>
                  <div
                    class="analysis-content"
                    [class]="section.panelClass"
                    [attr.aria-labelledby]="section.key + '-heading'"
                  >
                    <section [id]="section.key" [attr.aria-labelledby]="section.key + '-heading'">
                      @for (item of section.items; track item) {
                        <p>{{ item }}</p>
                      }
                    </section>
                  </div>
                </mat-expansion-panel>
              }
            </mat-accordion>

            <!-- Export row -->
            <div class="export-row">
              <button
                mat-stroked-button
                [disabled]="exportingPdf()"
                (click)="exportAs('pdf')"
                aria-label="Export PDF"
              >
                @if (exportingPdf()) {
                  <mat-spinner diameter="18" style="display:inline-block;margin-right:6px;" />
                } @else {
                  <mat-icon>download</mat-icon>
                }
                Export PDF
              </button>
              <button
                mat-stroked-button
                [disabled]="exportingMd()"
                (click)="exportAs('markdown')"
                aria-label="Export Markdown"
              >
                @if (exportingMd()) {
                  <mat-spinner diameter="18" style="display:inline-block;margin-right:6px;" />
                } @else {
                  <mat-icon>download</mat-icon>
                }
                Export Markdown
              </button>
            </div>
          }
        </div>

        <!-- Sidebar: notes panel -->
        <div class="notes-sidebar">
          <app-notes-panel [contractId]="contractId()" />
        </div>
      </div>
    }
  `,
})
export class AnalysisViewComponent implements OnInit {
  private readonly api = inject(ContractApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  private readonly doc = inject(DOCUMENT);

  readonly loading = signal(false);
  readonly loadError = signal(false);
  readonly analysing = signal(false);
  readonly exportingPdf = signal(false);
  readonly exportingMd = signal(false);
  readonly contract = signal<ContractDto | null>(null);
  readonly analysis = signal<AnalysisDto | null>(null);

  readonly contractId = computed(() => this.route.snapshot.params['id'] as string);

  readonly statusChipClass = computed(() => {
    const s = this.contract()?.status;
    if (s === 'Analysed') return 'chip-analysed';
    if (s === 'AnalysisFailed') return 'chip-failed';
    return 'chip-extracted';
  });

  readonly sections = computed((): Section[] => {
    const a = this.analysis();
    if (!a) return [];
    return [
      { key: 'summary',      title: 'Summary',                          items: a.summary,         panelClass: '' },
      { key: 'obligations',  title: 'Key Obligations',                   items: a.keyObligations,  panelClass: '' },
      { key: 'risks',        title: 'Risks',                             items: a.risks,           panelClass: '' },
      { key: 'redFlags',     title: 'Red Flags',                         items: a.redFlags,        panelClass: 'analysis-section--red-flags' },
      { key: 'questions',    title: 'Questions to Ask Before Signing',    items: a.questions,       panelClass: '' },
    ];
  });

  ngOnInit() {
    this.load();
  }

  async load() {
    this.loading.set(true);
    this.loadError.set(false);
    try {
      const detail = await firstValueFrom(this.api.getDetail(this.contractId()));
      this.contract.set(detail.contract);
      this.analysis.set(detail.analysis);
    } catch {
      this.loadError.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async analyse() {
    this.analysing.set(true);
    try {
      // Pass the stored contract language so the explicit language choice flows through.
      const lang = this.contract()?.language || undefined;
      const result = await firstValueFrom(
        this.api.analyzeContract(this.contractId(), lang)
      );
      this.analysis.set(result);
      this.contract.update(c => c ? { ...c, status: 'Analysed' } : c);
    } catch (err) {
      // On 503 the LLM was unavailable — clear any stale analysis, mark failed,
      // and show a message that lets the user retry without re-uploading.
      const is503 = err instanceof HttpErrorResponse && err.status === 503;
      if (is503) {
        this.analysis.set(null);
      }
      this.contract.update(c => c ? { ...c, status: 'AnalysisFailed' } : c);
      const msg = is503
        ? 'Analysis failed: AI service unavailable. Your contract is saved — use Retry Analysis below.'
        : 'Analysis failed. You can retry from this screen.';
      this.snackBar.open(msg, 'Dismiss', {
        duration: 4000,
        panelClass: ['snack-error'],
      });
    } finally {
      this.analysing.set(false);
    }
  }

  async exportAs(format: 'pdf' | 'markdown') {
    const busy = format === 'pdf' ? this.exportingPdf : this.exportingMd;
    busy.set(true);
    try {
      const resp = await firstValueFrom(
        this.api.exportAnalysis(this.contractId(), format)
      );
      const blob = resp.body!;
      const fileName = this.contract()?.fileName ?? 'analysis';
      const baseName = fileName.replace(/\.pdf$/i, '');
      const downloadName = format === 'pdf' ? `${baseName}.pdf` : `${baseName}.md`;

      // Trigger browser download via a temporary <a> element.
      const url = URL.createObjectURL(blob);
      const a = this.doc.createElement('a');
      a.href = url;
      a.download = downloadName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      this.snackBar.open('Export failed. Please try again.', 'Dismiss', {
        duration: 4000,
        panelClass: ['snack-error'],
      });
    } finally {
      busy.set(false);
    }
  }
}
