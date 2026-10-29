import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { ListingService } from '../../services/listing.service';
import { Apartment } from '../../models/apartment.model';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoritedApartments: Apartment[] = [];
  private subs = new Subscription();

  constructor(
    public favoritesService: FavoritesService,
    private listingService: ListingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.favoritesService.favorites$.subscribe(ids => {
        const all = this.listingService.getListings();
        this.favoritedApartments = all.filter(a => ids.includes(a.id));
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  removeFavorite(apartment: Apartment): void {
    this.favoritesService.toggleFavorite(apartment.id, apartment.title);
  }

  viewDetails(id: string): void {
    this.router.navigate(['/listings', id]);
  }
}

