import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHandelingComponent } from './project-handeling.component';

describe('ProjectHandelingComponent', () => {
  let component: ProjectHandelingComponent;
  let fixture: ComponentFixture<ProjectHandelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectHandelingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectHandelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
