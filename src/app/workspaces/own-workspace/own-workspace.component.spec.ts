import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnWorkspaceComponent } from './own-workspace.component';

describe('OwnWorkspaceComponent', () => {
  let component: OwnWorkspaceComponent;
  let fixture: ComponentFixture<OwnWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
