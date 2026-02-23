import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
      role: ['General User', Validators.required],
      delayMs: [0]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { userId, password, delayMs, role } = this.loginForm.value;

    this.authService.login({ userId, password, delayMs: delayMs || undefined })
      .subscribe({
        next: (response) => {
          if (response.user.role !== role) {
            this.error = 'Invalid role for this user';
            this.loading = false;
            return;
          }
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed';
          this.loading = false;
        }
      });
  }
}
