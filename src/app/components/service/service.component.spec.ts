import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DebugElement } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { By, Title } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { Service, Translation } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { of } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { mockListTranslationsResponse } from 'src/app/services/translate-client.service.spec'
import { NewLanguageDialogComponent } from '../new-language-dialog/new-language-dialog.component'
import { spy } from '../services/services.component.spec'
import { UploadTranslationFileComponent } from '../upload-translation-file/upload-translation-file.component'
import { ServiceComponent } from './service.component'

describe('ServiceComponent', () => {
  let component: ServiceComponent
  let fixture: ComponentFixture<ServiceComponent>
  let translateClientServiceSpy: jasmine.SpyObj<TranslateClientService>
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<UploadTranslationFileComponent>>
  let title: Title

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
    title = TestBed.inject(Title)
    translateClientServiceSpy = TestBed.inject(TranslateClientService) as jasmine.SpyObj<TranslateClientService>

    translateClientServiceSpy.listTranslations.and.returnValue(of(mockListTranslationsResponse.translations))

    translateClientServiceSpy.getService.and.returnValue(of(mockResponse))
    spyOn(title, 'setTitle')
    title.setTitle(mockResponse.name)

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set title service name', () => {
    expect(translateClientServiceSpy.getService).toHaveBeenCalled()
    expect(title.setTitle).toHaveBeenCalledWith(mockResponse.name)
  })

  it('should render tilte ', () => {
    spyOn(title, 'getTitle').and.returnValue(mockResponse.name)

    const titleElement = fixture.debugElement.query(By.css('h1.title'))
    fixture.detectChanges()
    expect(titleElement.nativeElement.textContent).toContain(mockResponse.name)
  })

  describe('openFileDownloadModal', () => {
    let button: DebugElement

    beforeEach(() => {
      button = fixture.debugElement.query(By.css('#fileDownloadButton'))

      const matDialogRefInstSpy = jasmine.createSpyObj('matDialogRefInstSpy', ['afterClosed', 'close'])
      matDialogRefInstSpy.componentInstance = jasmine.createSpyObj('componentInstance', ['download'])
      matDialogRefInstSpy.componentInstance.download.and.returnValue(of(true))

      matDialogRefSpy = jasmine.createSpyObj('matDialogRefSpy', ['afterClosed'])
      matDialogRefSpy.afterClosed.and.returnValue(of())
      matDialogRefSpy.componentInstance = matDialogRefInstSpy

      spyOn(component.dialog, 'open').and.returnValue(matDialogRefSpy)

      button.nativeElement.click()
      fixture.detectChanges()
    })
    it('should call openFileDownloadModal after button click', () => {
      spyOn(component, 'openFileDownloadModal')

      component.openFileDownloadModal()
      expect(component.openFileDownloadModal).toHaveBeenCalled()
    })

    it('should open modal with componentInstance.download true', () => {
      const mockData = { id: '1', name: 'test' }
      spyOn(component, 'openFileDownloadModal')

      component.openFileDownloadModal()
      component.dialog.open(UploadTranslationFileComponent, {
        width: '500px',
        data: of(mockData.id),
      })

      expect(component.dialog.open).toHaveBeenCalled()
      expect(matDialogRefSpy.componentInstance.download).toBeTrue()
    })
  })

  describe('openFileUploadModal', () => {
    let button: DebugElement
    beforeEach(() => {
      button = fixture.debugElement.query(By.css('#fileUploadButton'))

      const matDialogRefInstSpy = jasmine.createSpyObj('matDialogRefInstSpy', ['afterClosed', 'close'])
      matDialogRefInstSpy.componentInstance = jasmine.createSpyObj('componentInstance', ['download'])
      matDialogRefInstSpy.componentInstance.download.and.returnValue(of(false))

      matDialogRefSpy = jasmine.createSpyObj('matDialogRefSpy', ['afterClosed'])
      matDialogRefSpy.afterClosed.and.returnValue(of({}))
      matDialogRefSpy.componentInstance = matDialogRefInstSpy

      button.nativeElement.click()

      spyOn(component, 'openFileUploadModal').and.callThrough()
      spyOn(component.dialog, 'open').and.returnValue(matDialogRefSpy)

      fixture.detectChanges()
    })
    it('should call openFileUploadModal after button click', () => {
      component.openFileUploadModal()
      expect(component.openFileUploadModal).toHaveBeenCalled()
    })

    it('should open modal', () => {
      const mockData = { id: '1', name: 'test' }

      component.openFileDownloadModal()

      component.dialog.open(UploadTranslationFileComponent, {
        data: of(mockData.id),
      })

      expect(component.dialog.open).toHaveBeenCalled()
      expect(component.dialog.open).toHaveBeenCalled()
    })
  })

  describe('addLanguage', () => {
    const mockData = { id: '1', name: 'test' }
    let button: DebugElement
    beforeEach(() => {
      button = fixture.debugElement.query(By.css('#addLanguageButton'))

      spyOn(component, 'addLanguage').and.callThrough()

      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(new Translation({ language: 'lv', original: false, messages: [] })),
      } as MatDialogRef<NewLanguageDialogComponent>)
      button.nativeElement.click()

      fixture.detectChanges()
    })
    it('should call addLanguage', () => {
      component.addLanguage()
      expect(component.addLanguage).toHaveBeenCalled()
    })

    it('should open add language dialog component', () => {
      component.addLanguage()

      component.dialog.open(NewLanguageDialogComponent, { data: of(mockData.id), width: '400px' })

      expect(component.dialog.open).toHaveBeenCalled()
    })
  })
})
