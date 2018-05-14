import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationHtmlComponent } from './quotation-html.component';

describe('QuotationHtmlComponent', () => {
  let component: QuotationHtmlComponent;
  let fixture: ComponentFixture<QuotationHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
