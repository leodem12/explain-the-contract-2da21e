import {
  ChangeDetectionStrategy, Component, inject, signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatButtonToggleModule, MatIconModule, MatProgressSpinnerModule,
  ],
  styles: [`
    .register-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--mat-sys-surface);
      padding: 16px;
    }
    mat-card {
      width: 100%;
      max-width: 440px;
      padding: 32px;
      border: 1px solid rgba(0,0,0,0.08);
      box-shadow: none !important;
    }
    mat-form-field { width: 100%; margin-bottom: 16px; }
    .role-group {
      width: 100%;
      margin-bottom: 16px;
    }
    .role-group mat-button-toggle-group {
      width: 100%;
    }
    .role-group mat-button-toggle {
      flex: 1;
    }
    .role-caption {
      font-size: 11px;
      color: var(--mat-sys-on-surface);
      opacity: 0.7;
      margin-top: 4px;
    }
    .submit-btn {
      width: 100%;
      margin-top: 8px;
    }
    .links {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
    }
    .spinner-inline {
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
  `],
  template: `
    <div class="register-page">
      <mat-card>
        <h2 style="margin: 0 0 24px; font-size: 24px; font-weight: 600;">Create account</h2>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Email address</mat-label>
            <input matInput type="email" autocomplete="email" formControlName="email" />
            @if (form.controls.email.hasError('required') && form.controls.email.touched) {
              <mat-error>Email is required.</mat-error>
            } @else if (form.controls.email.hasError('email') && form.controls.email.touched) {
              <mat-error>Enter a valid email.</mat-error>
            } @else if (duplicateEmail()) {
              <mat-error>An account with this email already exists.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput [type]="showPassword() ? 'text' : 'password'"
                   autocomplete="new-password" formControlName="password" />
            <button mat-icon-button matSuffix type="button"
                    [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                    (click)="showPassword.set(!showPassword())">
              <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (form.controls.password.hasError('required') && form.controls.password.touched) {
              <mat-error>Password is required.</mat-error>
            }
          </mat-form-field>

          <div class="role-group">
            <mat-button-toggle-group formControlName="role" aria-label="Role">
              <mat-button-toggle value="Viewer">Viewer</mat-button-toggle>
              <mat-button-toggle value="Editor">Editor</mat-button-toggle>
            </mat-button-toggle-group>
            @switch (form.controls.role.value) {
              @case ('Viewer') {
                <p class="role-caption">Read contracts and notes</p>
              }
              @case ('Editor') {
                <p class="role-caption">Upload contracts, run analysis, add notes</p>
              }
              @default {
                <p class="role-caption">Select a role to continue</p>
              }
            }
          </div>

          <button mat-raised-button color="primary" class="submit-btn"
                  type="submit" [disabled]="submitting()">
            @if (submitting()) {
              <mat-spinner class="spinner-inline" diameter="20" />
            }
            Create account
          </button>
        </form>

        <div class="links">
          Already have an account? <a routerLink="/login">Sign in</a>
        </div>
      </mat-card>
    </div>
  `,
})
export class RegisterComponent {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack  = inject(MatSnackBar);
  private readonly fb     = inject(FormBuilder);

  readonly showPassword = signal(false);
  readonly submitting   = signal(false);
  readonly duplicateEmail = signal(false);

  readonly form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role:     ['Editor', Validators.required],
  });

  submit() {
    this.duplicateEmail.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.form.disable();

    const { email, password, role } = this.form.getRawValue();
    this.auth.register(email!, password!, role!).subscribe({
      next: () => this.router.navigate(['/contracts']),
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.form.enable();
        if (err.status === 409) {
          this.duplicateEmail.set(true);
        } else {
          this.snack.open('Registration failed. Please try again.', 'Dismiss', { duration: 4000 });
        }
      },
    });
  }
}
