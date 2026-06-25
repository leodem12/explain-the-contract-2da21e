import {
  ChangeDetectionStrategy, Component, inject, signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  styles: [`
    .login-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--mat-sys-surface);
      padding: 16px;
    }
    .branding {
      text-align: center;
      margin-bottom: 48px;
    }
    .branding h1 {
      font-size: 32px;
      font-weight: 600;
      color: var(--mat-sys-primary);
      margin: 0 0 8px;
    }
    .branding p {
      color: var(--mat-sys-on-surface);
      margin: 0;
    }
    mat-card {
      width: 100%;
      max-width: 420px;
      padding: 32px;
      border: 1px solid rgba(0,0,0,0.08);
      box-shadow: none !important;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
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
    <div class="login-page">
      <div class="branding" role="banner">
        <h1>Explain the Contract</h1>
        <p>Contracts, in plain English</p>
      </div>

      <mat-card>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Email address</mat-label>
            <input matInput type="email" autocomplete="email" formControlName="email" />
            @if (form.controls.email.hasError('required') && form.controls.email.touched) {
              <mat-error>Email is required.</mat-error>
            } @else if (form.controls.email.hasError('email') && form.controls.email.touched) {
              <mat-error>Enter a valid email.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput [type]="showPassword() ? 'text' : 'password'"
                   autocomplete="current-password" formControlName="password" />
            <button mat-icon-button matSuffix type="button"
                    [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                    (click)="showPassword.set(!showPassword())">
              <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (form.controls.password.hasError('required') && form.controls.password.touched) {
              <mat-error>Password is required.</mat-error>
            }
          </mat-form-field>

          <button mat-raised-button color="primary" class="submit-btn"
                  type="submit" [disabled]="submitting()">
            @if (submitting()) {
              <mat-spinner class="spinner-inline" diameter="20" />
            }
            Sign In
          </button>
        </form>

        <div class="links">
          No account? <a routerLink="/register">Create one</a>
        </div>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth    = inject(AuthService);
  private readonly router  = inject(Router);
  private readonly snack   = inject(MatSnackBar);
  private readonly fb      = inject(FormBuilder);

  readonly showPassword = signal(false);
  readonly submitting   = signal(false);

  readonly form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.form.disable();

    const { email, password } = this.form.getRawValue();
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/contracts']),
      error: () => {
        this.submitting.set(false);
        this.form.enable();
        this.snack.open('Incorrect email or password. Please try again.', 'Dismiss', { duration: 4000 });
      },
    });
  }
}
