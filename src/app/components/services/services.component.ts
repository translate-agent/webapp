import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Title } from '@angular/platform-browser'
import { Router, RouterLink } from '@angular/router'
import { filter } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { CreateServiceComponent } from '../create-service/create-service.component'
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component'

type ServiceNew = {
  id: string
  name: string
  source?: string
  target?: string[]
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    RouterLink,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
  ],
})
export class ServicesComponent implements OnInit {
  services: ServiceNew[] = []

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  constructor(
    public dialog: MatDialog,
    private service: TranslateClientService,
    public router: Router,
    private snackBar: MatSnackBar,
    public title: Title,
  ) {}

  ngOnInit(): void {
    console.log()

    this.service.listService().subscribe((v) => {
      this.services = structuredClone(v.services)

      this.services.forEach((service) => {
        this.service.listTranslations(service.id).subscribe(({ translations }) => {
          service.source = translations.find((v) => v.original)?.language
          service.target = translations.filter((v) => !v.original).map((v) => v.language)
        })
      })
    })
  }

  createService() {
    this.dialog
      .open(CreateServiceComponent, { width: '500px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe((v) => {
        this.services = [...this.services, v]
      })
  }

  deleteService(service: ServiceNew, i: number) {
    this.dialog
      .open(DialogDeleteComponent, { data: service, width: '500px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => {
        this.service.delete(service.id).subscribe({
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
      })
  }

  editService() {
    // this.service.updateService()
  }
}
