import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inquiry } from '../models/inquiry.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private readonly STORAGE_KEY = 'renthub_inquiries';
  private inquiriesSubject = new BehaviorSubject<Inquiry[]>([]);
  public inquiries$: Observable<Inquiry[]> = this.inquiriesSubject.asObservable();

  constructor(private toastService: ToastService) {
    this.initDefaultInquiries();
  }

  private initDefaultInquiries(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.inquiriesSubject.next(JSON.parse(stored));
        return;
      } catch {
        // Fallback
      }
    }

    const defaultInquiries: Inquiry[] = [
      {
        id: 'inq-1',
        listingId: 'apt-1',
        listingTitle: 'Modern Highrise Luxury 2BHK with Skyline Views',
        landlordId: 'u-1',
        senderName: 'Alex Rivera',
        senderEmail: 'renter@renthub.com',
        senderPhone: '+1 (555) 987-6543',
        moveInDate: '2026-11-15',
        message: 'Hello, I am relocating for work and looking to move in mid-November. I would love to schedule a video or in-person tour this Saturday!',
        createdAt: '2026-10-25T14:00:00Z',
        status: 'pending'
      }
    ];

    this.saveInquiries(defaultInquiries);
  }

  private saveInquiries(list: Inquiry[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    this.inquiriesSubject.next(list);
  }

  public sendInquiry(inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
    const list = this.inquiriesSubject.value;
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    const updated = [newInquiry, ...list];
    this.saveInquiries(updated);
    this.toastService.success('Your rental inquiry has been sent to the landlord!');
    return newInquiry;
  }

  public getInquiriesForLandlord(landlordId: string): Inquiry[] {
    return this.inquiriesSubject.value.filter(i => i.landlordId === landlordId);
  }

  public getInquiriesBySender(senderEmail: string): Inquiry[] {
    return this.inquiriesSubject.value.filter(i => i.senderEmail.toLowerCase() === senderEmail.toLowerCase());
  }
}
