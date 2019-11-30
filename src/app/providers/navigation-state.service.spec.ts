import { TestBed } from '@angular/core/testing';

import { NavigationStateService } from './navigation-state.service';

describe('NavigationStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigationStateService = TestBed.get(NavigationStateService);
    expect(service).toBeTruthy();
  });
});
