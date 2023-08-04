import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { Message, Messages } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Subscription, combineLatest, map, shareReplay, startWith, switchMap, tap } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { UploadTranslationFileComponent } from '../upload-translation-file/upload-translation-file.component'

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit, OnDestroy {
  readonly form = this.fb.nonNullable.group({
    fuzzy: false,
  })

  readonly allMessages = this.route.paramMap.pipe(
    map((v) => v.get('id')!),
    switchMap((id) => this.service.listMessages(id)),
    shareReplay(1)
  )

  readonly filteredMessages = combineLatest({
    messages: this.allMessages.pipe(
      tap((v) => console.log(v.messages)),
      map((v) => {
        return v.messages
      }),
      shareReplay(1)
    ),
    fuzzy: this.form.controls.fuzzy.valueChanges.pipe(startWith(false)),
  }).pipe(map(({ messages }) => messages.filter((v) => v.messages.some((message) => message))))

  // messages!: any[];

  readonly originalLanguage = this.filteredMessages.pipe(map((v) => v.filter((messages) => messages.original)))

  readonly targetLanguage = this.filteredMessages.pipe(map((v) => v.filter((messages) => !messages.original)))

  readonly languages = this.allMessages.pipe(
    map((v) => v.messages.sort((a, b) => Number(b.original) - Number(a.original))),
    map((v) => v.map((x) => x.language))
  )

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  readonly subscription = new Subscription()

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private service: TranslateClientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.filteredMessages.subscribe({
        next: (messages) => {
          console.log(messages)
        },
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  openFileUploadModal() {
    this.dialog.open(UploadTranslationFileComponent)
  }

  // getTranslation(id: string, language: string, data: Messages[]) {
  //   const message = data.find((v) => v.language === language)?.messages;

  //   if (message) {
  //     const translate = message.find((msg) => msg.id === id);

  //     if (translate) {
  //       return translate.message;
  //     }
  //   }

  //   return;
  // }

  getTranslation(id: string, language: string, data: Messages[]) {
    const message = data.find((m) => m.language === language)
    // const message = this.messages.find((m) => m.language === language);
    if (message) {
      const translate = message.messages.find((m) => m.id === id)
      if (translate) {
        return translate.message
      }
    }

    return ''
  }

  save(v: Event, msgId: string, language: string) {
    const value = (v.target as HTMLTextAreaElement).value
    const value1 = '{'.concat(value, '}')
    this.filteredMessages.subscribe((res) => {
      const filteredMsg = res.filter((x) => x.language === language)

      filteredMsg.map((item) => {
        item.messages.map((message) => {
          if (message.id === msgId) {
            message.message = value1
          }
          return message
        })

        return item
      })
    })
  }

  findoriginalMsg(data: Messages) {
    if (data.original) {
      return data.messages
    }
    return
  }

  targetLanguages(data: Messages[]) {
    return data.filter((v) => !v.original)
  }

  match(id: string, data: Message) {
    if (data.id === id) {
      return data.message.slice(1, -1)
    }
    return
  }
}
