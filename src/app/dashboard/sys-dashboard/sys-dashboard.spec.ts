import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysDashboard } from './sys-dashboard';

describe('SysDashboard', () => {
  let component: SysDashboard;
  let fixture: ComponentFixture<SysDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
