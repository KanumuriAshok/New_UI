import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputHandelingComponent } from './input-handeling.component';

describe('InputHandelingComponent', () => {
  let component: InputHandelingComponent;
  let fixture: ComponentFixture<InputHandelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputHandelingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputHandelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
