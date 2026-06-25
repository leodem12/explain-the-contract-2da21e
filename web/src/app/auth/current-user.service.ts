import { Injectable, inject, computed } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Exposes the current authenticated user's role as reactive signals.
 * Components and guards read isEditor/isViewer to show or hide create/modify controls.
 */
@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly auth = inject(AuthService);

  /** The full current-user DTO (null when unauthenticated). */
  readonly currentUser = this.auth.currentUser;

  /** True while a valid JWT is stored. */
  readonly isAuthenticated = this.auth.isAuthenticated;

  /** True when the authenticated user holds the Editor role. */
  readonly isEditor = computed(() => this.auth.currentUser()?.role === 'Editor');

  /** True when the authenticated user holds the Viewer role. */
  readonly isViewer = computed(() => this.auth.currentUser()?.role === 'Viewer');
}
