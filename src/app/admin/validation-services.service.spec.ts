import { TestBed } from '@angular/core/testing';

import { ValidationServicesService } from './validation-services.service';

describe('ValidationServicesService', () => {
  let service: ValidationServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
