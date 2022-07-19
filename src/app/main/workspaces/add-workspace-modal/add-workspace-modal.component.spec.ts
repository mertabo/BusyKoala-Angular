import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkspaceModalComponent } from './add-workspace-modal.component';

describe('AddWorkspaceModalComponent', () => {
  let component: AddWorkspaceModalComponent;
  let fixture: ComponentFixture<AddWorkspaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkspaceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkspaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
