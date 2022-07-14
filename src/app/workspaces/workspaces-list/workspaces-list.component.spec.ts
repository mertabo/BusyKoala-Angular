import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacesListComponent } from './workspaces-list.component';

describe('WorkspacesListComponent', () => {
  let component: WorkspacesListComponent;
  let fixture: ComponentFixture<WorkspacesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspacesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspacesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
