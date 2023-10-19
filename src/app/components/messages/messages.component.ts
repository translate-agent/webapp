import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { TextFieldModule } from '@angular/cdk/text-field'
import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Translation } from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { Subscription } from 'rxjs'

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
  ],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  @Input() serviceid!: string
  @Input() data!: Translation[] | null
  @Input() id!: string
  @Input() scroll!: CdkVirtualScrollViewport

  @Output() dataEmitted = new EventEmitter<number>()

  readonly subscription = new Subscription()

  constructor(private service: TranslateClientService) {}

  ngOnInit(): void {
    this.subscription.add(this.scroll?.scrolledIndexChange.subscribe((v) => this.dataEmitted.emit(v)))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  save(v: Event, msgId: string | undefined, i: number) {
    const value = (v.target as HTMLTextAreaElement).value
    // const value1 = '{'.concat(value, '}')

    this.data![i].messages.map((message) => {
      if (message.id === msgId) {
        message.message = value
      }
      return message
    })

    this.service.updateTranslation(this.serviceid!, this.data![i]).subscribe((v) => console.log('updated', v))
  }

  findMessage(data: Translation[], i: string) {
    return data.map((v) => v.messages.find((msg) => msg.id === i))
  }
}
