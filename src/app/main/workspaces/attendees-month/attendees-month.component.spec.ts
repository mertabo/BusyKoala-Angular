import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesMonthComponent } from './attendees-month.component';

describe('AttendeesMonthComponent', () => {
  let component: AttendeesMonthComponent;
  let fixture: ComponentFixture<AttendeesMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendeesMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendeesMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
