import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { Message_Status, Translation } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Subscription, filter, map, shareReplay, startWith, switchMap } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { MessagesComponent } from '../messages/messages.component'
import { NewLanguageDialogComponent } from '../new-language-dialog/new-language-dialog.component'
import { ServicesComponent } from '../services/services.component'
import { UploadTranslationFileComponent } from '../upload-translation-file/upload-translation-file.component'

export interface StatusOption {
  title: string
  value: Message_Status
}

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    TextFieldModule,
    MatInputModule,
    MatDividerModule,
    MatDialogModule,
    MessagesComponent,
    MatCheckboxModule,
    MatSelectModule,
    ScrollingModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    RouterModule,
    UploadTranslationFileComponent,
    ServicesComponent,
    MatSnackBarModule,
  ],
})
export class ServiceComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport

  readonly form = this.fb.nonNullable.group({
    status: this.fb.nonNullable.control<undefined | StatusOption>(undefined),
  })

  readonly serviceid = this.route.paramMap.pipe(
    map((v) => v.get('id')!),
    shareReplay(1),
  )

  id!: string

  readonly statuses: StatusOption[] = [
    { title: 'Untranslated', value: Message_Status.UNTRANSLATED },
    { title: 'Translated', value: Message_Status.TRANSLATED },
    { title: 'Fuzzy', value: Message_Status.FUZZY },
  ]

  translations = this.serviceid.pipe(
    switchMap((id) => this.service.listTranslations(id)),
    map((v) => {
      return v.translations
    }),
    map((v) => v.sort((a, b) => Number(b.original) - Number(a.original))),
    map((v) => {
      v.map((messages) => messages.messages.sort((a, b) => a.id.localeCompare(b.id)))
      return v
    }),
    // shareReplay(1),
  )

  readonly state = this.form.controls.status.valueChanges.pipe(startWith(undefined))

  filteredTranslations: Translation[] = []

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  readonly subscription = new Subscription()

  receivedData: number = 0

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private service: TranslateClientService,
    private route: ActivatedRoute,
    public title: Title,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.pipe(map((v) => v.get('id')!)).subscribe((v) => {
        this.id = v
        this.service.getService(v).subscribe((service) => this.title.setTitle(service.name))
      }),
    )

    this.subscription.add(
      this.form.controls.status.valueChanges.pipe(startWith(undefined)).subscribe((state) => {
        this.translations.subscribe((v) => {
          if (state?.value === undefined) {
            this.filteredTranslations = v
            return
          }

          this.filteredTranslations = this.filterMessagesByStatus(v, state.value)
        })
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.virtualScroll.scrollToIndex(0)
  }

  openFileUploadModal(): void {
    this.dialog
      .open(UploadTranslationFileComponent, { data: this.serviceid })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => {
        this.translations.subscribe((v) => {
          this.filteredTranslations = v
        })
      })
  }

  addLanguage(): void {
    this.dialog
      .open(NewLanguageDialogComponent, { data: this.serviceid, width: '400px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => {
        this.translations.subscribe((v) => {
          this.filteredTranslations = v
        })
      })
  }

  receiveDataFromChild(data: number) {
    this.receivedData = data
  }

  filterMessagesByStatus(data: Translation[], status: Message_Status) {
    const filteredKeys: string[] = []
    data
      .filter((v) => !v.original)
      .map((v) =>
        v.messages.filter((v) => {
          if (v.status === status) {
            filteredKeys.push(v.id)
            return v
          }
          return
        }),
      )

    const uniqueKey = [...new Set(filteredKeys)]

    const orginal = data.find((obj) => obj.original)

    const result = data.map((v) => {
      if (v.original) {
        v.messages = orginal!.messages.filter((msg) => {
          return uniqueKey.some((key) => key === msg.id)
        })
      }
      return v
    })

    return result
  }
}
