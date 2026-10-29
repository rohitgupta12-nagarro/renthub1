export interface CommentItem {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userRole?: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  parentId?: string | null;
  replies?: CommentItem[];
}

