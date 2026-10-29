import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: false,
  template: `
    <div class="container py-5 text-center my-auto">
      <div class="display-1 fw-bold text-primary mb-2">404</div>
      <h2 class="fw-bold mb-3">Page Not Found</h2>
      <p class="text-muted mb-4">The apartment listing or page you are looking for does not exist or has been moved.</p>
      <a routerLink="/" class="btn btn-primary rounded-pill px-4 py-2">
        <i class="bi bi-house-door me-1"></i> Return to RentHub Home
      </a>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 60px 0;
    }
  `]
})
export class NotFoundComponent {}
