/* eslint-disable @typescript-eslint/naming-convention */
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  WritableSignal,
  computed,
  signal,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Message_Status, Translation } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Subscription } from 'rxjs'

import { MatButtonModule } from '@angular/material/button'
import { MatSnackBar } from '@angular/material/snack-bar'
import hljs from 'highlight.js'
import { slideInOut } from 'src/app/animation'
import messageFormat2 from 'src/app/highlight'
import { TranslateClientService } from 'src/app/services/translate-client.service'

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    TextFieldModule,
    ReactiveFormsModule,
    ScrollingModule,
    MatButtonModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  animations: slideInOut,
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() serviceid!: string | null
  @Input() data!: Translation[]
  @Input() filteredTranslations!: Translation[]
  @Input() id!: string
  @Input() index!: number
  @Input() scroll!: CdkVirtualScrollViewport
  @Input() animationState!: string

  @ViewChildren('pre') messageElements!: QueryList<ElementRef>

  @Output() dataEmitted = new EventEmitter<number>()
  @Output() translatonsemitted = new EventEmitter<Translation>()

  readonly subscription = new Subscription()

  state = 'in'

  changes = false

  translationsSignal: WritableSignal<Translation[]> = signal([])

  findedMessages = computed(() => this.translationsSignal().map((v) => v.messages.find((msg) => msg.id === this.id)))

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  constructor(
    private service: TranslateClientService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.subscription.add(this.scroll?.scrolledIndexChange.subscribe((v) => this.dataEmitted.emit(v)))

    this.translationsSignal.set(this.filteredTranslations ?? [])

    hljs.registerLanguage('messageformat2', messageFormat2)
  }

  ngAfterViewInit(): void {
    this.messageElements.forEach((element) => hljs.highlightElement(element.nativeElement))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  save(v: Event, msgId: string | undefined, index: number): void {
    const value = (v.target as HTMLTextAreaElement).innerText
    const translation = structuredClone(this.data[index])

    translation.messages = this.data[index].messages.filter((message) => {
      if (message.id === msgId) {
        this.changes = message.message !== value ? true : false
        message.message = value
        return message
      }
      return
    })
    if (this.changes) {
      this.service.updateTranslation(this.serviceid!, translation, ['messages']).subscribe(() => {
        this.snackBar.open('Message updated!', undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
        })

        this.changes = false
      })
    }
  }

  changeStatuss(index: number, id: string): void {
    const translation = structuredClone(this.data[index])

    translation.messages = this.data[index].messages.filter((message) => {
      if (message.id === id) {
        this.changes = true
        message.status = Message_Status.TRANSLATED
        return message
      }
      return
    })

    this.service.updateTranslation(this.serviceid!, translation, ['messages']).subscribe(() => {
      this.snackBar.open('Status changed!', undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000,
      })

      this.state = this.animationState

      setTimeout(() => {
        this.translatonsemitted.emit()
      }, 500)
    })
  }

  tooltip(status: Message_Status | undefined): string {
    switch (status) {
      case Message_Status.UNTRANSLATED:
        return 'Needs translation'
      case Message_Status.TRANSLATED:
        return 'Translated'
      default:
        return 'Fuzzy'
    }
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
}
