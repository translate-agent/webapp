import { TextFieldModule } from '@angular/cdk/text-field'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { ActivatedRoute } from '@angular/router'
import { combineLatest, map, shareReplay, startWith, switchMap, tap } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { MessagesComponent } from '../messages/messages.component'
import { UploadTranslationFileComponent } from '../upload-translation-file/upload-translation-file.component'

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    NgFor,
    MatFormFieldModule,
    TextFieldModule,
    MatInputModule,
    MatDividerModule,
    AsyncPipe,
    MatDialogModule,
    MessagesComponent,
  ],
})
export class ServiceComponent implements OnInit {
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

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private service: TranslateClientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log()
  }

  openFileUploadModal() {
    this.dialog.open(UploadTranslationFileComponent)
  }
}
