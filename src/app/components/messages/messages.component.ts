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
import { Message, Message_Status } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Subscription } from 'rxjs'

import { MatButtonModule } from '@angular/material/button'
import hljs from 'highlight.js'
import { slideInOut } from 'src/app/animation'
import messageFormat2 from 'src/app/highlight'

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

  @Output() save = new EventEmitter<{ event: Event; index: number }>()
  @Output() changeStatus = new EventEmitter<number>()
  @Output() dataEmitted = new EventEmitter<number>()

  state = 'in'

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

  change(index: number): void {
    this.changeStatus.emit(index)
    this.state = this.animationState
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
