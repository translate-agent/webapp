import { CommonModule } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { Service } from '@buf/expect_translate-agent.bufbuild_es/translate/v1/translate_pb'

@Component({
  selector: 'app-dialog-delete',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './dialog-delete.component.html',
  styleUrl: './dialog-delete.component.scss',
})
export class DialogDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public service: Service) {}
}
