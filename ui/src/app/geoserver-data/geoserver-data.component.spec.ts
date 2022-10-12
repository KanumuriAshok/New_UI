import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoserverDataComponent } from './geoserver-data.component';

describe('GeoserverDataComponent', () => {
  let component: GeoserverDataComponent;
  let fixture: ComponentFixture<GeoserverDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoserverDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoserverDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
