import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./auth.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl = '/';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    const result = this.authService.login(email, password);

    if (result.success) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.errorMessage = result.message;
      this.toastService.error(result.message);
    }
  }

  fillDemoLandlord(): void {
    this.loginForm.patchValue({
      email: 'landlord@renthub.com',
      password: 'Password123!'
    });
    this.errorMessage = '';
  }

  fillDemoRenter(): void {
    this.loginForm.patchValue({
      email: 'renter@renthub.com',
      password: 'Password123!'
    });
    this.errorMessage = '';
  }
}
