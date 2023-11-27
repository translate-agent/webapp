import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
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
  readonly form = this.fb.nonNullable.group({
    serviceName: ['', Validators.required],
  })

  constructor(
    public dialogRef: MatDialogRef<CreateServiceComponent>,
    private fb: FormBuilder,
    private service: TranslateClientService,
    private snackBar: MatSnackBar,
  ) {}

  createService(): void {
    this.form.markAllAsTouched()

    if (this.form.invalid) {
      return
    }

    this.form.updateValueAndValidity()

    const { serviceName } = this.form.getRawValue()

    this.service.createService(serviceName).subscribe({
      next: (v) => {
        this.snackBar.open('Service created!', undefined, {
          duration: 5000,
        })
        console.log(v)
        this.dialogRef.close(v)
      },

      error: (err) =>
        this.snackBar.open(`Something went wrong. ${err}`, undefined, {
          duration: 5000,
        }),
    })
  }
}
