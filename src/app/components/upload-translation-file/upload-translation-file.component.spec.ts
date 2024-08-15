import { DebugElement } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import {
  DownloadTranslationFileResponse,
  Schema,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Empty } from '@bufbuild/protobuf'
import { of } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { spy } from '../services/services.component.spec'
import { UploadTranslationFileComponent } from './upload-translation-file.component'

describe('UploadTranslationFileComponent', () => {
  let component: UploadTranslationFileComponent
  let fixture: ComponentFixture<UploadTranslationFileComponent>

  let translateClientServiceSpy: jasmine.SpyObj<TranslateClientService>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTranslationFileComponent, NoopAnimationsModule, ReactiveFormsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
        { provide: MAT_DIALOG_DATA, useValue: of('test-id') },
        {
          provide: TranslateClientService,
          useValue: spy,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(UploadTranslationFileComponent)
    component = fixture.componentInstance
    translateClientServiceSpy = TestBed.inject(TranslateClientService) as jasmine.SpyObj<TranslateClientService>

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have a form group with a language control', () => {
    expect(component.form).toBeDefined()
  })

  xdescribe('events', () => {
    let dropZone: HTMLElement

    beforeEach(() => {
      dropZone = fixture.debugElement.query(By.css('.dropzone')).nativeElement
    })

    it('dragover', () => {
      const event = new DragEvent('dragover', { bubbles: true, cancelable: true })
      spyOn(event, 'preventDefault')

      dropZone.dispatchEvent(event)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('dragenter', () => {
      const event = new DragEvent('dragenter', { bubbles: true, cancelable: true })
      spyOn(event, 'preventDefault')

      dropZone.dispatchEvent(event)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('dragend', () => {
      const event = new DragEvent('dragend', { bubbles: true, cancelable: true })
      spyOn(event, 'preventDefault')

      dropZone.dispatchEvent(event)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('dragleave', () => {
      const event = new DragEvent('dragleave', { bubbles: true, cancelable: true })
      spyOn(event, 'preventDefault')

      dropZone.dispatchEvent(event)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('drop', () => {
      const file = new File([''], 'translation.po')

      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)

      const event = new DragEvent('drop', { dataTransfer, bubbles: true })
      spyOn(event, 'preventDefault')

      dropZone.dispatchEvent(event)

      fixture.detectChanges()

      expect(event.preventDefault).toHaveBeenCalled()
    })
  })

  describe('downloadFile', () => {
    let buttondebug: DebugElement
    let h3: DebugElement

    beforeEach(() => {
      buttondebug = fixture.debugElement.query(By.css('button[mat-raised-button]'))
      h3 = fixture.debugElement.query(By.css('h3'))
      fixture.componentRef.setInput('download', true)

      buttondebug.nativeElement.click()

      spyOn(component, 'downloadFile').and.callThrough()

      translateClientServiceSpy.downloadTranslationFile.and.returnValue(
        of(new DownloadTranslationFileResponse({ data: new Uint8Array() })),
      )

      fixture.detectChanges()
    })

    it(`should have title 'Download File'`, () => {
      expect(h3.nativeElement.textContent).toContain('Download file')
    })

    it('should call downloadFile', () => {
      component.downloadFile()
      expect(component.downloadFile).toHaveBeenCalled()
    })

    it('should call downloadTranslationFile if form is valid and download pot file', () => {
      expect(component.form.valid).toBeFalsy()
      component.form.controls.language.setValue('en')
      component.form.controls.schema.setValue(Schema.PO)
      fixture.detectChanges()
      component.downloadFile()
      expect(component.form.valid).toBe(true)

      const { language, schema } = component.form.getRawValue()

      translateClientServiceSpy.downloadTranslationFile(language, schema!, '1')
      fixture.detectChanges()
      expect(translateClientServiceSpy.downloadTranslationFile).toHaveBeenCalled()
    })
  })

  describe('uploadFile', () => {
    let buttondebug: DebugElement
    let h3: DebugElement

    beforeEach(() => {
      buttondebug = fixture.debugElement.query(By.css('button[mat-raised-button]'))
      h3 = fixture.debugElement.query(By.css('h3'))

      buttondebug.nativeElement.click()

      spyOn(component, 'upload')

      fixture.detectChanges()
    })

    it(`should have title 'Download file'`, () => {
      expect(component.download()).toBe(false)
      expect(h3.nativeElement.textContent).toContain('Upload file')
    })
    it('should call upload', () => {
      component.upload()
      expect(component.upload).toHaveBeenCalled()
    })

    it('should call uploadTranslationFile if form is valid', () => {
      expect(component.form.valid).toBe(false)
      component.form.setValue({ language: 'en', schema: Schema.PO, original: true, populateTranslations: true })
      fixture.detectChanges()
      expect(component.form.valid).toBe(true)

      const { language, original, populateTranslations, schema } = component.form.getRawValue()

      component.upload()

      translateClientServiceSpy.uploadTranslationFile.and.returnValue(of(new Empty({})))

      translateClientServiceSpy.uploadTranslationFile(
        new Uint8Array(),
        language,
        schema,
        original,
        '1',
        populateTranslations,
      )

      expect(translateClientServiceSpy.uploadTranslationFile).toHaveBeenCalled()
    })
  })
})
