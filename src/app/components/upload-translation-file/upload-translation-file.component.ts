/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@angular/common'
import { Component, HostListener, Inject, Input, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatOptionModule } from '@angular/material/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Schema } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Observable, map, shareReplay } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'

const schemas = {
  JSON_NG_LOCALIZE: Schema.JSON_NG_LOCALIZE,
  JSON_NGX_TRANSLATE: Schema.JSON_NGX_TRANSLATE,
  GO: Schema.GO,
  ARB: Schema.ARB,
  POT: Schema.POT,
  XLIFF_12: Schema.XLIFF_12,
  XLIFF_2: Schema.XLIFF_2,
}

@Component({
  selector: 'app-upload-translation-file',
  templateUrl: './upload-translation-file.component.html',
  styleUrl: './upload-translation-file.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatToolbarModule,
  ],
})
export class UploadTranslationFileComponent implements OnInit {
  @Input() download = false

  readonly form = this.fb.nonNullable.group({
    language: ['', Validators.required],
    schema: this.fb.nonNullable.control<Schema | undefined>(undefined, Validators.required),
    original: false,
    populateTranslations: false,
  })

  readonly serviceList = this.service.listService().pipe(
    map((v) => v.services),
    shareReplay(1),
  )

  file!: File | null

  dragAreaClass!: string

  readonly schema = schemas

  show = false

  serviceId: string | null = null

  languages!: string[]

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  constructor(
    private fb: FormBuilder,
    private service: TranslateClientService,
    private dialogRef: MatDialogRef<UploadTranslationFileComponent>,
    @Inject(MAT_DIALOG_DATA) public id: Observable<string>,
    private snackBar: MatSnackBar,
  ) {}

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    this.dragAreaClass = 'droparea'
    event.preventDefault()
  }
  @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent) {
    this.dragAreaClass = 'droparea'
    event.preventDefault()
  }
  @HostListener('dragend', ['$event']) onDragEnd(event: DragEvent) {
    this.dragAreaClass = 'dropzone'
    event.preventDefault()
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    this.dragAreaClass = 'dropzone'
    event.preventDefault()
  }
  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    this.dragAreaClass = 'dropzone'
    event.preventDefault()
    event.stopPropagation()
    if (event.dataTransfer?.files) {
      const files: FileList = event.dataTransfer.files
      this.file = files[0]
      this.show = true
    }
  }

  ngOnInit(): void {
    this.dragAreaClass = 'dropzone'

    this.id.subscribe((id) => (this.serviceId = id))

    this.service
      .listTranslations(this.serviceId!)
      .pipe(map((v) => v.translations.map((translation) => translation.language)))
      .subscribe((v) => (this.languages = v))
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement

    this.file = inputElement.files![0]

    this.show = true
  }

  async upload() {
    const { language, original, populateTranslations, schema } = this.form.getRawValue()

    const buffer = await this.file!.arrayBuffer()

    const data = new Uint8Array(buffer)

    this.service
      .uploadTranslationFile(data, language, schema, original, this.serviceId!, populateTranslations)
      .subscribe({
        next: (v) => {
          this.dialogRef.close(v)
          this.snackBar.open('File succesful uploaded', undefined, {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 5000,
          })
        },
        error: (err) => console.log(err),
      })
  }

  downloadFile() {
    this.form.markAllAsTouched()

    if (this.form.invalid) {
      return
    }

    const { language, schema } = this.form.getRawValue()

    this.service.downloadTranslationFile(language, schema!, this.serviceId!).subscribe({
      next: (v) => {
        const blob = new Blob([v.data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${language}.${this.fileFormat(schema!)}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)

        this.dialogRef.close()

        this.snackBar.open('Download completed', undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
        })
      },
      error: (err) => {
        this.snackBar.open('An error occurred during the download process.', undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
        })
        console.log(err)
      },
    })
  }

  fileFormat(schema: Schema): string | undefined {
    switch (schema) {
      case Schema.POT:
        return 'po'
      case Schema.JSON_NGX_TRANSLATE:
        return 'json'
      case Schema.JSON_NG_LOCALIZE:
        return 'json'
      case Schema.ARB:
        return 'arb'
      case Schema.GO:
        return 'go'
      case Schema.XLIFF_12:
        return 'xlf'
      case Schema.XLIFF_2:
        return 'xlf'
      default:
        return
    }
  }
}
