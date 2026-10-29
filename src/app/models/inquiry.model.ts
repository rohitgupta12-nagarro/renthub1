export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  landlordId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  moveInDate: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}
