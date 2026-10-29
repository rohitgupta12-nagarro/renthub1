import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_PREFIX = 'renthub_favorites_';
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$: Observable<string[]> = this.favoritesSubject.asObservable();

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.authService.currentUser$.subscribe(() => {
      this.loadFavorites();
    });
  }

  private getStorageKey(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${this.STORAGE_PREFIX}${user.id}` : `${this.STORAGE_PREFIX}guest`;
  }

  private loadFavorites(): void {
    const key = this.getStorageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        this.favoritesSubject.next(JSON.parse(stored));
        return;
      } catch {
        // Fallback
      }
    }
    this.favoritesSubject.next([]);
  }

  public getFavoriteIds(): string[] {
    return this.favoritesSubject.value;
  }

  public isFavorite(listingId: string): boolean {
    return this.favoritesSubject.value.includes(listingId);
  }

  public toggleFavorite(listingId: string, listingTitle?: string): boolean {
    const current = this.favoritesSubject.value;
    const exists = current.includes(listingId);
    let updated: string[];

    if (exists) {
      updated = current.filter(id => id !== listingId);
      this.toastService.info(listingTitle ? `Removed "${listingTitle}" from favorites` : 'Removed from favorites');
    } else {
      updated = [...current, listingId];
      this.toastService.success(listingTitle ? `Added "${listingTitle}" to favorites!` : 'Added to favorites!');
    }

    localStorage.setItem(this.getStorageKey(), JSON.stringify(updated));
    this.favoritesSubject.next(updated);
    return !exists;
  }
}
