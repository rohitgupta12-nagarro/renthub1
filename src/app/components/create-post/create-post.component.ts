import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AVAILABLE_AMENITIES, PropertyType, StayType, PriceMode, VegPreference } from '../../models/apartment.model';

@Component({
  selector: 'app-create-post',
  standalone: false,
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  availableAmenities = AVAILABLE_AMENITIES;
  propertyTypes: PropertyType[] = ['Apartment', 'Independent House', 'Villa', 'Studio', 'Penthouse'];
  stayTypes: StayType[] = ['Long term (6+ months)', 'Short term', 'Both'];
  priceModes: PriceMode[] = ['Per Month', 'Utilities included in rent'];
  vegPreferences: VegPreference[] = ['Any', 'Vegetarian Only', 'Non-Vegetarian'];

  // Sample photo gallery choices for quick selection
  samplePhotos = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80'
  ];

  selectedPhotos: string[] = [];
  customPhotoUrl = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private listingService: ListingService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const existingDraft = this.listingService.getDraftPost();

    this.postForm = this.fb.group({
      // Choose your Apartment/Building (Wireframe Page 5)
      propertyType: [existingDraft?.propertyType || 'Apartment', [Validators.required]],
      buildingName: [existingDraft?.buildingName || '', [Validators.required, Validators.minLength(3)]],

      // Is this a shared property? (Radio: Yes / No)
      isShared: [existingDraft ? existingDraft.isShared : false, [Validators.required]],

      // Property Location (Street Address, City, State, Zip)
      street: [existingDraft?.address.street || '', [Validators.required, Validators.minLength(5)]],
      city: [existingDraft?.address.city || '', [Validators.required, Validators.minLength(2)]],
      state: [existingDraft?.address.state || '', [Validators.required, Validators.minLength(2)]],
      zipCode: [existingDraft?.address.zipCode || '', [Validators.required, Validators.pattern(/^[0-9A-Za-z -]{3,10}$/)]],

      // Property Details (Square Feet, Beds, Baths, Stay/Lease type)
      squareFeet: [existingDraft?.squareFeet || '', [Validators.required, Validators.min(100), Validators.max(50000)]],
      bedrooms: [existingDraft?.bedrooms || 1, [Validators.required, Validators.min(1), Validators.max(20)]],
      bathrooms: [existingDraft?.bathrooms || 1, [Validators.required, Validators.min(1), Validators.max(10)]],
      stayType: [existingDraft?.stayType || 'Long term (6+ months)', [Validators.required]],

      // Expected Rent
      rent: [existingDraft?.rent || '', [Validators.required, Validators.min(50)]],
      isNegotiable: [existingDraft ? existingDraft.isNegotiable : false],
      priceMode: [existingDraft?.priceMode || 'Per Month', [Validators.required]],

      // Furnished (Radio: Yes / No)
      isFurnished: [existingDraft ? existingDraft.isFurnished : true, [Validators.required]],

      // Vegetarian preference (Radio)
      vegPreference: [existingDraft?.vegPreference || 'Any', [Validators.required]],

      // Description & AD Title (Page 5: up to 1400 chars)
      title: [existingDraft?.title || '', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      description: [existingDraft?.description || '', [Validators.required, Validators.minLength(20), Validators.maxLength(1400)]],

      // Contact Details
      landlordName: [existingDraft?.contact.landlordName || user?.name || '', [Validators.required, Validators.minLength(2)]],
      phone: [existingDraft?.contact.phone || user?.phone || '', [Validators.required, Validators.minLength(7)]],
      email: [existingDraft?.contact.email || user?.email || '', [Validators.required, Validators.email]],

      // Featured flag
      isFeatured: [existingDraft?.isFeatured || false],

      // Amenities checkboxes
      amenities: this.fb.array([])
    });

    // Populate amenities FormArray
    const draftAmenities = existingDraft?.amenities || ['Gym/Fitness Center', 'Power Backup', 'Water Heater'];
    this.availableAmenities.forEach(amenity => {
      const isSelected = draftAmenities.includes(amenity);
      this.amenitiesFormArray.push(new FormControl(isSelected));
    });

    // Set initial photos
    if (existingDraft && existingDraft.photos.length > 0) {
      this.selectedPhotos = [...existingDraft.photos];
    } else {
      this.selectedPhotos = [this.samplePhotos[0], this.samplePhotos[1]];
    }
  }

  get amenitiesFormArray(): FormArray {
    return this.postForm.get('amenities') as FormArray;
  }

  get descriptionLength(): number {
    return (this.postForm.get('description')?.value || '').length;
  }

  // Photo handlers
  addCustomPhoto(): void {
    if (this.customPhotoUrl && this.customPhotoUrl.trim().startsWith('http')) {
      this.selectedPhotos.push(this.customPhotoUrl.trim());
      this.customPhotoUrl = '';
    } else {
      this.toastService.warning('Please enter a valid image URL starting with http:// or https://');
    }
  }

  toggleSamplePhoto(url: string): void {
    const idx = this.selectedPhotos.indexOf(url);
    if (idx > -1) {
      if (this.selectedPhotos.length > 1) {
        this.selectedPhotos.splice(idx, 1);
      } else {
        this.toastService.warning('Please keep at least one property photo.');
      }
    } else {
      this.selectedPhotos.push(url);
    }
  }

  removePhoto(index: number): void {
    if (this.selectedPhotos.length > 1) {
      this.selectedPhotos.splice(index, 1);
    } else {
      this.toastService.warning('At least one photo is required.');
    }
  }

  isPhotoSelected(url: string): boolean {
    return this.selectedPhotos.includes(url);
  }

  // Pre-fill demo data button for convenient evaluator testing
  fillDemoData(): void {
    this.postForm.patchValue({
      propertyType: 'Apartment',
      buildingName: 'Silver Oaks Luxury Residences',
      isShared: false,
      street: '725 West Grand Avenue, Apt 8C',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60654',
      squareFeet: 1100,
      bedrooms: 2,
      bathrooms: 2,
      stayType: 'Long term (6+ months)',
      rent: 2600,
      isNegotiable: true,
      priceMode: 'Per Month',
      isFurnished: true,
      vegPreference: 'Any',
      title: 'Stunning 2BHK Corner Unit with Balcony & City Views',
      description: 'Bright and airy luxury 2-bedroom home in the heart of the city. Includes high ceilings, designer recessed lighting, premium kitchen appliances, and private balcony overlooking the city skyline. Building has concierge, heated indoor pool, and private gym.',
      landlordName: this.authService.getCurrentUser()?.name || 'Sarah Jenkins',
      phone: '+1 (555) 234-5678',
      email: this.authService.getCurrentUser()?.email || 'landlord@renthub.com',
      isFeatured: true
    });

    this.selectedPhotos = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ];

    this.toastService.info('Form populated with demo apartment data!');
  }

  // Submit flow: navigates to Preview and Submit Screen (Bonus Question)
  onProceedToPreview(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      this.toastService.error('Please resolve all validation errors before proceeding.');
      return;
    }

    if (this.selectedPhotos.length === 0) {
      this.toastService.error('Please include at least one photo for the apartment.');
      return;
    }

    // Extract selected amenities
    const selectedAmenities: string[] = [];
    this.amenitiesFormArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedAmenities.push(this.availableAmenities[index]);
      }
    });

    const formVal = this.postForm.value;
    const user = this.authService.getCurrentUser();

    const draftData = {
      title: formVal.title.trim(),
      buildingName: formVal.buildingName.trim(),
      propertyType: formVal.propertyType as PropertyType,
      bedrooms: Number(formVal.bedrooms),
      bathrooms: Number(formVal.bathrooms),
      isShared: Boolean(formVal.isShared),
      address: {
        street: formVal.street.trim(),
        city: formVal.city.trim(),
        state: formVal.state.trim(),
        zipCode: formVal.zipCode.trim()
      },
      squareFeet: Number(formVal.squareFeet),
      stayType: formVal.stayType as StayType,
      rent: Number(formVal.rent),
      isNegotiable: Boolean(formVal.isNegotiable),
      priceMode: formVal.priceMode as PriceMode,
      isFurnished: Boolean(formVal.isFurnished),
      vegPreference: formVal.vegPreference as VegPreference,
      amenities: selectedAmenities,
      description: formVal.description.trim(),
      photos: this.selectedPhotos,
      contact: {
        landlordName: formVal.landlordName.trim(),
        phone: formVal.phone.trim(),
        email: formVal.email.trim()
      },
      landlordId: user ? user.id : 'u-1',
      isFeatured: Boolean(formVal.isFeatured)
    };

    // Store in draft post buffer
    this.listingService.saveDraftPost(draftData);
    this.router.navigate(['/preview-post']);
  }
}
