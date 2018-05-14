import { TestBed, inject } from '@angular/core/testing';

import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileUploadService]
    });
  });

  it('should ...', inject([FileUploadService], (service: FileUploadService) => {
    expect(service).toBeTruthy();
  }));
});
