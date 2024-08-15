import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { Subscription, filter } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { CreateServiceComponent } from '../create-service/create-service.component'
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component'
import { ServicesListComponent } from '../services-list/services-list.component'

export type ServiceNew = {
  id: string
  name: string
  source?: string
  target?: string[]
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    ServicesListComponent,
  ],
})
export class ServicesComponent implements OnInit, OnDestroy {
  readonly services = signal<ServiceNew[]>([])

  readonly subscription = new Subscription()

  constructor(
    public dialog: MatDialog,
    private service: TranslateClientService,
    public router: Router,
    public snackBar: MatSnackBar,
    public title: Title,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.service.listServices().subscribe((v) => {
        this.services.set(structuredClone(v.services))
        this.services.update((services) => {
          services.forEach((service) => {
            this.service.listTranslations(service.id).subscribe((translations) => {
              service.source = translations.find((v) => v.original)?.language
              service.target = translations.filter((v) => !v.original).map((v) => v.language)
            })
          })
          return services
        })
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  createService(): void {
    this.dialog
      .open(CreateServiceComponent, { width: '500px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe((v) => {
        this.service.createService(v).subscribe({
          next: (service) => {
            this.snackBar.open('Service created!', undefined, {
              duration: 5000,
            })
            this.services.update((services) => [...services, service])
          },

          error: (err) =>
            this.snackBar.open(`Something went wrong. ${err}`, undefined, {
              duration: 5000,
            }),
        })
      })
  }

  deleteService(service: ServiceNew): void {
    this.dialog
      .open(DialogDeleteComponent, { data: service, width: '500px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => {
        this.service.deleteService(service.id).subscribe({
          next: () => {
            this.services.update((services) => services.filter((v) => v.id !== service.id))

            this.snackBar.open(`Service ${service.name} deleted!`, undefined, {
              duration: 5000,
            })
          },
          error: (err) =>
            this.snackBar.open(`Something went wrong. ${err}`, undefined, {
              duration: 5000,
            }),
        })
      })
  }

  editService(service: ServiceNew): void {
    const dialog = this.dialog.open(CreateServiceComponent, { width: '500px', data: service })

    dialog
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe((v) => {
        this.service.updateService(service.id, v).subscribe({
          next: (v) => {
            this.snackBar.open('Service updated!', undefined, {
              duration: 5000,
            })

            this.services.update((services) =>
              services.map((service) => {
                if (service.id === v.id) {
                  service.name = v.name
                }
                return service
              }),
            )
          },

          error: (err) =>
            this.snackBar.open(`Something went wrong. ${err}`, undefined, {
              duration: 5000,
            }),
        })
      })
  }
}
