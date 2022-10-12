import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConnectionComponent } from './add-edit-connection.component';

describe('AddEditConnectionComponent', () => {
  let component: AddEditConnectionComponent;
  let fixture: ComponentFixture<AddEditConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditConnectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
