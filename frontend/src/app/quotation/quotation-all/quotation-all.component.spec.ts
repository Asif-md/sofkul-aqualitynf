import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationAllComponent } from './quotation-all.component';

describe('QuotationAllComponent', () => {
  let component: QuotationAllComponent;
  let fixture: ComponentFixture<QuotationAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
