import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { of } from 'rxjs'
import { UploadTranslationFileComponent } from './upload-translation-file.component'

describe('UploadTranslationFileComponent', () => {
  let component: UploadTranslationFileComponent
  let fixture: ComponentFixture<UploadTranslationFileComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTranslationFileComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: of('test-id') },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(UploadTranslationFileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
