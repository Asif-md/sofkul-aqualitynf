import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRecentComponent } from './delivery-recent.component';

describe('DeliveryRecentComponent', () => {
  let component: DeliveryRecentComponent;
  let fixture: ComponentFixture<DeliveryRecentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryRecentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
