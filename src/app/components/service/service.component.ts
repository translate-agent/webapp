import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import { Component, Signal, computed, effect, input, signal, viewChild } from '@angular/core'
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
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
import { Router, RouterModule } from '@angular/router'
import {
  Message,
  Message_Status,
  Service,
  Translation,
} from '@buf/expect_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { BehaviorSubject, combineLatest, filter, shareReplay, switchMap } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { MessagesComponent, SaveEvent } from '../messages/messages.component'
import { NewLanguageDialogComponent } from '../new-language-dialog/new-language-dialog.component'
import { ServicesComponent } from '../services/services.component'
import { UploadTranslationFileComponent } from '../upload-translation-file/upload-translation-file.component'

export interface StatusOption {
  title: string
  value: Message_Status
}

export type AnimationState = 'in' | 'out'

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
  standalone: true,
  imports: [
    CommonModule,
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
    FormsModule,
  ],
})
export class ServiceComponent {
  readonly virtualScroll = viewChild(CdkVirtualScrollViewport)

  public readonly id = input.required<string>()

  readonly service = signal<Service | undefined>(undefined)

  readonly animationState: Signal<AnimationState> = computed(() => (this.status().length > 0 ? 'out' : 'in'))

  status = signal<StatusOption[]>([])

  search = signal('')

  readonly statuses: StatusOption[] = [
    { title: 'Untranslated', value: Message_Status.UNTRANSLATED },
    { title: 'Translated', value: Message_Status.TRANSLATED },
    { title: 'Fuzzy', value: Message_Status.FUZZY },
  ]

  private refreshTranslations = new BehaviorSubject<void>(undefined)

  readonly filteredTranslations = computed(() =>
    this.filterMessages(this.translations(), this.status(), this.search()).reduce(
      (msgs, language) =>
        language.messages.reduce((m, v) => {
          const existingMessages = m.get(v.id) ?? []
          m.set(v.id, [...existingMessages, v])
          return m
        }, msgs),
      new Map<string, Message[]>(),
    ),
  )

  readonly languageName = new Intl.DisplayNames(['en'], { type: 'language' }).of

  receivedData = signal(0)

  readonly translations$ = combineLatest({
    service: toObservable(this.id),
    subject: this.refreshTranslations,
  }).pipe(
    switchMap(({ service }) => this.translateService.listTranslations(service)),
    shareReplay(1),
  )

  readonly translations = toSignal(this.translations$, { initialValue: [] })

  constructor(
    public dialog: MatDialog,
    private translateService: TranslateClientService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    effect((onCleanup) => {
      const sub = this.translateService.getService(this.id()).subscribe({
        next: (service) => this.service.set(service),
        error: (err) => {
          if (err.code === 5 || err.code === 3) {
            this.router.navigate(['services'])
          } else {
            console.log(err)
          }
        },
      })

      onCleanup(() => sub.unsubscribe())
    })

    effect((onCleanup) => {
      const sub = this.virtualScroll()?.scrolledIndexChange.subscribe((v) => {
        this.receivedData.set(v)
      })

      onCleanup(() => sub?.unsubscribe())
    })
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.virtualScroll()?.scrollToIndex(0)
  }

  addLanguage(): void {
    this.dialog
      .open(NewLanguageDialogComponent, { data: this.service()?.id, width: '400px' })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => this.refreshTranslations.next())
  }

  openFileUploadModal(): void {
    this.dialog
      .open(UploadTranslationFileComponent, { data: this.service()?.id })
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => this.refreshTranslations.next())
  }

  openFileDownloadModal(): void {
    const dialog = this.dialog.open(UploadTranslationFileComponent, { data: this.service()?.id })

    dialog.componentInstance.download.set(true)
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

  saveMessage(data: SaveEvent): void {
    const { message, translationIndex: index } = data

    const translation = new Translation({
      ...this.translations()[index],
      messages: [message],
    })

    this.translateService.updateTranslation(this.service()!.id, translation, ['messages']).subscribe({
      next: () => {
        this.snackBar.open('Message updated!', undefined, {
          duration: 5000,
        })

        this.refreshTranslations.next()
      },
      error: () =>
        this.snackBar.open('Something went wrong!', undefined, {
          duration: 5000,
        }),
    })
  }

  statusIcon(status: Message_Status | undefined): string {
    switch (status) {
      case Message_Status.UNTRANSLATED:
        return 'translate'
      case Message_Status.TRANSLATED:
        return 'check_small'
      default:
        return 'g_translated'
    }
  }
}
