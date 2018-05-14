import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAllComponent } from './delivery-all.component';

describe('DeliveryAllComponent', () => {
  let component: DeliveryAllComponent;
  let fixture: ComponentFixture<DeliveryAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
