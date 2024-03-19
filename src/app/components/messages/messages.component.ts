import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Signal,
  input,
  output,
  viewChildren,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Message, Message_Status } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import hljs from 'highlight.js'
import { Subscription } from 'rxjs'
import { slideInOut } from 'src/app/animation'
import messageFormat2 from 'src/app/highlight'
import { AnimationState } from '../service/service.component'

export interface SaveEvent {
  message: Message
  translationIndex: number
}

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
  readonly animationState = input<AnimationState>('in')

  readonly filteredMessages = input.required<Message[]>()

  readonly scroll = input<CdkVirtualScrollViewport>()

  readonly messageElements: Signal<readonly ElementRef<HTMLElement>[]> = viewChildren('pre')

  save = output<SaveEvent>()

  dataEmitted = output<number>()

  state = 'in'

  private changes = false

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  readonly subscription = new Subscription()

  ngOnInit(): void {
    this.subscription.add(this.scroll()?.scrolledIndexChange.subscribe((v) => this.dataEmitted.emit(v)))

    hljs.registerLanguage('messageformat2', messageFormat2)
  }

  ngAfterViewInit(): void {
    this.messageElements().forEach((element) => hljs.highlightElement(element.nativeElement))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  updateMessageAsTranslated(message: Message, translationIndex: number): void {
    this.state = this.animationState()

    message = new Message({ ...message, status: Message_Status.TRANSLATED })
    this.save.emit({ message, translationIndex })
  }

  updateMessageText(message: Message, text: string, translationIndex: number): void {
    this.changes = message.message !== text

    message = new Message({ ...message, message: text })
    if (this.changes) {
      this.save.emit({ message, translationIndex })
    }
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
