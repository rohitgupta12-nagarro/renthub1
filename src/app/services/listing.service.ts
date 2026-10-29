import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Apartment } from '../models/apartment.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private readonly STORAGE_KEY = 'renthub_listings';
  private readonly DRAFT_POST_KEY = 'renthub_draft_post';

  private listingsSubject = new BehaviorSubject<Apartment[]>([]);
  public listings$: Observable<Apartment[]> = this.listingsSubject.asObservable();

  constructor(private toastService: ToastService) {
    this.initDefaultListings();
  }

  private initDefaultListings(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.listingsSubject.next(parsed);
        return;
      } catch {
        // Fallback to defaults on parse error
      }
    }

    const initialListings: Apartment[] = [
      {
        id: 'apt-1',
        title: 'Modern Highrise Luxury 2BHK with Skyline Views',
        buildingName: 'Skyline Azure Towers',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        isShared: false,
        address: {
          street: '450 Marina Boulevard, Tower B',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94123'
        },
        squareFeet: 1250,
        stayType: 'Long term (6+ months)',
        rent: 3200,
        isNegotiable: true,
        priceMode: 'Per Month',
        isFurnished: true,
        vegPreference: 'Any',
        amenities: [
          'Gym/Fitness Center',
          'Swimming Pool',
          'Car Park',
          'Power Backup',
          'Plant Security System',
          'Elevator',
          'Club House'
        ],
        description: 'Spectacular sun-drenched 2-bedroom luxury residence perched high above Marina Boulevard. Floor-to-ceiling panoramic glass windows frame endless bay vistas. Fully upgraded Italian kitchen with quartz countertops and smart Bosch appliances. Includes in-unit washer/dryer, hardwood flooring, and master suite with spa-inspired rainfall shower.',
        photos: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
        ],
        contact: {
          landlordName: 'Sarah Jenkins',
          phone: '+1 (555) 234-5678',
          email: 'landlord@renthub.com'
        },
        landlordId: 'u-1',
        isFeatured: true,
        createdAt: '2026-10-20T10:00:00Z',
        viewsCount: 248
      },
      {
        id: 'apt-2',
        title: 'Chic Downtown Loft Studio Near Financial District',
        buildingName: 'The Heritage Brick Lofts',
        propertyType: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        isShared: false,
        address: '742 Evergreen Terrace'.length > 0 ? {
          street: '128 Pine St, Suite 404',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101'
        } : { street: '', city: '', state: '', zipCode: '' },
        squareFeet: 720,
        stayType: 'Both',
        rent: 1850,
        isNegotiable: false,
        priceMode: 'Utilities included in rent',
        isFurnished: true,
        vegPreference: 'Vegetarian Only',
        amenities: [
          'Gym/Fitness Center',
          'Elevator',
          'Laundry Service',
          'Water Heater',
          'Plant Security System'
        ],
        description: 'Exposed brick industrial design studio with exposed timber beams and tall south-facing windows. Perfect retreat for working professionals desiring walkable downtown lifestyle. High-speed gigabit Wi-Fi, modern Murphy bed to maximize space, induction cooking, and eco-friendly climate control included.',
        photos: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
        ],
        contact: {
          landlordName: 'Marcus Vance',
          phone: '+1 (555) 345-6789',
          email: 'marcus.v@heritage.com'
        },
        landlordId: 'u-2',
        isFeatured: true,
        createdAt: '2026-10-22T14:30:00Z',
        viewsCount: 312
      },
      {
        id: 'apt-3',
        title: 'Spacious 3BHK Family Villa with Private Garden',
        buildingName: 'Greenwood Heights Estate',
        propertyType: 'Villa',
        bedrooms: 3,
        bathrooms: 3,
        isShared: false,
        address: {
          street: '1044 Whispering Oaks Court',
          city: 'Austin',
          state: 'TX',
          zipCode: '78704'
        },
        squareFeet: 2150,
        stayType: 'Long term (6+ months)',
        rent: 3600,
        isNegotiable: true,
        priceMode: 'Per Month',
        isFurnished: false,
        vegPreference: 'Any',
        amenities: [
          'Gym/Fitness Center',
          'Swimming Pool',
          'Car Park',
          'Visitors Parking',
          'Private Lawn',
          'Power Backup',
          'Water Heater',
          'Garbage Disposal',
          'Club House'
        ],
        description: 'Immaculately maintained single-family residence featuring a lush private manicured back lawn, enclosed patio, and covered double carport. Generous open floor plan seamlessly connects the chef kitchen to family dining and cathedral-ceiling living room. Located inside a gated child-safe neighborhood with clubhouse and Olympic pool.',
        photos: [
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
        ],
        contact: {
          landlordName: 'Priya Sharma',
          phone: '+1 (555) 456-7890',
          email: 'priya@renthub.com'
        },
        landlordId: 'u-3',
        isFeatured: true,
        createdAt: '2026-10-24T09:15:00Z',
        viewsCount: 420
      },
      {
        id: 'apt-4',
        title: 'Cozy Shared 1 Room in 2BHK Near Tech University',
        buildingName: 'Campus Edge Residence',
        propertyType: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        isShared: true,
        address: {
          street: '88 Innovation Way, Apt 3B',
          city: 'Boston',
          state: 'MA',
          zipCode: '02115'
        },
        squareFeet: 450,
        stayType: 'Short term',
        rent: 950,
        isNegotiable: true,
        priceMode: 'Utilities included in rent',
        isFurnished: true,
        vegPreference: 'Vegetarian Only',
        amenities: [
          'Elevator',
          'Laundry Service',
          'Water Heater',
          'Power Backup',
          'Garbage Disposal'
        ],
        description: 'Clean, peaceful, fully-furnished private room available in a tidy 2-bedroom shared unit. Room includes study desk, queen mattress, wardrobe, and high-speed internet. Seeking a friendly, clean flatmate (student or tech professional). Common kitchen and living room fully equipped.',
        photos: [
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80'
        ],
        contact: {
          landlordName: 'Sarah Jenkins',
          phone: '+1 (555) 234-5678',
          email: 'landlord@renthub.com'
        },
        landlordId: 'u-1',
        isFeatured: false,
        createdAt: '2026-10-25T11:45:00Z',
        viewsCount: 185
      },
      {
        id: 'apt-5',
        title: 'Opulent Penthouse Suite with Private Rooftop Deck',
        buildingName: 'The Luminary Highrises',
        propertyType: 'Penthouse',
        bedrooms: 4,
        bathrooms: 4,
        isShared: false,
        address: {
          street: '200 Central Park West, Penthouse 28',
          city: 'New York',
          state: 'NY',
          zipCode: '10024'
        },
        squareFeet: 3400,
        stayType: 'Long term (6+ months)',
        rent: 7500,
        isNegotiable: false,
        priceMode: 'Per Month',
        isFurnished: true,
        vegPreference: 'Any',
        amenities: [
          'Gym/Fitness Center',
          'Swimming Pool',
          'Car Park',
          'Visitors Parking',
          'Power Backup',
          'Private Lawn',
          'Water Heater',
          'Plant Security System',
          'Laundry Service',
          'Elevator',
          'Club House'
        ],
        description: 'A trophy penthouse occupying the entire top floor. Private direct elevator access, heated travertine flooring, double wine cellar, automated Lutron smart lighting, and an enormous 800 sq ft private wrap-around terrace boasting unobstructed 360-degree city views. 24/7 dedicated white-glove concierge service included.',
        photos: [
          'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80'
        ],
        contact: {
          landlordName: 'Sarah Jenkins',
          phone: '+1 (555) 234-5678',
          email: 'landlord@renthub.com'
        },
        landlordId: 'u-1',
        isFeatured: true,
        createdAt: '2026-10-26T08:00:00Z',
        viewsCount: 560
      },
      {
        id: 'apt-6',
        title: 'Delightful 2BHK Independent House with Sunny Porch',
        buildingName: 'Maplewood Colonial Court',
        propertyType: 'Independent House',
        bedrooms: 2,
        bathrooms: 2,
        isShared: false,
        address: {
          street: '512 Sunnyvale Drive',
          city: 'Denver',
          state: 'CO',
          zipCode: '80203'
        },
        squareFeet: 1400,
        stayType: 'Both',
        rent: 2200,
        isNegotiable: true,
        priceMode: 'Per Month',
        isFurnished: false,
        vegPreference: 'Non-Vegetarian',
        amenities: [
          'Car Park',
          'Visitors Parking',
          'Private Lawn',
          'Water Heater',
          'Garbage Disposal'
        ],
        description: 'Picturesque independent ranch-style house situated on a peaceful tree-lined neighborhood street. Highlights include sunlit front porch, spacious detached garage, modern energy-efficient HVAC heating, and easy access to hiking trails and downtown Denver transit.',
        photos: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1000&q=80'
        ],
        contact: {
          landlordName: 'Marcus Vance',
          phone: '+1 (555) 345-6789',
          email: 'marcus.v@heritage.com'
        },
        landlordId: 'u-2',
        isFeatured: false,
        createdAt: '2026-10-27T16:10:00Z',
        viewsCount: 198
      }
    ];

    this.saveListings(initialListings);
  }

  private saveListings(listings: Apartment[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(listings));
    this.listingsSubject.next(listings);
  }

  public getListings(): Apartment[] {
    return this.listingsSubject.value;
  }

  public getFeaturedListings(): Apartment[] {
    return this.listingsSubject.value.filter(a => a.isFeatured);
  }

  public getListingById(id: string): Apartment | undefined {
    return this.listingsSubject.value.find(a => a.id === id);
  }

  public addListing(apartment: Omit<Apartment, 'id' | 'createdAt' | 'viewsCount'>): Apartment {
    const current = this.getListings();
    const newApartment: Apartment = {
      ...apartment,
      id: 'apt-' + Date.now(),
      createdAt: new Date().toISOString(),
      viewsCount: 1
    };
    const updated = [newApartment, ...current];
    this.saveListings(updated);
    this.clearDraftPost();
    this.toastService.success('Apartment listing published successfully!');
    return newApartment;
  }

  public updateListing(id: string, updates: Partial<Apartment>): boolean {
    const current = this.getListings();
    const index = current.findIndex(a => a.id === id);
    if (index === -1) return false;

    current[index] = { ...current[index], ...updates };
    this.saveListings([...current]);
    this.toastService.success('Listing updated successfully!');
    return true;
  }

  public deleteListing(id: string): boolean {
    const current = this.getListings();
    const filtered = current.filter(a => a.id !== id);
    if (filtered.length === current.length) return false;

    this.saveListings(filtered);
    this.toastService.info('Listing removed.');
    return true;
  }

  public incrementViews(id: string): void {
    const current = this.getListings();
    const item = current.find(a => a.id === id);
    if (item) {
      item.viewsCount = (item.viewsCount || 0) + 1;
      this.saveListings([...current]);
    }
  }

  // Bonus Question: Preview and Submit Screen Support
  public saveDraftPost(draft: Omit<Apartment, 'id' | 'createdAt' | 'viewsCount'>): void {
    localStorage.setItem(this.DRAFT_POST_KEY, JSON.stringify(draft));
  }

  public getDraftPost(): Omit<Apartment, 'id' | 'createdAt' | 'viewsCount'> | null {
    const raw = localStorage.getItem(this.DRAFT_POST_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  public clearDraftPost(): void {
    localStorage.removeItem(this.DRAFT_POST_KEY);
  }
}
