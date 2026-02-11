import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Load using signals
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Formulario Reactivo con validaciones
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
 
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();

    // Consume the service created in the Core
    this.authService.login(email, password)
    .pipe(
        delay(3500) 
      ).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Navigate to dashboard after success
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Ocurrió un error al intentar iniciar sesión.');
      }
    });
  }

  // Getters to some validations in HTML
  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }
}