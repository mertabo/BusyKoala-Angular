import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherWorkspaceComponent } from './other-workspace.component';

describe('OtherWorkspaceComponent', () => {
  let component: OtherWorkspaceComponent;
  let fixture: ComponentFixture<OtherWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
