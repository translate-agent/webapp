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
import { messageformat } from 'src/app/highlight'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { StatusOption } from '../service/service.component'

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
  @Input() data!: Translation[] | null
  @Input() filteredTranslations!: Translation[] | null
  @Input() id!: string
  @Input() index!: number
  @Input() status!: StatusOption | undefined
  @Input() scroll!: CdkVirtualScrollViewport
  @Input() filtered!: boolean
  @Input() animationState!: string

  @ViewChildren('pre') messageElements!: QueryList<ElementRef>

  @Output() dataEmitted = new EventEmitter<number>()
  @Output() translatonsemitted = new EventEmitter<{
    data: Translation
    animate?: boolean
    element: QueryList<ElementRef>
  }>()

  readonly subscription = new Subscription()

  state = 'in'

  changes = false

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  constructor(
    private service: TranslateClientService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.subscription.add(this.scroll?.scrolledIndexChange.subscribe((v) => this.dataEmitted.emit(v)))

    hljs.registerLanguage('messageformat2', () => messageformat)
  }

  ngAfterViewInit(): void {
    this.highlight()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  highlight() {
    this.messageElements.forEach((element) => hljs.highlightElement(element.nativeElement))
  }

  save(v: Event, msgId: string | undefined, index: number) {
    const value = (v.target as HTMLTextAreaElement).innerText

    this.data![index].messages.map((message) => {
      if (message.id === msgId && message.message !== value) {
        this.changes = true
        message.message = value
      }
      return message
    })

    if (this.changes) {
      this.service.updateTranslation(this.serviceid!, this.data![index]).subscribe(() => {
        this.snackBar.open('Message updated!', undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
        })
        this.changes = false
      })
    }
  }

  changeStatuss(index: number, id: string) {
    this.data?.[index].messages.map((message) => {
      if (message.id === id) {
        message.status = Message_Status.TRANSLATED
      }
      return message
    })

    this.service.updateTranslation(this.serviceid!, this.data![index]).subscribe((d) => {
      this.snackBar.open('Status changed!', undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        duration: 5000,
      })

      setTimeout(() => {
        this.translatonsemitted.emit({ data: d, element: this.messageElements })
        this.state = this.animationState
      }, 1000)
    })
  }

  findMessage(data: Translation[], i: string) {
    return data.map((v) => v.messages.find((msg) => msg.id === i))
  }

  tooltip(status: Message_Status | undefined) {
    switch (status) {
      case Message_Status.UNTRANSLATED:
        return 'Needs translation'
      case Message_Status.TRANSLATED:
        return 'Translated'
      default:
        return 'Fuzzy'
    }
  }

  icon(status: Message_Status | undefined) {
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
