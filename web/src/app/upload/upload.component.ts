import {
  ChangeDetectionStrategy, Component, ElementRef, ViewChild,
  inject, signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContractApiService } from '../contracts/contract-api.service';

type UploadStatus = 'idle' | 'uploading' | 'error-extraction' | 'error-llm';

const LANGUAGES = [
  { value: '',   label: 'Auto-detect (match contract language)' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'pl', label: 'Polish' },
];

@Component({
  selector: 'app-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, FormsModule,
    MatButtonModule, MatCardModule, MatChipsModule,
    MatFormFieldModule, MatIconModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatSelectModule,
  ],
  styles: [`
    :host { display: block; }
    .page { max-width: 600px; margin: 0 auto; padding: 0 24px; }
    .back-link { display: inline-flex; align-items: center; gap: 4px; color: var(--mat-sys-primary); text-decoration: none; font-size: 14px; margin-bottom: 24px; }
    .back-link:hover { text-decoration: underline; }
    .drop-zone {
      border: 2px dashed var(--mat-sys-outline);
      border-radius: var(--mat-sys-shape-medium);
      min-height: 180px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 12px; cursor: pointer; padding: 24px;
      background: var(--mat-sys-surface-container);
      transition: border-color 0.15s;
    }
    .drop-zone:hover, .drop-zone.drag-over { border-color: var(--mat-sys-primary); }
    .drop-zone mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--mat-sys-neutral, #64748B); }
    .drop-zone-label { font-size: 14px; color: var(--mat-sys-on-surface); text-align: center; }
    .file-chip-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
    .file-chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--mat-sys-secondary-container); color: var(--mat-sys-on-secondary-container);
      border-radius: 16px; padding: 4px 12px; font-size: 14px;
    }
    .file-chip button { background: none; border: none; cursor: pointer; padding: 0; line-height: 1; }
    .controls { margin-top: 24px; display: flex; flex-direction: column; gap: 16px; }
    .error-card {
      border-left: 4px solid var(--mat-sys-error);
      background: var(--mat-sys-surface-container);
      padding: 16px; border-radius: var(--mat-sys-shape-medium);
      display: flex; align-items: flex-start; gap: 12px; margin-top: 16px;
    }
    .error-card mat-icon { color: var(--mat-sys-error); flex-shrink: 0; }
    .warn-card {
      border-left: 4px solid #C87533;
      background: var(--mat-sys-surface-container);
      padding: 16px; border-radius: var(--mat-sys-shape-medium);
      display: flex; align-items: flex-start; gap: 12px; margin-top: 16px;
    }
    .warn-card mat-icon { color: #C87533; flex-shrink: 0; }
    input[type=file] { display: none; }
    .status-row { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--mat-sys-on-surface); margin-top: 8px; }
  `],
  template: `
    <div class="page">
      <a class="back-link" routerLink="/contracts">
        <mat-icon style="font-size:18px;width:18px;height:18px;">arrow_back</mat-icon>
        My Contracts
      </a>

      <h2 style="font-size:32px;font-weight:600;margin:0 0 24px;">Upload Contract</h2>

      <!-- Drop zone -->
      <div
        class="drop-zone"
        [class.drag-over]="dragOver()"
        role="region"
        aria-label="Contract upload area"
        (click)="fileInput.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragOver.set(false)"
        (drop)="onDrop($event)"
        [attr.aria-describedby]="'upload-instructions'">
        <mat-icon aria-hidden="true">cloud_upload</mat-icon>
        <span class="drop-zone-label" id="upload-instructions">
          @if (selectedFile()) {
            PDF ready — {{ selectedFile()!.name }}
          } @else {
            Drop a PDF here or click to browse
          }
        </span>
      </div>
      <input #fileInput type="file" accept="application/pdf,.pdf"
        (change)="onFileSelected($event)" aria-label="Select PDF file">

      <!-- Selected file chip -->
      @if (selectedFile()) {
        <div class="file-chip-row">
          <span class="file-chip">
            <mat-icon style="font-size:16px;width:16px;height:16px;">picture_as_pdf</mat-icon>
            {{ selectedFile()!.name }}
            <button (click)="clearFile()" aria-label="Clear selected file" type="button">
              <mat-icon style="font-size:16px;width:16px;height:16px;">close</mat-icon>
            </button>
          </span>
        </div>
      }

      <!-- Progress -->
      @if (status() === 'uploading') {
        <mat-progress-bar mode="indeterminate" aria-label="Uploading contract" style="margin-top:16px;"></mat-progress-bar>
        <div class="status-row">
          <mat-spinner diameter="16"></mat-spinner>
          <span>Uploading…</span>
        </div>
      }

      <!-- Error: bad PDF -->
      @if (status() === 'error-extraction') {
        <div class="error-card">
          <mat-icon>error_outline</mat-icon>
          <span>This PDF has no readable text. Only text-based PDFs are supported.</span>
        </div>
      }

      <!-- Error: LLM failure -->
      @if (status() === 'error-llm') {
        <div class="warn-card">
          <mat-icon>warning_amber</mat-icon>
          <span>Analysis failed. Your contract is saved — open it from My Contracts to retry.</span>
        </div>
      }

      <div class="controls">
        <!-- Language selector -->
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Language</mat-label>
          <mat-select [(ngModel)]="language">
            @for (lang of LANGUAGES; track lang.value) {
              <mat-option [value]="lang.value">{{ lang.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <!-- Analyse button -->
        <button
          mat-raised-button
          color="primary"
          style="width:100%;"
          [disabled]="!selectedFile() || status() === 'uploading'"
          (click)="analyse()">
          @if (status() === 'uploading') {
            <mat-spinner diameter="20" style="display:inline-block;vertical-align:middle;margin-right:8px;"></mat-spinner>
          }
          Analyse
        </button>
      </div>
    </div>
  `,
})
export class UploadComponent {
  private readonly api    = inject(ContractApiService);
  private readonly router = inject(Router);
  private readonly snack  = inject(MatSnackBar);

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly LANGUAGES = LANGUAGES;

  readonly selectedFile = signal<File | null>(null);
  readonly status       = signal<UploadStatus>('idle');
  readonly dragOver     = signal(false);
  language = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile.set(file);
      this.status.set('idle');
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.status.set('idle');
    }
  }

  clearFile() {
    this.selectedFile.set(null);
    this.status.set('idle');
    if (this.fileInputRef?.nativeElement)
      this.fileInputRef.nativeElement.value = '';
  }

  async analyse() {
    const file = this.selectedFile();
    if (!file || this.status() === 'uploading') return;

    this.status.set('uploading');

    try {
      const contract = await lastValueFrom(
        this.api.upload(file, this.language || undefined)
      );
      this.snack.open('Contract uploaded successfully.', 'Dismiss', {
        duration: 4000,
        panelClass: ['snack-success'],
      });
      await this.router.navigate(['/contracts', contract.id]);
    } catch (err: any) {
      if (err?.status === 503) {
        this.status.set('error-llm');
      } else {
        // 400 = bad PDF; anything else treated as extraction error
        this.status.set('error-extraction');
      }
    }
  }
}
