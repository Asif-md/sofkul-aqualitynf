import { TestBed, inject } from '@angular/core/testing';

import { ProformaService } from './proforma.service';

describe('ProformaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProformaService]
    });
  });

  it('should ...', inject([ProformaService], (service: ProformaService) => {
    expect(service).toBeTruthy();
  }));
});
