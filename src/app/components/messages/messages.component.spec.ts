import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { spy } from '../services/services.component.spec'
import { MessagesComponent } from './messages.component'

describe('MessagesComponent', () => {
  let component: MessagesComponent
  let fixture: ComponentFixture<MessagesComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessagesComponent, NoopAnimationsModule],
      providers: [
        {
          provide: TranslateClientService,
          useValue: spy,
        },
      ],
    })
    fixture = TestBed.createComponent(MessagesComponent)
    component = fixture.componentInstance

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
