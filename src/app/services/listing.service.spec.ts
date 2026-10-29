import { TestBed } from '@angular/core/testing';
import { ListingService } from './listing.service';
import { ToastService } from './toast.service';

describe('ListingService', () => {
  let service: ListingService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ListingService, ToastService]
    });
    service = TestBed.inject(ListingService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created and load initial seeded listings', () => {
    expect(service).toBeTruthy();
    const listings = service.getListings();
    expect(listings.length).toBeGreaterThanOrEqual(4);
  });

  it('should return featured listings', () => {
    const featured = service.getFeaturedListings();
    expect(featured.length).toBeGreaterThan(0);
    featured.forEach(apt => {
      expect(apt.isFeatured).toBe(true);
    });
  });

  it('should find a listing by ID', () => {
    const first = service.getListings()[0];
    const found = service.getListingById(first.id);
    expect(found).toBeDefined();
    expect(found?.title).toEqual(first.title);
  });

  it('should add a new apartment listing and persist to storage', () => {
    const initialCount = service.getListings().length;
    const newApartment = service.addListing({
      title: 'Sunny Studio Test Unit',
      buildingName: 'Test Tower',
      propertyType: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      isShared: false,
      address: {
        street: '123 Test Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701'
      },
      squareFeet: 600,
      stayType: 'Short term',
      rent: 1400,
      isNegotiable: true,
      priceMode: 'Per Month',
      isFurnished: true,
      vegPreference: 'Any',
      amenities: ['Gym/Fitness Center', 'Power Backup'],
      description: 'A cozy test unit for unit testing purposes.',
      photos: ['https://example.com/test.jpg'],
      contact: {
        landlordName: 'Tester',
        phone: '1234567890',
        email: 'tester@example.com'
      },
      landlordId: 'u-1',
      isFeatured: false
    });

    expect(newApartment.id).toBeDefined();
    expect(service.getListings().length).toBe(initialCount + 1);
  });

  it('should save and retrieve draft post for preview screen', () => {
    const draft = {
      title: 'Draft Unit for Preview',
      buildingName: 'Draft Building',
      propertyType: 'Apartment' as const,
      bedrooms: 2,
      bathrooms: 2,
      isShared: false,
      address: {
        street: '456 Draft Ave',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202'
      },
      squareFeet: 1000,
      stayType: 'Long term (6+ months)' as const,
      rent: 2000,
      isNegotiable: false,
      priceMode: 'Per Month' as const,
      isFurnished: true,
      vegPreference: 'Any' as const,
      amenities: ['Elevator'],
      description: 'Draft description text for testing preview and submit.',
      photos: ['https://example.com/photo.jpg'],
      contact: {
        landlordName: 'Landlord User',
        phone: '555-0199',
        email: 'landlord@test.com'
      },
      landlordId: 'u-1'
    };

    service.saveDraftPost(draft);
    const retrieved = service.getDraftPost();
    expect(retrieved).toEqual(draft);

    service.clearDraftPost();
    expect(service.getDraftPost()).toBeNull();
  });

  it('should delete an apartment listing', () => {
    const listings = service.getListings();
    const targetId = listings[0].id;
    const initialCount = listings.length;

    const result = service.deleteListing(targetId);
    expect(result).toBe(true);
    expect(service.getListings().length).toBe(initialCount - 1);
    expect(service.getListingById(targetId)).toBeUndefined();
  });
});

