import { Component, OnInit } from '@angular/core';
import { InquiryService } from '../../services/inquiry.service';
import { AuthService } from '../../services/auth.service';
import { Inquiry } from '../../models/inquiry.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-inquiries',
  standalone: false,
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.scss']
})
export class InquiriesComponent implements OnInit {
  currentUser: User | null = null;
  receivedInquiries: Inquiry[] = [];
  sentInquiries: Inquiry[] = [];
  activeTab: 'received' | 'sent' = 'received';

  constructor(
    private inquiryService: InquiryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadInquiries();
  }

  loadInquiries(): void {
    if (!this.currentUser) return;

    this.inquiryService.inquiries$.subscribe(() => {
      if (this.currentUser) {
        this.receivedInquiries = this.inquiryService.getInquiriesForLandlord(this.currentUser.id);
        this.sentInquiries = this.inquiryService.getInquiriesBySender(this.currentUser.email);

        if (this.currentUser.role === 'renter') {
          this.activeTab = 'sent';
        }
      }
    });
  }
}
