import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionHandelingComponent } from './connection-handeling.component';

describe('ConnectionHandelingComponent', () => {
  let component: ConnectionHandelingComponent;
  let fixture: ComponentFixture<ConnectionHandelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionHandelingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionHandelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
