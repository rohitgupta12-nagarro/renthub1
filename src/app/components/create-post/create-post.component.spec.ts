import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { CreatePostComponent } from './create-post.component';
import { ListingService } from '../../services/listing.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let router: Router;
  let listingService: ListingService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      declarations: [CreatePostComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        ListingService,
        AuthService,
        ToastService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    listingService = TestBed.inject(ListingService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create CreatePostComponent and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.postForm).toBeDefined();
    expect(component.postForm.get('propertyType')).toBeDefined();
    expect(component.postForm.get('buildingName')).toBeDefined();
    expect(component.postForm.get('street')).toBeDefined();
    expect(component.postForm.get('rent')).toBeDefined();
  });

  it('should validate required fields', () => {
    component.postForm.patchValue({
      buildingName: '',
      street: '',
      city: '',
      rent: null,
      title: '',
      description: ''
    });

    expect(component.postForm.valid).toBe(false);
    expect(component.postForm.get('buildingName')?.valid).toBe(false);
    expect(component.postForm.get('street')?.valid).toBe(false);
    expect(component.postForm.get('rent')?.valid).toBe(false);
  });

  it('should populate form when quick fill demo data is clicked', () => {
    component.fillDemoData();
    expect(component.postForm.valid).toBe(true);
    expect(component.postForm.get('buildingName')?.value).toContain('Silver Oaks');
    expect(component.postForm.get('rent')?.value).toBe(28000);
  });

  it('should save draft post and navigate to preview on valid submit', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.fillDemoData();

    component.onProceedToPreview();

    expect(navigateSpy).toHaveBeenCalledWith(['/preview-post']);
    const savedDraft = listingService.getDraftPost();
    expect(savedDraft).toBeDefined();
    expect(savedDraft?.buildingName).toContain('Silver Oaks');
  });

  it('should only allow numbers for zip code', () => {
    component.postForm.get('zipCode')?.setValue('12345');
    expect(component.postForm.get('zipCode')?.valid).toBe(true);

    component.postForm.get('zipCode')?.setValue('ABCDE');
    expect(component.postForm.get('zipCode')?.valid).toBe(false);

    component.postForm.get('zipCode')?.setValue('12-34');
    expect(component.postForm.get('zipCode')?.valid).toBe(false);
  });

  it('should allow adding custom photo URLs and remove them', () => {
    component.selectedPhotos = [];
    component.customPhotoUrl = 'https://example.com/apartment1.jpg';
    component.addCustomPhoto();

    expect(component.selectedPhotos.length).toBe(1);
    expect(component.selectedPhotos[0]).toBe('https://example.com/apartment1.jpg');
    expect(component.customPhotoUrl).toBe('');

    component.removePhoto(0);
    expect(component.selectedPhotos.length).toBe(0);
  });
});

