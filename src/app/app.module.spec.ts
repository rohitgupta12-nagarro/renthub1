import { TestBed } from '@angular/core/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  let appModule: AppModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
    appModule = new AppModule();
  });

  it('should create the AppModule instance', () => {
    expect(appModule).toBeTruthy();
  });

  it('should compile the module without errors', () => {
    const moduleRef = TestBed.inject(AppModule);
    expect(moduleRef).toBeDefined();
  });
});

