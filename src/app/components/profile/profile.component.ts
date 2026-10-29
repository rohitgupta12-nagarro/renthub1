import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ListingService } from '../../services/listing.service';
import { FavoritesService } from '../../services/favorites.service';
import { User } from '../../models/user.model';
import { Apartment } from '../../models/apartment.model';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  myListings: Apartment[] = [];
  favoriteCount = 0;

  constructor(
    private authService: AuthService,
    private listingService: ListingService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.myListings = this.listingService.getListings().filter(l => l.landlordId === this.user?.id);
    }
    this.favoriteCount = this.favoritesService.getFavoriteIds().length;
  }

  deleteListing(id: string): void {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.listingService.deleteListing(id);
      if (this.user) {
        this.myListings = this.listingService.getListings().filter(l => l.landlordId === this.user?.id);
      }
    }
  }
}
