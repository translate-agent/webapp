import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild, computed, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import {
  Message,
  Message_Status,
  Translation,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { BehaviorSubject, Subscription, combineLatest, filter, map, shareReplay, startWith, switchMap } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { MessagesComponent, SaveEvent } from '../messages/messages.component'
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
    MatButtonToggleModule,
  ],
})
export class ServiceComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport

  readonly serviceid = this.route.paramMap.pipe(
    map((v) => v.get('id')!),
    shareReplay(1),
  )

  animationState = 'in'

  readonly form = this.fb.nonNullable.group({
    status: this.fb.nonNullable.control<StatusOption[]>([]),
    search: this.fb.nonNullable.control(''),
  })

  readonly statuses: StatusOption[] = [
    { title: 'Untranslated', value: Message_Status.UNTRANSLATED },
    { title: 'Translated', value: Message_Status.TRANSLATED },
    { title: 'Fuzzy', value: Message_Status.FUZZY },
  ]

  private refreshTranslations = new BehaviorSubject<void>(undefined)

  readonly translations = signal<Translation[]>([])

  private readonly filter = toSignal(this.form.valueChanges, { initialValue: { search: '', status: [] } })

  readonly filteredTranslations = computed(() => {
    const { status, search } = this.filter()

    return this.filterMessages(this.translations(), status ?? [], search ?? '').reduce(
      (msgs, language) =>
        language.messages.reduce((m, v) => {
          const existingMessages = m.get(v.id) ?? []
          m.set(v.id, [...existingMessages, v])
          return m
        }, msgs),
      new Map<string, Message[]>(),
    )
  })

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  readonly subscription = new Subscription()

  receivedData: number = 0

  readonly translations$ = combineLatest({
    service: this.serviceid,
    subject: this.refreshTranslations,
  }).pipe(
    switchMap(({ service }) => this.translateService.listTranslations(service)),
    shareReplay(1),
  )

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private translateService: TranslateClientService,
    private route: ActivatedRoute,
    public title: Title,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.subscription.add(this.translations$.subscribe((v) => this.translations.set(v)))

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

    this.subscription.add(
      this.form.controls.status.valueChanges
        .pipe(startWith([]))
        .subscribe((status) => (this.animationState = status.length > 0 ? 'out' : 'in')),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.virtualScroll.scrollToIndex(0)
  }

  openFileUploadModal(): void {
    this.dialog
      .open(UploadTranslationFileComponent, { data: this.serviceid })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => this.refreshTranslations.next())
  }

  openFileDownloadModal(): void {
    const dialog = this.dialog.open(UploadTranslationFileComponent, { data: this.serviceid })

    dialog.componentInstance.download = true
  }

  addLanguage(): void {
    this.dialog
      .open(NewLanguageDialogComponent, { data: this.serviceid, width: '400px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => this.refreshTranslations.next())
  }

  receiveDataFromChild(data: number): void {
    this.receivedData = data
  }

  filterMessages(translations: Translation[], statusOptions: StatusOption[], searchText: string): Translation[] {
    if (statusOptions.length === 0 && searchText.length === 0) {
      return translations
    }

    searchText = searchText.toLowerCase()
    const status = statusOptions.map((v) => v.value)

    const filteredByTextIds = translations.reduce(
      (keys, translation) => [
        ...keys,
        ...translation.messages.filter((v) => v.message.toLowerCase().includes(searchText)).map((v) => v.id),
      ],
      [] as string[],
    )

    const filteredByTextAndStatustIds = translations.reduce(
      (keys, translation) => [
        ...keys,
        ...translation.messages
          .filter((v) => filteredByTextIds.includes(v.id))
          .filter((v) => status.length === 0 || (!translation.original && status.includes(v.status)))
          .map((v) => v.id),
      ],
      [] as string[],
    )

    return translations.map((v) => {
      v = v.clone()
      v.messages = v.messages.filter((msg) => filteredByTextAndStatustIds.includes(msg.id))
      return v
    })
  }

  icon(status: Message_Status | undefined): string {
    switch (status) {
      case Message_Status.UNTRANSLATED:
        return 'translate'
      case Message_Status.TRANSLATED:
        return 'check_small'
      default:
        return 'g_translated'
    }
  }

  saveMessage(data: SaveEvent): void {
    const { message, translationIndex: index } = data

    const translation = new Translation({
      ...this.translations()[index],
      messages: [message],
    })

    this.serviceid
      .pipe(switchMap((id) => this.translateService.updateTranslation(id, translation, ['messages'])))
      .subscribe({
        next: () =>
          this.snackBar.open('Message updated!', undefined, {
            duration: 5000,
          }),
        error: () =>
          this.snackBar.open('Something went wrong!', undefined, {
            duration: 5000,
          }),
      })
  }
}
