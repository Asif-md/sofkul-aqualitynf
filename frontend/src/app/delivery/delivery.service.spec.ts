import { TestBed, inject } from '@angular/core/testing';

import { DeliveryService } from './delivery.service';

describe('DeliveryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryService]
    });
  });

  it('should ...', inject([DeliveryService], (service: DeliveryService) => {
    expect(service).toBeTruthy();
  }));
});
