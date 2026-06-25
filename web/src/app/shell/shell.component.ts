import {
  ChangeDetectionStrategy, Component, inject, signal,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatButtonModule, MatIconModule, MatChipsModule,
  ],
  styles: [`
    :host { display: flex; flex-direction: column; height: 100vh; }
    mat-toolbar {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      flex-shrink: 0;
    }
    .toolbar-title { font-size: 18px; font-weight: 600; flex: 1; }
    mat-sidenav-container { flex: 1; overflow: hidden; }
    mat-sidenav {
      width: 240px;
      padding: 8px 0;
      background: var(--mat-sys-surface-container);
    }
    .content-area {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      overflow-y: auto;
      height: 100%;
    }
    .spacer { flex: 1; }
  `],
  template: `
    <mat-toolbar role="banner">
      @if (isMobile()) {
        <button mat-icon-button aria-label="Open navigation" (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
      }
      <span class="toolbar-title">Explain the Contract</span>
      @if (auth.currentUser(); as user) {
        <mat-chip>{{ user.role }}</mat-chip>
        <button mat-button (click)="auth.logout()" aria-label="Sign out" style="margin-left: 8px;">
          <mat-icon>logout</mat-icon> Sign out
        </button>
      }
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()">
        <mat-nav-list>
          <a mat-list-item routerLink="/contracts" routerLinkActive="mdc-list-item--activated">
            <mat-icon matListItemIcon>description</mat-icon>
            My Contracts
          </a>
          <a mat-list-item routerLink="/upload" routerLinkActive="mdc-list-item--activated">
            <mat-icon matListItemIcon>upload_file</mat-icon>
            Upload
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <div class="content-area">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class ShellComponent {
  readonly auth = inject(AuthService);

  private readonly bp = inject(BreakpointObserver);
  readonly isMobile = toSignal(
    this.bp.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
      map(r => r.matches)
    ),
    { initialValue: false }
  );
}
