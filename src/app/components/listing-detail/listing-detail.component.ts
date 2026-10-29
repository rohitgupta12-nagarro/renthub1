import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListingService } from '../../services/listing.service';
import { FavoritesService } from '../../services/favorites.service';
import { CommentService } from '../../services/comment.service';
import { InquiryService } from '../../services/inquiry.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Apartment } from '../../models/apartment.model';
import { CommentItem } from '../../models/comment.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-listing-detail',
  standalone: false,
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.scss']
})
export class ListingDetailComponent implements OnInit, OnDestroy {
  apartment?: Apartment;
  selectedPhotoIndex = 0;
  comments: CommentItem[] = [];
  currentUser: User | null = null;

  // New Comment form
  newCommentText = '';

  // Inline reply form state
  activeReplyCommentId: string | null = null;
  replyText = '';

  // Inquiry Modal state
  showInquiryModal = false;
  inquiryForm = {
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    moveInDate: '',
    message: ''
  };

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    public favoritesService: FavoritesService,
    private commentService: CommentService,
    private inquiryService: InquiryService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.inquiryForm.senderName = user.name;
          this.inquiryForm.senderEmail = user.email;
          this.inquiryForm.senderPhone = user.phone || '';
        }
      })
    );

    this.subs.add(
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadListing(id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadListing(id: string): void {
    const found = this.listingService.getListingById(id);
    if (!found) {
      this.toastService.error('Apartment listing not found.');
      this.router.navigate(['/']);
      return;
    }

    this.apartment = found;
    this.listingService.incrementViews(id);
    this.loadComments();
  }

  loadComments(): void {
    if (this.apartment) {
      this.comments = this.commentService.getCommentsForListing(this.apartment.id);
    }
  }

  selectPhoto(index: number): void {
    this.selectedPhotoIndex = index;
  }

  toggleFavorite(): void {
    if (this.apartment) {
      this.favoritesService.toggleFavorite(this.apartment.id, this.apartment.title);
    }
  }

  // Comment Actions
  submitComment(): void {
    if (!this.apartment) return;

    if (!this.authService.isAuthenticated()) {
      this.toastService.warning('Please log in to leave a comment.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (!this.newCommentText.trim()) {
      this.toastService.warning('Please enter a comment before submitting.');
      return;
    }

    const res = this.commentService.addComment(this.apartment.id, this.newCommentText.trim());
    if (res.success) {
      this.newCommentText = '';
      this.loadComments();
    }
  }

  openReplyBox(commentId: string): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.warning('Please log in to reply.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.activeReplyCommentId = commentId;
    this.replyText = '';
  }

  cancelReply(): void {
    this.activeReplyCommentId = null;
    this.replyText = '';
  }

  submitReply(parentCommentId: string): void {
    if (!this.apartment || !this.replyText.trim()) return;

    const res = this.commentService.addComment(this.apartment.id, this.replyText.trim(), parentCommentId);
    if (res.success) {
      this.replyText = '';
      this.activeReplyCommentId = null;
      this.loadComments();
    }
  }

  deleteComment(commentId: string): void {
    if (this.apartment && confirm('Are you sure you want to remove this comment?')) {
      this.commentService.deleteComment(this.apartment.id, commentId);
      this.loadComments();
    }
  }

  // Inquiry Modal Actions
  openInquiryModal(): void {
    this.showInquiryModal = true;
    if (this.currentUser) {
      this.inquiryForm.senderName = this.currentUser.name;
      this.inquiryForm.senderEmail = this.currentUser.email;
      this.inquiryForm.senderPhone = this.currentUser.phone || '';
    }
    if (!this.inquiryForm.message) {
      this.inquiryForm.message = `Hi ${this.apartment?.contact.landlordName || 'Landlord'}, I am very interested in "${this.apartment?.title}" and would like to schedule a viewing.`;
    }
  }

  closeInquiryModal(): void {
    this.showInquiryModal = false;
  }

  submitInquiry(): void {
    if (!this.apartment) return;

    if (!this.inquiryForm.senderName.trim() || !this.inquiryForm.senderEmail.trim() || !this.inquiryForm.message.trim()) {
      this.toastService.warning('Please complete required inquiry fields (Name, Email, Message).');
      return;
    }

    this.inquiryService.sendInquiry({
      listingId: this.apartment.id,
      listingTitle: this.apartment.title,
      landlordId: this.apartment.landlordId,
      senderName: this.inquiryForm.senderName.trim(),
      senderEmail: this.inquiryForm.senderEmail.trim(),
      senderPhone: this.inquiryForm.senderPhone.trim(),
      moveInDate: this.inquiryForm.moveInDate || new Date().toISOString().split('T')[0],
      message: this.inquiryForm.message.trim()
    });

    this.showInquiryModal = false;
  }
}
