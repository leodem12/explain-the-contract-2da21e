import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ContractApiService } from '../contracts/contract-api.service';

type CompareStatus = 'idle' | 'file-selected' | 'comparing' | 'results' | 'error';

const LANGUAGES = [
  { value: '',   label: 'Auto-detect (match contract language)' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'pl', label: 'Polish' },
];

@Component({
  selector: 'app-compare',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink, FormsModule,
    MatButtonModule, MatCardModule, MatChipsModule,
    MatFormFieldModule, MatIconModule, MatListModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule,
  ],
  styles: [`
    :host { display: block; }
    .page { max-width: 700px; margin: 0 auto; padding: 0 24px; }
    .back-link {
      display: inline-flex; align-items: center; gap: 4px;
      color: var(--mat-sys-primary); text-decoration: none;
      font-size: 14px; margin-bottom: 24px;
    }
    .back-link:hover { text-decoration: underline; }
    h2 { font-size: 32px; font-weight: 600; margin: 0 0 24px; }
    .ref-chip-row { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
    .ref-chip {
      display: inline-flex; align-items: center; gap: 6px;
      border: 1px solid var(--mat-sys-outline); border-radius: 16px;
      padding: 4px 12px; font-size: 14px; color: var(--mat-sys-on-surface);
      background: transparent;
    }
    .drop-zone {
      border: 2px dashed var(--mat-sys-outline);
      border-radius: var(--mat-sys-shape-medium);
      min-height: 120px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; cursor: pointer; padding: 16px;
      background: var(--mat-sys-surface-container);
      transition: border-color 0.15s;
    }
    .drop-zone:hover, .drop-zone.drag-over { border-color: var(--mat-sys-primary); }
    .drop-zone mat-icon { font-size: 36px; width: 36px; height: 36px; color: var(--mat-sys-neutral, #64748B); }
    .drop-zone-label { font-size: 14px; color: var(--mat-sys-on-surface); text-align: center; }
    .file-chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container);
      border-radius: 16px; padding: 4px 12px; font-size: 14px; margin-top: 10px;
    }
    .file-chip button { background: none; border: none; cursor: pointer; padding: 0; line-height: 1; }
    .controls { margin-top: 24px; display: flex; flex-direction: column; gap: 16px; }
    .status-row { display: flex; align-items: center; gap: 8px; font-size: 14px; margin-top: 8px; }
    .results-card { margin-top: 24px; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px; }
    .error-card { border-left: 4px solid var(--mat-sys-error); margin-top: 24px; }
    .diff-icon-added  { color: var(--mat-sys-tertiary);  margin-right: 8px; }
    .diff-icon-neutral { color: var(--mat-sys-on-surface); opacity: 0.6; margin-right: 8px; }
    input[type=file] { display: none; }
  `],
  template: `
    <div class="page">
      <a class="back-link" [routerLink]="['/contracts', contractId()]">
        <mat-icon style="font-size:18px;width:18px;height:18px;">arrow_back</mat-icon>
        Contract Analysis
      </a>

      <h2>Compare Versions</h2>

      <!-- Reference contract chip -->
      @if (originalFileName()) {
        <div class="ref-chip-row">
          <span>Original version:</span>
          <span class="ref-chip">
            <mat-icon style="font-size:16px;width:16px;height:16px;">description</mat-icon>
            {{ originalFileName() }}
          </span>
        </div>
      }

      <!-- New version drop zone -->
      <div
        class="drop-zone"
        [class.drag-over]="dragOver()"
        role="region"
        aria-label="Contract upload area"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragOver.set(false)"
        (drop)="onDrop($event)"
        [attr.aria-describedby]="'compare-instructions'">
        <mat-icon aria-hidden="true">upload_file</mat-icon>
        <span class="drop-zone-label" id="compare-instructions">
          @if (selectedFile()) {
            PDF ready — {{ selectedFile()!.name }}
          } @else {
            Drop the newer PDF version here or click to browse
          }
        </span>
      </div>
      <input #fileInput type="file" accept="application/pdf,.pdf"
        (change)="onFileSelected($event)" aria-label="Select newer PDF version">

      <!-- Selected file chip -->
      @if (selectedFile()) {
        <div>
          <span class="file-chip">
            <mat-icon style="font-size:16px;width:16px;height:16px;">picture_as_pdf</mat-icon>
            {{ selectedFile()!.name }}
            <button (click)="clearFile()" aria-label="Clear selected file" type="button">
              <mat-icon style="font-size:16px;width:16px;height:16px;">close</mat-icon>
            </button>
          </span>
        </div>
      }

      <!-- Progress bar while comparing -->
      @if (status() === 'comparing') {
        <mat-progress-bar mode="indeterminate" aria-label="Comparing versions…" style="margin-top:16px;" />
        <div class="status-row">
          <mat-spinner diameter="16" />
          <span>Comparing versions…</span>
        </div>
      }

      <div class="controls">
        <!-- Language selector -->
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Language (optional)</mat-label>
          <mat-select [(ngModel)]="language">
            @for (lang of LANGUAGES; track lang.value) {
              <mat-option [value]="lang.value">{{ lang.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <!-- Compare button -->
        <button
          mat-raised-button
          color="primary"
          style="width:100%;"
          [disabled]="!selectedFile() || status() === 'comparing'"
          (click)="compare()">
          @if (status() === 'comparing') {
            <mat-spinner diameter="20" style="display:inline-block;vertical-align:middle;margin-right:8px;" />
          }
          Compare
        </button>
      </div>

      <!-- Results -->
      @if (status() === 'results') {
        <mat-card class="results-card" appearance="outlined">
          <mat-card-header>
            <mat-card-title>Key Differences</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (differences().length === 0) {
              <p style="color: var(--mat-sys-on-surface); padding: 16px 0;">
                No significant differences found between the two versions.
              </p>
            } @else {
              <mat-list>
                @for (diff of differences(); track $index) {
                  <mat-list-item>
                    <mat-icon matListItemIcon class="diff-icon-neutral">swap_horiz</mat-icon>
                    <span matListItemTitle style="white-space:normal;">{{ diff }}</span>
                  </mat-list-item>
                }
              </mat-list>
            }
          </mat-card-content>
        </mat-card>
      }

      <!-- Error -->
      @if (status() === 'error') {
        <mat-card class="error-card">
          <mat-card-content style="display:flex;align-items:center;gap:8px;">
            <mat-icon color="warn">error</mat-icon>
            <span>Comparison failed. Please try again.</span>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="status.set('idle')">Dismiss</button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
})
export class CompareComponent implements OnInit {
  private readonly api   = inject(ContractApiService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly LANGUAGES = LANGUAGES;

  readonly contractId      = signal<string>('');
  readonly originalFileName = signal<string>('');
  readonly selectedFile    = signal<File | null>(null);
  readonly dragOver        = signal(false);
  readonly status          = signal<CompareStatus>('idle');
  readonly differences     = signal<string[]>([]);
  language = '';

  ngOnInit() {
    const id = this.route.snapshot.params['id'] as string;
    this.contractId.set(id);
    // Load original filename for the reference chip
    firstValueFrom(this.api.getDetail(id))
      .then(detail => this.originalFileName.set(detail.contract.fileName))
      .catch(() => { /* non-critical — chip just stays empty */ });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) { this.selectedFile.set(file); this.status.set('file-selected'); }
  }

  onDragOver(event: DragEvent) { event.preventDefault(); this.dragOver.set(true); }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) { this.selectedFile.set(file); this.status.set('file-selected'); }
  }

  clearFile() {
    this.selectedFile.set(null);
    this.status.set('idle');
    if (this.fileInputRef?.nativeElement) this.fileInputRef.nativeElement.value = '';
  }

  async compare() {
    const file = this.selectedFile();
    if (!file || this.status() === 'comparing') return;

    this.status.set('comparing');
    try {
      const result = await firstValueFrom(
        this.api.compareVersions(this.contractId(), file, this.language || undefined)
      );
      this.differences.set(result.differences);
      this.status.set('results');
    } catch {
      this.status.set('error');
    }
  }
}
