import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ContractApiService, NoteDto } from '../contracts/contract-api.service';
import { CurrentUserService } from '../auth/current-user.service';

@Component({
  selector: 'app-notes-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  styles: [`
    .notes-panel { display: flex; flex-direction: column; gap: 16px; }
    .notes-panel h3 { margin: 0 0 8px; font-size: 16px; font-weight: 600; }
    .note-item { display: flex; flex-direction: column; gap: 4px; padding: 8px 0; border-bottom: 1px solid var(--mat-sys-outline); }
    .note-item:last-child { border-bottom: none; }
    .note-meta { font-size: 12px; color: var(--mat-sys-neutral); }
    .note-text { font-size: 14px; }
    .empty-notes { color: var(--mat-sys-neutral); font-size: 14px; }
    .add-note-area { display: flex; flex-direction: column; gap: 8px; }
    .readonly-label { font-size: 13px; color: var(--mat-sys-neutral); font-style: italic; }
    .loading-row { display: flex; align-items: center; gap: 8px; color: var(--mat-sys-neutral); font-size: 14px; }
  `],
  template: `
    <mat-card appearance="outlined" class="notes-panel" style="padding:16px;">
      <h3>Notes</h3>

      @if (loading()) {
        <div class="loading-row" aria-live="polite">
          <mat-spinner diameter="18" />
          <span>Loading notes…</span>
        </div>
      } @else {
        <!-- Notes list -->
        @if (notes().length === 0) {
          @if (currentUser.isEditor()) {
            <p class="empty-notes">No notes yet. Add the first one below.</p>
          } @else {
            <p class="empty-notes">No notes have been added to this contract.</p>
          }
        } @else {
          <div aria-live="polite">
            @for (note of notes(); track note.id) {
              <div class="note-item">
                <span class="note-meta">{{ note.authorEmail }} · {{ formatDate(note.createdAt) }}</span>
                <span class="note-text">{{ note.text }}</span>
              </div>
            }
          </div>
        }

        <!-- Add note — Editors only -->
        @if (currentUser.isEditor()) {
          <div class="add-note-area">
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>Add a note</mat-label>
              <textarea
                matInput
                [(ngModel)]="noteText"
                rows="3"
                [disabled]="saving()"
                placeholder="Enter your note here…"
              ></textarea>
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              [disabled]="!noteText.trim() || saving()"
              (click)="save()"
            >
              @if (saving()) {
                <mat-spinner diameter="18" style="display:inline-block;margin-right:6px;" />
                Saving…
              } @else {
                Save note
              }
            </button>
          </div>
        } @else {
          <p class="readonly-label">Notes are read-only for your role.</p>
        }
      }
    </mat-card>
  `,
})
export class NotesPanelComponent implements OnChanges {
  /** Contract ID — the panel reloads whenever this changes. */
  readonly contractId = input.required<string>();

  private readonly api = inject(ContractApiService);
  private readonly snackBar = inject(MatSnackBar);
  readonly currentUser = inject(CurrentUserService);

  readonly notes = signal<NoteDto[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  noteText = '';

  ngOnChanges() {
    this.loadNotes();
  }

  async loadNotes() {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.listNotes(this.contractId()));
      this.notes.set(result);
    } catch {
      this.snackBar.open('Could not load notes. Please try again.', 'Dismiss', { duration: 4000 });
    } finally {
      this.loading.set(false);
    }
  }

  async save() {
    const text = this.noteText.trim();
    if (!text) return;

    this.saving.set(true);
    try {
      const note = await firstValueFrom(this.api.addNote(this.contractId(), text));
      this.notes.update(ns => [...ns, note]);
      this.noteText = '';
      this.snackBar.open('Note saved.', 'Dismiss', {
        duration: 3000,
        panelClass: ['snack-success'],
      });
    } catch {
      this.snackBar.open('Could not save note. Please try again.', 'Dismiss', { duration: 4000 });
    } finally {
      this.saving.set(false);
    }
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  }
}
