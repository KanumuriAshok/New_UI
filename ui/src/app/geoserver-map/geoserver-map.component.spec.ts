import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoserverMapComponent } from './geoserver-map.component';

describe('GeoserverMapComponent', () => {
  let component: GeoserverMapComponent;
  let fixture: ComponentFixture<GeoserverMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoserverMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoserverMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
