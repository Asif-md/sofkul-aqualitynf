import { TestBed, inject } from '@angular/core/testing';

import { QuotationService } from './quotation.service';

describe('QuotationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotationService]
    });
  });

  it('should ...', inject([QuotationService], (service: QuotationService) => {
    expect(service).toBeTruthy();
  }));
});
