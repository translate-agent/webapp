import { CommonModule } from '@angular/common'
import { Component, Inject, Input } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Service } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { TranslateClientService } from 'src/app/services/translate-client.service'

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrl: './create-service.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
})
export class CreateServiceComponent {
  @Input() edit = false

  readonly form = this.fb.nonNullable.group({
    serviceName: [this.data ? this.data.name : '', Validators.required],
  })

  constructor(
    public dialogRef: MatDialogRef<CreateServiceComponent>,
    private fb: FormBuilder,
    private service: TranslateClientService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Service,
  ) {}

  createService(): void {
    this.form.markAllAsTouched()

    if (this.form.invalid) {
      return
    }

    this.form.updateValueAndValidity()

    const { serviceName } = this.form.getRawValue()

    if (this.edit && this.data.name !== serviceName) {
      this.service.updateService(this.data.id, serviceName).subscribe({
        next: (v) => {
          this.snackBar.open('Service updated!', undefined, {
            duration: 5000,
          })
          this.dialogRef.close(v)
        },

        error: (err) => {
          this.snackBar.open(`Something went wrong. ${err}`, undefined, {
            duration: 5000,
          }),
            this.dialogRef.close()
        },
      })
      return
    }

    if (!this.edit) {
      this.service.createService(serviceName).subscribe({
        next: (v) => {
          this.snackBar.open('Service created!', undefined, {
            duration: 5000,
          })

          this.dialogRef.close(v)
        },

        error: (err) => {
          this.snackBar.open(`Something went wrong. ${err}`, undefined, {
            duration: 5000,
          })
          this.dialogRef.close()
        },
      })
    }
  }
}
