import { CommonModule } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Observable } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'

@Component({
  selector: 'app-new-language-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './new-language-dialog.component.html',
  styleUrl: './new-language-dialog.component.scss',
})
export class NewLanguageDialogComponent {
  readonly language = this.fb.nonNullable.control('', Validators.required)

  constructor(
    private fb: FormBuilder,
    private service: TranslateClientService,
    private dialogRef: MatDialogRef<NewLanguageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<string>,
  ) {}

  add() {
    this.language.markAllAsTouched()

    if (this.language.invalid) {
      return
    }
    const language = this.language.getRawValue()

    this.data.subscribe((v) => {
      this.service.createTranslation(v, language).subscribe({
        next: (v) => {
          this.dialogRef.close(v)
        },
        error: (err) => {
          console.log(err)
          this.dialogRef.close()
        },
      })
    })
  }
}
