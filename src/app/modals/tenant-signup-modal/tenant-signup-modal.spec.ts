import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantSignupModal } from './tenant-signup-modal';

describe('TenantSignupModal', () => {
  let component: TenantSignupModal;
  let fixture: ComponentFixture<TenantSignupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantSignupModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantSignupModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
