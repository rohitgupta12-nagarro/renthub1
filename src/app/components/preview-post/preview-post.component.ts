import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ToastService } from '../../services/toast.service';
import { Apartment } from '../../models/apartment.model';

@Component({
  selector: 'app-preview-post',
  standalone: false,
  templateUrl: './preview-post.component.html',
  styleUrls: ['./preview-post.component.scss']
})
export class PreviewPostComponent implements OnInit {
  draftPost: Omit<Apartment, 'id' | 'createdAt' | 'viewsCount'> | null = null;
  isSubmitting = false;

  constructor(
    private listingService: ListingService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.draftPost = this.listingService.getDraftPost();
    if (!this.draftPost) {
      this.toastService.info('No draft post found. Please fill in the post form first.');
      this.router.navigate(['/create-post']);
    }
  }

  editPost(): void {
    // Return back to form, preserving draft in service
    this.router.navigate(['/create-post']);
  }

  confirmAndSubmit(): void {
    if (!this.draftPost) return;

    this.isSubmitting = true;
    try {
      const created = this.listingService.addListing(this.draftPost);
      this.router.navigate(['/listings', created.id]);
    } catch {
      this.toastService.error('Failed to submit post. Please try again.');
      this.isSubmitting = false;
    }
  }
}

