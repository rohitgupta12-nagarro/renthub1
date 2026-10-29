import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { ListingService } from '../../services/listing.service';
import { FavoritesService } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let listingService: ListingService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [FormsModule],
      providers: [
        ListingService,
        FavoritesService,
        ToastService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    listingService = TestBed.inject(ListingService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create HomeComponent and load listings', () => {
    expect(component).toBeTruthy();
    expect(component.allListings.length).toBeGreaterThan(0);
    expect(component.filteredListings.length).toBeGreaterThan(0);
  });

  it('should initialize carousel with featured listings', () => {
    expect(component.featuredListings.length).toBeGreaterThan(0);
    expect(component.currentFeatured).toBeDefined();
  });

  it('should navigate through carousel slides', () => {
    const initialIndex = component.currentCarouselIndex;
    component.nextSlide();
    expect(component.currentCarouselIndex).toBe((initialIndex + 1) % component.featuredListings.length);

    component.prevSlide();
    expect(component.currentCarouselIndex).toBe(initialIndex);
  });

  it('should filter listings by search term', () => {
    component.searchTerm = 'Bengaluru';
    component.applyFilters();
    expect(component.filteredListings.every(l =>
      l.address.city.toLowerCase().includes('bengaluru') ||
      l.title.toLowerCase().includes('bengaluru') ||
      l.description.toLowerCase().includes('bengaluru')
    )).toBe(true);
  });

  it('should filter listings by property type', () => {
    component.selectedPropertyType = 'Studio';
    component.applyFilters();
    expect(component.filteredListings.every(l => l.propertyType === 'Studio')).toBe(true);
  });

  it('should reset all filters correctly', () => {
    component.searchTerm = 'Bengaluru';
    component.selectedPropertyType = 'Studio';
    component.minPrice = 1000;
    component.resetFilters();

    expect(component.searchTerm).toBe('');
    expect(component.selectedPropertyType).toBe('ALL');
    expect(component.minPrice).toBeNull();
    expect(component.filteredListings.length).toBe(component.allListings.length);
  });
});

