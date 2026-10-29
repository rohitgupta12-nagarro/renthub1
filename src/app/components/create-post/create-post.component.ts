import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AVAILABLE_AMENITIES, PropertyType, StayType, PriceMode, VegPreference, Apartment } from '../../models/apartment.model';

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

  // Edit Mode state (Requirement 1)
  isEditMode = false;
  editingApartmentId: string | null = null;

  selectedPhotos: string[] = [];
  customPhotoUrl = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private listingService: ListingService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const existingDraft = this.listingService.getDraftPost();

    // Check for edit mode (Requirement 1)
    const editId = this.route.snapshot.queryParamMap.get('edit') || this.route.snapshot.paramMap.get('id');
    let existingListing: Apartment | undefined;
    if (editId) {
      existingListing = this.listingService.getListingById(editId);
      if (existingListing) {
        this.isEditMode = true;
        this.editingApartmentId = editId;
      }
    }

    const sourceData = existingListing || existingDraft;

    this.postForm = this.fb.group({
      // Choose your Apartment/Building (Wireframe Page 5)
      propertyType: [sourceData?.propertyType || 'Apartment', [Validators.required]],
      buildingName: [sourceData?.buildingName || '', [Validators.required, Validators.minLength(3)]],

      // Is this a shared property? (Radio: Yes / No)
      isShared: [sourceData ? sourceData.isShared : false, [Validators.required]],

      // Property Location (Street Address, City, State, Zip)
      street: [sourceData?.address.street || '', [Validators.required, Validators.minLength(5)]],
      city: [sourceData?.address.city || '', [Validators.required, Validators.minLength(2)]],
      state: [sourceData?.address.state || '', [Validators.required, Validators.minLength(2)]],
      // Requirement 2: Only number allowed for zip code (4 to 10 digits)
      zipCode: [sourceData?.address.zipCode || '', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(4), Validators.maxLength(10)]],

      // Property Details (Square Feet, Beds, Baths, Stay/Lease type)
      squareFeet: [sourceData?.squareFeet || '', [Validators.required, Validators.min(100), Validators.max(50000)]],
      bedrooms: [sourceData?.bedrooms || 1, [Validators.required, Validators.min(1), Validators.max(20)]],
      bathrooms: [sourceData?.bathrooms || 1, [Validators.required, Validators.min(1), Validators.max(10)]],
      stayType: [sourceData?.stayType || 'Long term (6+ months)', [Validators.required]],

      // Expected Rent
      rent: [sourceData?.rent || '', [Validators.required, Validators.min(50)]],
      isNegotiable: [sourceData ? sourceData.isNegotiable : false],
      priceMode: [sourceData?.priceMode || 'Per Month', [Validators.required]],

      // Furnished (Radio: Yes / No)
      isFurnished: [sourceData ? sourceData.isFurnished : true, [Validators.required]],

      // Vegetarian preference (Radio)
      vegPreference: [sourceData?.vegPreference || 'Any', [Validators.required]],

      // Description & AD Title (Page 5: up to 1400 chars)
      title: [sourceData?.title || '', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      description: [sourceData?.description || '', [Validators.required, Validators.minLength(20), Validators.maxLength(1400)]],

      // Contact Details
      landlordName: [sourceData?.contact.landlordName || user?.name || '', [Validators.required, Validators.minLength(2)]],
      phone: [sourceData?.contact.phone || user?.phone || '', [Validators.required, Validators.minLength(7)]],
      email: [sourceData?.contact.email || user?.email || '', [Validators.required, Validators.email]],

      // Featured flag
      isFeatured: [sourceData?.isFeatured || false],

      // Amenities checkboxes
      amenities: this.fb.array([])
    });

    // Populate amenities FormArray
    const draftAmenities = existingListing ? existingListing.amenities : (existingDraft?.amenities || []);
    this.availableAmenities.forEach(amenity => {
      const isSelected = draftAmenities.includes(amenity);
      this.amenitiesFormArray.push(new FormControl(isSelected));
    });

    // Requirement 3: Use custom URL option and don't show pre-selected images
    if (existingListing && existingListing.photos.length > 0) {
      this.selectedPhotos = [...existingListing.photos];
    } else if (existingDraft && existingDraft.photos.length > 0) {
      this.selectedPhotos = [...existingDraft.photos];
    } else {
      this.selectedPhotos = [];
    }
  }

  get amenitiesFormArray(): FormArray {
    return this.postForm.get('amenities') as FormArray;
  }

  get descriptionLength(): number {
    return (this.postForm.get('description')?.value || '').length;
  }

  // Requirement 2: Number only keypress and input sanitization for Zip Code
  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  onZipInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/\D/g, '');
    if (input.value !== sanitized) {
      input.value = sanitized;
      this.postForm.get('zipCode')?.setValue(sanitized);
    }
  }

  // Requirement 3: Custom Photo URL handlers
  addCustomPhoto(): void {
    const url = this.customPhotoUrl?.trim();
    if (!url) {
      this.toastService.warning('Please enter an image URL.');
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      this.toastService.warning('Please enter a valid image URL starting with http:// or https://');
      return;
    }
    if (this.selectedPhotos.includes(url)) {
      this.toastService.info('This image URL has already been added.');
      return;
    }
    this.selectedPhotos.push(url);
    this.customPhotoUrl = '';
    this.toastService.success('Photo added successfully!');
  }

  removePhoto(index: number): void {
    this.selectedPhotos.splice(index, 1);
  }

  insertSampleUrl(): void {
    this.customPhotoUrl = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80';
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
      rent: 28000,
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
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ];

    this.toastService.info('Form populated with demo apartment data!');
  }

  cancel(): void {
    if (this.isEditMode && this.editingApartmentId) {
      this.router.navigate(['/listings', this.editingApartmentId]);
    } else {
      this.router.navigate(['/']);
    }
  }

  // Requirement 1: Save updates for existing listing
  onSaveUpdates(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      this.toastService.error('Please resolve all validation errors before saving.');
      return;
    }

    if (this.selectedPhotos.length === 0) {
      this.toastService.warning('Please add at least one custom photo URL for the apartment.');
      return;
    }

    const selectedAmenities: string[] = [];
    this.amenitiesFormArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedAmenities.push(this.availableAmenities[index]);
      }
    });

    const formVal = this.postForm.value;
    const updates: Partial<Apartment> = {
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
      photos: [...this.selectedPhotos],
      contact: {
        landlordName: formVal.landlordName.trim(),
        phone: formVal.phone.trim(),
        email: formVal.email.trim()
      },
      isFeatured: Boolean(formVal.isFeatured)
    };

    if (this.editingApartmentId) {
      this.listingService.updateListing(this.editingApartmentId, updates);
      this.router.navigate(['/listings', this.editingApartmentId]);
    }
  }

  // Submit flow: navigates to Preview and Submit Screen (Bonus Question)
  onProceedToPreview(): void {
    if (this.isEditMode) {
      this.onSaveUpdates();
      return;
    }

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      this.toastService.error('Please resolve all validation errors before proceeding.');
      return;
    }

    if (this.selectedPhotos.length === 0) {
      this.toastService.error('Please add at least one custom photo URL for the apartment.');
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

