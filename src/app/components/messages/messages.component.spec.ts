import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { of } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { mockListTranslationsResponse } from 'src/app/services/translate-client.service.spec'
import { spy } from '../services/services.component.spec'
import { MessagesComponent } from './messages.component'

describe('MessagesComponent', () => {
  let component: MessagesComponent
  let fixture: ComponentFixture<MessagesComponent>
  let translateClientServiceSpy: jasmine.SpyObj<TranslateClientService>
  let debugEl: DebugElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessagesComponent, NoopAnimationsModule],
      providers: [
        {
          provide: TranslateClientService,
          useValue: spy,
        },
      ],
    })
    fixture = TestBed.createComponent(MessagesComponent)
    component = fixture.componentInstance
    translateClientServiceSpy = TestBed.inject(TranslateClientService) as jasmine.SpyObj<TranslateClientService>
    component.filteredTranslations = mockListTranslationsResponse.translations
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  xit('should update Translation on focuout event and show snackbar', () => {
    translateClientServiceSpy.updateTranslation.and.returnValue(of())
    debugEl = fixture.debugElement.query(By.css('code'))
    const inputValue = 'test'
    debugEl.nativeElement.value = inputValue
    debugEl.triggerEventHandler('focusout', { target: debugEl.nativeElement })
    fixture.detectChanges()
  })
})
