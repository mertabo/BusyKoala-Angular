import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesTodayComponent } from './attendees-today.component';

describe('AttendeesTodayComponent', () => {
  let component: AttendeesTodayComponent;
  let fixture: ComponentFixture<AttendeesTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendeesTodayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeesTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
