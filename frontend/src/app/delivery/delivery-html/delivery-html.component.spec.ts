import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryHtmlComponent } from './delivery-html.component';

describe('DeliveryHtmlComponent', () => {
  let component: DeliveryHtmlComponent;
  let fixture: ComponentFixture<DeliveryHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
