import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core'
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
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { Message_Status, Translation } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import hljs from 'highlight.js'
import { Subscription, map, shareReplay, startWith, switchMap } from 'rxjs'
import { messageformat } from 'src/app/highlight'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { MessagesComponent } from '../messages/messages.component'
import { NewLanguageDialogComponent } from '../new-language-dialog/new-language-dialog.component'
import { ServicesComponent } from '../services/services.component'
import { UploadTranslationFileComponent } from '../upload-translation-file/upload-translation-file.component'

export interface StatusOption {
  title: string
  value: Message_Status
}

export interface MapValue {
  lang: string
  original: boolean
  message: string
  status: Message_Status
  id: string
  position: string[]
}

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
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
  @ViewChild(MatToolbar) toolbar!: MatToolbar
  @ViewChild('messages') messagesList!: MessagesComponent

  readonly serviceid = this.route.paramMap.pipe(
    map((v) => v.get('id')!),
    shareReplay(1),
  )

  filtered = false

  animationState = 'in'

  readonly form = this.fb.nonNullable.group({
    status: this.fb.nonNullable.control<undefined | StatusOption>(undefined),
  })

  readonly statuses: StatusOption[] = [
    { title: 'Untranslated', value: Message_Status.UNTRANSLATED },
    { title: 'Translated', value: Message_Status.TRANSLATED },
    { title: 'Fuzzy', value: Message_Status.FUZZY },
  ]

  translations = this.serviceid.pipe(
    switchMap((id) => this.translateService.listTranslations(id)),
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

  translationsMap = new Map<string, MapValue[]>()

  readonly state = this.form.controls.status.valueChanges.pipe(startWith(undefined))

  filteredTranslations: Translation[] = []

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  readonly subscription = new Subscription()

  receivedData: number = 0

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private translateService: TranslateClientService,
    private route: ActivatedRoute,
    public title: Title,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.serviceid.pipe(switchMap((id) => this.translateService.getService(id))).subscribe({
        next: (service) => this.title.setTitle(service.name),
        error: (err) => {
          if (err.code === 5 || err.code === 3) {
            this.router.navigate(['services'])
          } else {
            console.log(err)
          }
        },
      }),
    )

    hljs.registerLanguage('messageformat2', () => messageformat)

    this.subscription.add(
      this.form.controls.status.valueChanges.pipe(startWith(undefined)).subscribe((state) => {
        // console.log(state)
        this.translations.subscribe((v) => {
          if (!state) {
            this.filteredTranslations = v
            // this.newMap(v)
            return
          }

          this.filteredTranslations = this.filterMessagesByStatus(v, state.value)
          this.filtered = true

          this.messagesList?.highlight()
          // this.newMap(this.filteredTranslations)
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
      .pipe()
      .subscribe(() => {
        this.translations.subscribe((v) => {
          this.filteredTranslations = v
        })
      })
  }

  openFileDownloadModal(): void {
    const dialog = this.dialog.open(UploadTranslationFileComponent, { data: this.serviceid })

    dialog.componentInstance.download = true
  }

  addLanguage(): void {
    this.dialog
      .open(NewLanguageDialogComponent, { data: this.serviceid, width: '400px' })
      .afterClosed()
      // .pipe(filter((v) => !!v))
      .subscribe(() => {
        this.translations.subscribe((v) => {
          this.filteredTranslations = v
        })
        this.snackBar.open('Added new translations', undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
        })
      })
  }

  receiveDataFromChild(data: number) {
    this.receivedData = data
  }

  receive(data: { data: Translation; animate?: boolean; element: QueryList<ElementRef> }) {
    this.translations.subscribe((v) => {
      const x = v.map((translations) => {
        if (translations.language === data.data.language) {
          translations = data.data
        }
        return translations
      })
      if (this.form.controls.status.value) {
        this.filteredTranslations = this.filterMessagesByStatus(x, this.form.controls.status.value.value)
        // this.newMap(this.filteredTranslations)
      }
      this.filteredTranslations = x
      // this.animationState = 'in'
    })
  }

  filterMessagesByStatus(data: Translation[], status: Message_Status) {
    const filteredKeys: string[] = []
    const copy = data
    // cloneDeep(data)
    copy
      .filter((translations) => !translations.original)
      .map((translation) =>
        translation.messages.filter((v) => {
          if (v.status === status) {
            filteredKeys.push(v.id)

            return v
          }
          return
        }),
      )

    const uniqueKey = [...new Set(filteredKeys)]

    const result = copy.map((v) => {
      v.messages = v.messages.filter((msg) => {
        return uniqueKey.some((key) => key === msg.id)
      })
      return v
    })
    console.log(result)
    this.animationState = 'out'
    return result
  }
}
