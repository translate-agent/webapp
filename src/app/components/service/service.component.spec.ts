import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Title } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { Service } from '@buf/expect_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { of } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { mockListTranslationsResponse } from 'src/app/services/translate-client.service.spec'
import { spy } from '../services/services.component.spec'
import { ServiceComponent } from './service.component'

describe('ServiceComponent', () => {
  let component: ServiceComponent
  let fixture: ComponentFixture<ServiceComponent>
  let serviceSpy: jasmine.SpyObj<TranslateClientService>

  const mockResponse = new Service({ id: '1', name: 'test' })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterModule.forRoot([]), ServiceComponent],
      providers: [
        Title,
        {
          provide: TranslateClientService,
          useValue: spy,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ServiceComponent)
    component = fixture.componentInstance

    serviceSpy = TestBed.inject(TranslateClientService) as jasmine.SpyObj<TranslateClientService>
    serviceSpy.listTranslations.and.returnValue(of(mockListTranslationsResponse.translations))
    serviceSpy.getService.and.returnValue(of(mockResponse))

    fixture.componentRef.setInput('id', mockResponse.id)

    fixture.detectChanges()
    // await fixture.whenStable()
    // TestBed.flushEffects()

    console.log(fixture.isStable(), fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should fetch service', () => {
    expect(serviceSpy.getService).toHaveBeenCalled()
  })
})
