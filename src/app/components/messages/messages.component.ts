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

export interface SaveEvent {
  message: Message
  index: number
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
  @Input() filteredMessages!: Message[]
  @Input() scroll!: CdkVirtualScrollViewport
  @Input() animationState!: string

  @ViewChildren('pre') messageElements!: QueryList<ElementRef>

  @Output() save = new EventEmitter<SaveEvent>()
  @Output() changeStatus = new EventEmitter<SaveEvent>()
  @Output() dataEmitted = new EventEmitter<number>()

  state = 'in'

  private changes = false

  readonly languageNames = new Intl.DisplayNames(['en'], { type: 'language' })

  readonly subscription = new Subscription()

  ngOnInit(): void {
    this.subscription.add(this.scroll?.scrolledIndexChange.subscribe((v) => this.dataEmitted.emit(v)))

    hljs.registerLanguage('messageformat2', messageFormat2)
  }

  ngAfterViewInit(): void {
    this.messageElements.forEach((element) => hljs.highlightElement(element.nativeElement))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  change(item: Message, index: number): void {
    const message = new Message({ ...item, status: Message_Status.TRANSLATED })
    this.state = this.animationState

    this.changeStatus.emit({ message, index })
  }

  focusOutEvent(item: Message, value: string, index: number): void {
    const message = new Message({ ...item, message: value })
    this.changes = item.message !== value

    if (this.changes) {
      this.save.emit({ message, index })
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
