import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateClientService } from 'src/app/services/translate-client.service'

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
})
export class CreateServiceComponent {
  readonly form = this.fb.nonNullable.group({
    serviceName: ['', Validators.required],
  })
  constructor(
    public dialogRef: MatDialogRef<CreateServiceComponent>,
    private fb: FormBuilder,
    private service: TranslateClientService,
    private snackBar: MatSnackBar
  ) {}

  createService(): void {
    this.form.markAllAsTouched()

    if (this.form.invalid) {
      return
    }

    const { serviceName } = this.form.getRawValue()

    this.service.createService(serviceName).subscribe({
      next: (v) => {
        this.snackBar.open('Service created!', undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000,
        })
        console.log(v)
        this.dialogRef.close(v)
      },

      error: (err) =>
        this.snackBar.open(`Something went wrong. ${err}`, undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000,
        }),
    })
  }
}
