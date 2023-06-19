import { TestBed } from '@angular/core/testing'

import { TranslateClientService } from './translate.service'

describe('TranslateServiceService', () => {
  let service: TranslateClientService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TranslateClientService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
