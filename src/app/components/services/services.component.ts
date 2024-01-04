import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, signal } from '@angular/core'
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
import { Subscription, filter } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { CreateServiceComponent } from '../create-service/create-service.component'
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component'
import { UploadTranslationFileComponent } from '../upload-translation-file/upload-translation-file.component'

type ServiceNew = {
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
export class ServicesComponent implements OnInit, OnDestroy {
  services$ = signal<ServiceNew[]>([])

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  readonly subscription = new Subscription()

  constructor(
    public dialog: MatDialog,
    private service: TranslateClientService,
    public router: Router,
    private snackBar: MatSnackBar,
    public title: Title,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.service.listService().subscribe((v) => {
        this.services$.set(structuredClone(v.services))
        this.services$.update((services) => {
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

  createService() {
    this.dialog
      .open(CreateServiceComponent, { width: '500px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe((v) => {
        this.services$.update((services) => [...services, v])
      })
  }

  deleteService(service: ServiceNew) {
    this.dialog
      .open(DialogDeleteComponent, { data: service, width: '500px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => {
        this.service.deleteService(service.id).subscribe({
          next: () => {
            this.services$.update((services) => services.filter((v) => v.id !== service.id))

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

  editService(service: ServiceNew) {
    const dialog = this.dialog.open(CreateServiceComponent, { width: '500px', data: service })

    dialog.componentInstance.edit = true

    dialog
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe((v) => {
        this.services$.update((services) =>
          services.map((service) => {
            if (service.id === v.id) {
              service.name = v.name
            }
            return service
          }),
        )
      })
  }

  openFileUploadModal(id: string) {
    this.dialog.open(UploadTranslationFileComponent, { data: id })
  }
}
