import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  AfterViewInit,
  inject,
  resource,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ContractApiService, ContractDto } from './contract-api.service';

@Component({
  selector: 'app-contracts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 32px;
      font-weight: 600;
      line-height: 40px;
      margin: 0;
    }
    .table-card {
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 10px;
      padding: 0;
      overflow: hidden;
    }
    mat-table {
      width: 100%;
      background: transparent;
    }
    mat-row:hover {
      background-color: var(--mat-sys-surface-container);
    }
    .chip-analysed {
      --mdc-chip-label-text-color: #fff;
      background-color: var(--mat-sys-tertiary) !important;
    }
    .chip-failed {
      --mdc-chip-label-text-color: #fff;
      background-color: var(--mat-sys-error) !important;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 64px 24px;
      text-align: center;
    }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; color: var(--mat-sys-neutral); }
    .empty-state h2 { font-size: 20px; font-weight: 600; margin: 0; }
    .empty-state p { margin: 0; color: var(--mat-sys-on-surface); }
  `],
  template: `
    <mat-progress-bar *ngIf="contracts.isLoading()"
      mode="indeterminate"
      aria-label="Loading contracts"
      style="position:sticky;top:0;z-index:10;margin-bottom:16px">
    </mat-progress-bar>

    @if (contracts.isLoading()) {
      <!-- progress bar shown above, content not yet rendered -->
    }

    <div class="page-header">
      <h1>My Contracts</h1>
      <a mat-raised-button color="primary" routerLink="/upload">Upload Contract</a>
    </div>

    @if (!contracts.isLoading() && contracts.error()) {
      <!-- error is shown via snackbar, no additional card needed -->
    }

    @if (!contracts.isLoading() && !contracts.error()) {
      @let rows = contracts.value() ?? [];

      @if (rows.length === 0) {
        <div class="empty-state">
          <mat-icon aria-hidden="true">description</mat-icon>
          <h2>No contracts yet.</h2>
          <p>Upload your first contract to get started.</p>
          <a mat-raised-button color="primary" routerLink="/upload">Upload your first contract</a>
        </div>
      } @else {
        <mat-card class="table-card" appearance="outlined">
          <mat-table [dataSource]="dataSource" matSort aria-label="My contracts">

            <!-- File Name column -->
            <ng-container matColumnDef="fileName">
              <mat-header-cell *matHeaderCellDef mat-sort-header>File name</mat-header-cell>
              <mat-cell *matCellDef="let row">{{ row.fileName }}</mat-cell>
            </ng-container>

            <!-- Status column -->
            <ng-container matColumnDef="status">
              <mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
              <mat-cell *matCellDef="let row">
                <mat-chip-set>
                  <mat-chip
                    [attr.aria-label]="'Status: ' + row.status"
                    [class.chip-analysed]="row.status === 'Analysed'"
                    [class.chip-failed]="row.status === 'AnalysisFailed'"
                    [highlighted]="row.status !== 'Extracted'">
                    {{ statusLabel(row.status) }}
                  </mat-chip>
                </mat-chip-set>
              </mat-cell>
            </ng-container>

            <!-- Uploaded column -->
            <ng-container matColumnDef="uploadedAt">
              <mat-header-cell *matHeaderCellDef mat-sort-header>Uploaded</mat-header-cell>
              <mat-cell *matCellDef="let row">{{ row.uploadedAt | date:'mediumDate' }}</mat-cell>
            </ng-container>

            <!-- Actions column -->
            <ng-container matColumnDef="actions">
              <mat-header-cell *matHeaderCellDef></mat-header-cell>
              <mat-cell *matCellDef="let row">
                <a mat-button [routerLink]="['/contracts', row.id]">Open</a>
              </mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
          </mat-table>

          <mat-paginator
            [pageSizeOptions]="[10, 20, 50]"
            [pageSize]="20"
            showFirstLastButtons
            aria-label="Select page of contracts">
          </mat-paginator>
        </mat-card>
      }
    }
  `,
})
export class ContractsComponent implements AfterViewInit {
  private readonly api = inject(ContractApiService);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly displayedColumns = ['fileName', 'status', 'uploadedAt', 'actions'];
  readonly dataSource = new MatTableDataSource<ContractDto>([]);

  readonly contracts = resource({
    loader: async () => {
      try {
        const list = await firstValueFrom(this.api.list());
        this.dataSource.data = list;
        return list;
      } catch {
        this.snack.open('Could not load your contracts. Please try again.', 'Dismiss', {
          duration: 4000,
          panelClass: ['snack-error'],
        });
        throw new Error('load-failed');
      }
    },
  });

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'Analysed': return 'Analysed';
      case 'AnalysisFailed': return 'Analysis Failed';
      case 'Extracted': return 'Extracted';
      default: return status;
    }
  }
}
