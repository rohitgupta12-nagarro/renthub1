import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { ListingService } from '../../services/listing.service';
import { FavoritesService } from '../../services/favorites.service';
import { Apartment, PropertyType, StayType, AVAILABLE_AMENITIES } from '../../models/apartment.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  allListings: Apartment[] = [];
  filteredListings: Apartment[] = [];
  featuredListings: Apartment[] = [];
  currentCarouselIndex = 0;
  carouselIntervalSub?: Subscription;

  // Search & Filter state
  searchTerm = '';
  selectedPropertyType: string = 'ALL';
  selectedStayType: string = 'ALL';
  selectedFurnished: string = 'ALL';
  selectedVegPreference: string = 'ALL';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedAmenities: string[] = [];
  sortBy = 'newest'; // 'newest' | 'price-asc' | 'price-desc' | 'sqft-desc'

  availableAmenities = AVAILABLE_AMENITIES;

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  private subs = new Subscription();

  constructor(
    private listingService: ListingService,
    public favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.listingService.listings$.subscribe(listings => {
        this.allListings = listings;
        this.featuredListings = listings.filter(l => l.isFeatured);
        if (this.featuredListings.length === 0 && listings.length > 0) {
          this.featuredListings = listings.slice(0, 3);
        }
        this.applyFilters();
      })
    );

    this.startCarouselAutoPlay();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.stopCarouselAutoPlay();
  }

  // Carousel Controls
  startCarouselAutoPlay(): void {
    this.stopCarouselAutoPlay();
    this.carouselIntervalSub = interval(6000).subscribe(() => {
      this.nextSlide();
    });
  }

  stopCarouselAutoPlay(): void {
    if (this.carouselIntervalSub) {
      this.carouselIntervalSub.unsubscribe();
    }
  }

  nextSlide(): void {
    if (this.featuredListings.length > 0) {
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.featuredListings.length;
    }
  }

  prevSlide(): void {
    if (this.featuredListings.length > 0) {
      this.currentCarouselIndex =
        (this.currentCarouselIndex - 1 + this.featuredListings.length) % this.featuredListings.length;
    }
  }

  goToSlide(index: number): void {
    this.currentCarouselIndex = index;
  }

  get currentFeatured(): Apartment | undefined {
    return this.featuredListings[this.currentCarouselIndex];
  }

  // Filter & Search Logic
  applyFilters(): void {
    let result = [...this.allListings];

    // Search term
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.buildingName.toLowerCase().includes(q) ||
        item.address.city.toLowerCase().includes(q) ||
        item.address.street.toLowerCase().includes(q) ||
        item.address.state.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }

    // Property Type
    if (this.selectedPropertyType !== 'ALL') {
      result = result.filter(item => item.propertyType === this.selectedPropertyType);
    }

    // Stay Type
    if (this.selectedStayType !== 'ALL') {
      result = result.filter(item => item.stayType === this.selectedStayType || item.stayType === 'Both');
    }

    // Furnished
    if (this.selectedFurnished === 'FURNISHED') {
      result = result.filter(item => item.isFurnished);
    } else if (this.selectedFurnished === 'UNFURNISHED') {
      result = result.filter(item => !item.isFurnished);
    }

    // Veg Preference
    if (this.selectedVegPreference !== 'ALL') {
      result = result.filter(item => item.vegPreference === this.selectedVegPreference || item.vegPreference === 'Any');
    }

    // Min Price
    if (this.minPrice !== null && this.minPrice >= 0) {
      result = result.filter(item => item.rent >= (this.minPrice as number));
    }

    // Max Price
    if (this.maxPrice !== null && this.maxPrice > 0) {
      result = result.filter(item => item.rent <= (this.maxPrice as number));
    }

    // Amenities (Must include all selected)
    if (this.selectedAmenities.length > 0) {
      result = result.filter(item =>
        this.selectedAmenities.every(a => item.amenities.includes(a))
      );
    }

    // Sorting
    switch (this.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.rent - b.rent);
        break;
      case 'price-desc':
        result.sort((a, b) => b.rent - a.rent);
        break;
      case 'sqft-desc':
        result.sort((a, b) => b.squareFeet - a.squareFeet);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    this.filteredListings = result;
    this.totalPages = Math.max(1, Math.ceil(this.filteredListings.length / this.itemsPerPage));
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  toggleAmenity(amenity: string): void {
    if (this.selectedAmenities.includes(amenity)) {
      this.selectedAmenities = this.selectedAmenities.filter(a => a !== amenity);
    } else {
      this.selectedAmenities = [...this.selectedAmenities, amenity];
    }
    this.applyFilters();
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities.includes(amenity);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedPropertyType = 'ALL';
    this.selectedStayType = 'ALL';
    this.selectedFurnished = 'ALL';
    this.selectedVegPreference = 'ALL';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedAmenities = [];
    this.sortBy = 'newest';
    this.currentPage = 1;
    this.applyFilters();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.searchTerm.trim()) count++;
    if (this.selectedPropertyType !== 'ALL') count++;
    if (this.selectedStayType !== 'ALL') count++;
    if (this.selectedFurnished !== 'ALL') count++;
    if (this.selectedVegPreference !== 'ALL') count++;
    if (this.minPrice !== null) count++;
    if (this.maxPrice !== null) count++;
    count += this.selectedAmenities.length;
    return count;
  }

  // Pagination getters
  get paginatedListings(): Apartment[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredListings.slice(startIndex, startIndex + this.itemsPerPage);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Favorites Quick Action
  toggleFavorite(event: Event, apartment: Apartment): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(apartment.id, apartment.title);
  }

  viewDetails(id: string): void {
    this.router.navigate(['/listings', id]);
  }
}
