import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacesChildComponent } from './workspaces-child.component';

describe('WorkspacesChildComponent', () => {
  let component: WorkspacesChildComponent;
  let fixture: ComponentFixture<WorkspacesChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspacesChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspacesChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
