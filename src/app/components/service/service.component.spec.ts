import { ComponentFixture, TestBed } from '@angular/core/testing'

import { By, Title } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import {
  ListTranslationsResponse,
  Message_Status,
  Service,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { of } from 'rxjs'
import { TranslateClientService } from 'src/app/services/translate-client.service'
import { ServiceComponent } from './service.component'

const mockData = new ListTranslationsResponse({
  translations: [
    {
      language: 'en',
      original: true,
      messages: [
        {
          id: '\n\\n\n            Error: %(text)s\\n\n            ',
          pluralId: '',
          message:
            '.local $format = { python-format }\n.local $text = { |%(text)s| }\n{{\n\\\\n\n            Error: { $text }\\\\n\n            }}',
          description: '',
          status: Message_Status.TRANSLATED,
          positions: ['superset/reports/notifications/email.py:89'],
        },
        {
          id: ' (excluded)',
          pluralId: '',
          message: ' (excluded)',
          description: '',
          status: Message_Status.TRANSLATED,
          positions: ['superset-frontend/src/filters/components/Select/SelectFilterPlugin.tsx:130'],
        },
      ],
    },
    {
      language: 'de',
      original: false,
      messages: [
        {
          id: '\n\\n\n            Error: %(text)s\\n\n            ',
          pluralId: '',
          message:
            '.local $format = { python-format }\n.local $text = { |%(text)s| }\n{{\n\\\\n\n            Error: { $text }\\\\n\n            }}',
          description: '',
          status: Message_Status.UNTRANSLATED,
          positions: ['superset/reports/notifications/email.py:89'],
        },
        {
          id: ' (excluded)',
          pluralId: '',
          message: ' (excluded)',
          description: '',
          status: Message_Status.UNTRANSLATED,
          positions: ['superset-frontend/src/filters/components/Select/SelectFilterPlugin.tsx:130'],
        },
      ],
    },
  ],
})

describe('ServiceComponent', () => {
  let component: ServiceComponent
  let fixture: ComponentFixture<ServiceComponent>
  let translateClientServiceSpy: jasmine.SpyObj<TranslateClientService>
  let title: Title

  const translateClientServiceMock = jasmine.createSpyObj('TranslateClientService', ['getService', 'listTranslations'])
  const mockResponse = new Service({ id: '1', name: 'test' })
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        Title,
        {
          provide: TranslateClientService,
          useValue: translateClientServiceMock,
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ServiceComponent)
    component = fixture.componentInstance
    title = TestBed.inject(Title)
    translateClientServiceSpy = TestBed.inject(TranslateClientService) as jasmine.SpyObj<TranslateClientService>

    translateClientServiceSpy.listTranslations.and.returnValue(of(mockData.translations))

    component.ngOnInit()

    translateClientServiceSpy.getService.and.returnValue(of(mockResponse))
    spyOn(title, 'setTitle')
    title.setTitle(mockResponse.name)

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set title service name', () => {
    expect(translateClientServiceSpy.getService).toHaveBeenCalled()
    expect(title.setTitle).toHaveBeenCalledWith(mockResponse.name)
  })

  it('should render tilte ', () => {
    spyOn(title, 'getTitle').and.returnValue(mockResponse.name)

    const titleElement = fixture.debugElement.query(By.css('h1.title'))
    fixture.detectChanges()
    expect(titleElement.nativeElement.textContent).toContain(mockResponse.name)
  })
})
