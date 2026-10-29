import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommentItem } from '../models/comment.model';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly STORAGE_KEY = 'renthub_comments';
  private commentsSubject = new BehaviorSubject<{ [listingId: string]: CommentItem[] }>({});
  public comments$ = this.commentsSubject.asObservable();

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.initDefaultComments();
  }

  private initDefaultComments(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.commentsSubject.next(JSON.parse(stored));
        return;
      } catch {
        // Fallback
      }
    }

    const initialMap: { [listingId: string]: CommentItem[] } = {
      'apt-1': [
        {
          id: 'c-101',
          listingId: 'apt-1',
          userId: 'u-2',
          userName: 'Alex Rivera',
          userRole: 'renter',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          text: 'Hello Sarah! Is there assigned parking included with this unit or is there an extra fee for parking?',
          createdAt: '2026-10-21T11:20:00Z',
          parentId: null,
          replies: [
            {
              id: 'c-102',
              listingId: 'apt-1',
              userId: 'u-1',
              userName: 'Sarah Jenkins (Landlord)',
              userRole: 'landlord',
              userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
              text: 'Hi Alex! One reserved underground garage spot is included in the base rent. Additional parking spots are available via building management for $150/mo.',
              createdAt: '2026-10-21T13:45:00Z',
              parentId: 'c-101'
            }
          ]
        },
        {
          id: 'c-103',
          listingId: 'apt-1',
          userId: 'u-3',
          userName: 'Priya Sharma',
          userRole: 'renter',
          userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
          text: 'Are pets allowed in the building? We have a 12lb trained cat.',
          createdAt: '2026-10-23T15:10:00Z',
          parentId: null,
          replies: []
        }
      ],
      'apt-2': [
        {
          id: 'c-201',
          listingId: 'apt-2',
          userId: 'u-1',
          userName: 'Sarah Jenkins',
          userRole: 'renter',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          text: 'Looks fantastic! What is the minimum lease length accepted for this studio?',
          createdAt: '2026-10-23T18:00:00Z',
          parentId: null,
          replies: []
        }
      ]
    };

    this.saveMap(initialMap);
  }

  private saveMap(map: { [listingId: string]: CommentItem[] }): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(map));
    this.commentsSubject.next(map);
  }

  public getCommentsForListing(listingId: string): CommentItem[] {
    const map = this.commentsSubject.value;
    return map[listingId] || [];
  }

  public addComment(listingId: string, text: string, parentId?: string | null): { success: boolean; comment?: CommentItem } {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.warning('Please log in to participate in the discussion.');
      return { success: false };
    }

    if (!text || !text.trim()) {
      return { success: false };
    }

    const newComment: CommentItem = {
      id: 'c-' + Date.now(),
      listingId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userAvatar: user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      parentId: parentId || null,
      replies: []
    };

    const map = { ...this.commentsSubject.value };
    const listingComments = [...(map[listingId] || [])];

    if (parentId) {
      // Find parent and append reply
      const parent = listingComments.find(c => c.id === parentId);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(newComment);
      } else {
        listingComments.push(newComment);
      }
    } else {
      listingComments.push(newComment);
    }

    map[listingId] = listingComments;
    this.saveMap(map);
    this.toastService.success(parentId ? 'Reply submitted!' : 'Comment posted!');
    return { success: true, comment: newComment };
  }

  public deleteComment(listingId: string, commentId: string): void {
    const map = { ...this.commentsSubject.value };
    let listingComments = map[listingId] || [];

    // Filter top level
    listingComments = listingComments.filter(c => c.id !== commentId);
    // Filter replies
    listingComments.forEach(c => {
      if (c.replies) {
        c.replies = c.replies.filter(r => r.id !== commentId);
      }
    });

    map[listingId] = listingComments;
    this.saveMap(map);
    this.toastService.info('Comment removed.');
  }
}
