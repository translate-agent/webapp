import { CommonModule } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Service } from '@buf/expect_translate-agent.bufbuild_es/translate/v1/translate_pb'

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
    serviceName: [this.data?.name || '', Validators.required],
  })

  constructor(
    public dialogRef: MatDialogRef<CreateServiceComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Service,
  ) {}

  confirm(): void {
    this.form.markAllAsTouched()

    if (this.form.invalid) {
      return
    }

    this.form.updateValueAndValidity()

    const { serviceName } = this.form.getRawValue()

    this.dialogRef.close(serviceName)
  }
}
