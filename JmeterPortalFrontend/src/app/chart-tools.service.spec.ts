import { TestBed } from '@angular/core/testing';

import { ChartToolsService } from './chart-tools.service';

describe('ChartToolsService', () => {
  let service: ChartToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
