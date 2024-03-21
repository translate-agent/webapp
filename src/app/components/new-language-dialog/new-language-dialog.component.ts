import { CommonModule } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
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
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private serviceId: string,
  ) {}

  add(): void {
    this.language.markAllAsTouched()

    if (this.language.invalid) {
      return
    }
    const language = this.language.getRawValue()

    this.service.createTranslation(this.serviceId, language).subscribe({
      next: (v) => {
        this.dialogRef.close(v)
        this.snackBar.open('Successfully added new language', undefined, {
          duration: 5000,
        })
      },
      error: (err) => {
        this.dialogRef.close()
        this.snackBar.open(`Something went wrong. ${err}`, undefined, {
          duration: 5000,
        })
      },
    })
  }
}
