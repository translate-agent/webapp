import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MatDialogRef } from '@angular/material/dialog'
import { Title } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { Service } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { of } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { mockListTranslationsResponse } from 'src/app/services/translate-client.service.spec'
import { spy } from '../services/services.component.spec'
import { UploadTranslationFileComponent } from '../upload-translation-file/upload-translation-file.component'
import { ServiceComponent } from './service.component'

describe('ServiceComponent', () => {
  let component: ServiceComponent
  let fixture: ComponentFixture<ServiceComponent>
  let serviceSpy: jasmine.SpyObj<TranslateClientService>
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<UploadTranslationFileComponent>>

  const mockResponse = new Service({ id: '1', name: 'test' })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        Title,
        {
          provide: TranslateClientService,
          useValue: spy,
        },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
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
