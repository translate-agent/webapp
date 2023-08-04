import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ActivatedRoute } from '@angular/router'
import { Message, Messages } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { combineLatest, map, shareReplay, startWith, switchMap } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatDividerModule, MatFormFieldModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
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
      map((v) => {
        return v.messages
      }),
      shareReplay(1)
    ),
    fuzzy: this.form.controls.fuzzy.valueChanges.pipe(startWith(false)),
  }).pipe(map(({ messages }) => messages.filter((v) => v.messages.some((message) => message))))

  readonly originalLanguage = this.filteredMessages.pipe(map((v) => v.filter((messages) => messages.original)))

  readonly targetLanguage = this.filteredMessages.pipe(map((v) => v.filter((messages) => !messages.original)))

  readonly languages = this.allMessages.pipe(
    map((v) => v.messages.sort((a, b) => Number(b.original) - Number(a.original))),
    map((v) => v.map((x) => x.language))
  )

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  constructor(private service: TranslateClientService, private route: ActivatedRoute, private fb: FormBuilder) {}

  match(id: string, data: Message) {
    if (data.id === id) {
      return data.message.slice(1, -1)
    }
    return
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

  findoriginalMsg(data: Messages) {
    if (data.original) {
      return data.messages
    }
    return
  }

  targetLanguages(data: Messages[]) {
    return data.filter((v) => !v.original)
  }
}
