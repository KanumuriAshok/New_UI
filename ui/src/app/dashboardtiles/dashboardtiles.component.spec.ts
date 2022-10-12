import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardtilesComponent } from './dashboardtiles.component';

describe('DashboardtilesComponent', () => {
  let component: DashboardtilesComponent;
  let fixture: ComponentFixture<DashboardtilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardtilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardtilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
