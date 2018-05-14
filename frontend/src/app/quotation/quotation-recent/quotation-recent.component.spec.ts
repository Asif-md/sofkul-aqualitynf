import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationRecentComponent } from './quotation-recent.component';

describe('QuotationRecentComponent', () => {
  let component: QuotationRecentComponent;
  let fixture: ComponentFixture<QuotationRecentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationRecentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationRecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
