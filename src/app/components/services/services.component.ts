import { NgFor, NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { Router, RouterLink } from '@angular/router'
import { Service } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { CreateServiceComponent } from '../create-service/create-service.component'

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatButtonModule,
    MatListModule,
    NgFor,
    MatDividerModule,
    RouterLink,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class ServicesComponent implements OnInit {
  services: Service[] = []

  constructor(
    public dialog: MatDialog,
    private service: TranslateClientService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log()

    this.service.listService().subscribe((v) => (this.services = v.services))
  }

  createService() {
    this.dialog
      .open(CreateServiceComponent)
      .afterClosed()
      .subscribe((v) => {
        this.services = [...this.services, v]
      })
  }

  openService(id: string) {
    this.router.navigate([`/services/${id}`])
    console.log('navigate')
  }

  deleteService(id: string, i: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.services.splice(i, 1)
        this.snackBar.open('Service deleted!', undefined, {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5000,
        })
      },
      error: (err) => console.log(err),
    })
  }

  editService() {
    // this.service.updateService()
  }
}
