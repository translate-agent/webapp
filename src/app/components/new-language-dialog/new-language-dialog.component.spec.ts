import { CommonModule } from '@angular/common'
import { DebugElement } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Translation } from '@buf/expect_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { of, throwError } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { spy } from '../services/services.component.spec'
import { NewLanguageDialogComponent } from './new-language-dialog.component'

describe('NewLanguageDialogComponent', () => {
  let component: NewLanguageDialogComponent
  let fixture: ComponentFixture<NewLanguageDialogComponent>
  let translateClientServiceSpy: jasmine.SpyObj<TranslateClientService>

  let buttondebug: DebugElement

  const mockResponse = new Translation({ language: 'lv', original: false, messages: [] })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        NewLanguageDialogComponent,
        NoopAnimationsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: of('test-id'),
        },
        {
          provide: TranslateClientService,
          useValue: spy,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLanguageDialogComponent)
    component = fixture.debugElement.componentInstance

    translateClientServiceSpy = TestBed.inject(TranslateClientService) as jasmine.SpyObj<TranslateClientService>

    buttondebug = fixture.debugElement.query(By.css('button[mat-raised-button]'))

    buttondebug.nativeElement.click()

    spyOn(component, 'add').and.callThrough()
    component.add()

    fixture.detectChanges()
  })

  it('should create', async () => {
    expect(component).toBeTruthy()
  })

  it('should have a form group with a language control', () => {
    expect(component.language).toBeDefined()
    expect(component.language.validator).toBeDefined()
  })

  it('should call the add method when the add button is clicked', () => {
    component.add()

    expect(component.add).toHaveBeenCalled()
  })

  describe('createTranslation', () => {
    beforeEach(() => {
      translateClientServiceSpy.createTranslation.and.returnValue(of(mockResponse))

      component.add()

      fixture.detectChanges()
    })
    it('should call the createTranslation method if the form is valid, close the dialog and show a snackbar', () => {
      expect(component.language.valid).toBeFalsy()

      component.language.setValue('lv')
      fixture.detectChanges()

      expect(component.language.valid).toBeTruthy()

      component.add()

      translateClientServiceSpy.createTranslation('test-id', 'lv')

      spyOn(component['snackBar'], 'open')
      component['snackBar'].open('Language added', undefined, { duration: 5000 })

      expect(translateClientServiceSpy.createTranslation).toHaveBeenCalledWith('test-id', 'lv')
      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1)
      expect(component['snackBar'].open).toHaveBeenCalledWith('Language added', undefined, { duration: 5000 })
    })
  })

  describe('error handling', () => {
    const error = 'An error occurred'

    beforeEach(() => {
      translateClientServiceSpy.createTranslation.and.returnValue(throwError(() => error))

      buttondebug.nativeElement.click()
      component.add()

      component.language.setValue('lv')

      fixture.detectChanges()
    })
    it('should show an error snackbar if the createTranslation method throws an error', () => {
      spyOn(component['snackBar'], 'open')
      component.add()

      component.language.setValue('lv')
      fixture.detectChanges()

      translateClientServiceSpy.createTranslation('test-id', 'lv').subscribe({
        error: (err) => {
          component['snackBar'].open(err, undefined, { duration: 5000 })

          expect(err).toEqual(error)

          expect(component['snackBar'].open).toHaveBeenCalledWith(error, undefined, {
            duration: 5000,
          })
        },
      })
    })
  })
})
