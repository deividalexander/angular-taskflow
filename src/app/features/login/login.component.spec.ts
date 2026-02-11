import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth/auth.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Manual mock 
  const mockAuthService = {
    login: () => of('fake-token')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        // Provided a router empty to avoid fails 
        provideRouter([]), 
        // Inject the mock
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Sanity check to check the component create correctly 
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify forms start invalid
  it('should initialize with an invalid form', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  // verify the form is valid
  it('should be valid when filled correctly', () => {
    component.loginForm.controls['email'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('123456');
    
    expect(component.loginForm.valid).toBe(true);
  });
});