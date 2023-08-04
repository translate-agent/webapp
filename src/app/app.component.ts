import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  Message,
  Message_Status,
  Messages,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb';
import {
  Subscription,
  combineLatest,
  map,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { CreateServiceComponent } from './components/create-service/create-service.component';
import { TranslateClientService } from './services/translate-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'webapp';

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

  readonly form = this.fb.nonNullable.group({
    service: '',
    fuzzy: false,
  });

  readonly serviceList = this.service.listService().pipe(
    map((v) => v.services),
    shareReplay(1)
  );

  readonly allMessages = this.form.controls.service.valueChanges.pipe(
    switchMap((id) => this.service.listMessages(id)),
    shareReplay(1)
  );

  messages: Messages[] = [];

  filteredMessages = combineLatest({
    messages: this.allMessages.pipe(
      map((v) => {
        return v.messages;
      }),
      map((v: Messages[]) =>
        v.sort((a, b) =>
          a.language === 'en' ? -1 : b.language === 'en' ? 1 : 0
        )
      )
    ),
    fuzzy: this.form.controls.fuzzy.valueChanges.pipe(startWith(false)),
  }).pipe(
    map(({ messages, fuzzy }) =>
      messages.filter((v) =>
        v.messages.some((message) => message.status === Message_Status.FUZZY)
      )
    )
  );

  messagesEng = this.filteredMessages.pipe(
    map((v) => v.filter((x) => x.language.includes('en')))
  );

  targetLang: any;

  languages = this.allMessages.pipe(
    map((v) => v.messages.map((x) => x.language))
  );

  readonly subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private service: TranslateClientService,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.filteredMessages.subscribe({
        next: (messages) => {
          this.messages = messages;

          this.targetLang = messages.filter((v) => !v.language.includes('en'));
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createService() {
    this.dialog.open(CreateServiceComponent);
  }

  match(id: string, msg: Message) {
    if (msg.id === id) {
      return msg.message.slice(1, -1);
    }
    return;
  }

  save(v: Event, msgId: string, language: string) {
    const value = (v.target as HTMLTextAreaElement).value;
    const value1 = '{'.concat(value, '}');
    this.filteredMessages.subscribe((res) => {
      const filteredMsg = res.filter((x) => x.language === language);

      const updatedMsg = filteredMsg.map((item) => {
        item.messages.map((message) => {
          if (message.id === msgId) {
            message.message = value1;
          }
          return message;
        });

        return item;
      });
    });
  }

  getTranslation(id: string, language: string) {
    const message = this.messages.find((m) => m.language === language);
    if (message) {
      const translate = message.messages.find((m) => m.id === id);
      if (translate) {
        return translate.message;
      }
    }

    return '';
  }
}
