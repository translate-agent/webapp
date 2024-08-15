import { TestBed } from '@angular/core/testing'
import {
  DownloadTranslationFileResponse,
  ListServicesResponse,
  ListTranslationsResponse,
  Message_Status,
  Schema,
  Service,
  Translation,
} from '@buf/expect_translate-agent.bufbuild_es/translate/v1/translate_pb.js'
import { Empty } from '@bufbuild/protobuf'
import { of } from 'rxjs'
import { TranslateClientService } from './translate-client.service'

export const mockListTranslationsResponse = new ListTranslationsResponse({
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

describe('TranslateClientService', () => {
  let service: TranslateClientService

  beforeEach(() => {
    service = TestBed.inject(TranslateClientService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should list services', () => {
    const mockService = new ListServicesResponse({
      services: [{ id: 'service-id', name: 'Test Service' }],
    })

    spyOn(service, 'listServices').and.returnValue(of(mockService)).and.callThrough()
    spyOn(service.client, 'listServices').and.returnValue(Promise.resolve(mockService))

    service.listServices().subscribe((services) => {
      expect(services).toBe(mockService)
    })

    expect(service.listServices).toHaveBeenCalled()
    expect(service.client.listServices).toHaveBeenCalled()
  })

  it('should get service', () => {
    const mockService = new Service({ id: 'service-id', name: 'Test Service' })

    spyOn(service, 'getService').and.returnValue(of(mockService)).and.callThrough()
    spyOn(service.client, 'getService').and.returnValue(Promise.resolve(mockService))

    expect(service.client.getService).toHaveBeenCalledTimes(0)

    service.getService('service-id')

    expect(service.getService).toHaveBeenCalledWith('service-id')
    expect(service.client.getService).toHaveBeenCalledWith({ id: 'service-id' })
  })

  it('should create service', () => {
    const mockService = new Service({ id: 'service-id', name: 'Test Service' })

    spyOn(service, 'createService').and.returnValue(of(mockService)).and.callThrough()
    spyOn(service.client, 'createService').and.returnValue(Promise.resolve(mockService))

    service.createService('Test Service')

    expect(service.createService).toHaveBeenCalledWith('Test Service')
    expect(service.client.createService).toHaveBeenCalledWith({
      service: new Service({ name: 'Test Service', id: '' }),
    })
  })

  it('should update service', () => {
    const mockResponse = new Service({ id: 'service-id', name: 'Test Service' })

    spyOn(service, 'updateService').and.returnValue(of(mockResponse)).and.callThrough()
    spyOn(service.client, 'updateService').and.returnValue(Promise.resolve(mockResponse))

    service.updateService('service-id', 'New Test Service')

    expect(service.updateService).toHaveBeenCalledWith('service-id', 'New Test Service')
    expect(service.client.updateService).toHaveBeenCalledWith({
      service: new Service({ id: 'service-id', name: 'New Test Service' }),
    })
  })

  it('should delete service', () => {
    spyOn(service, 'deleteService')
      .and.returnValue(of(new Empty({})))
      .and.callThrough()
    spyOn(service.client, 'deleteService').and.returnValue(Promise.resolve(new Empty({})))

    service.deleteService('service-id')

    expect(service.deleteService).toHaveBeenCalledWith('service-id')
    expect(service.client.deleteService).toHaveBeenCalledWith({ id: 'service-id' })
  })

  it('should list translations', () => {
    spyOn(service, 'listTranslations').and.returnValue(of(mockListTranslationsResponse.translations)).and.callThrough()
    spyOn(service.client, 'listTranslations').and.returnValue(Promise.resolve(mockListTranslationsResponse))

    service.listTranslations('service-id')

    expect(service.listTranslations).toHaveBeenCalledWith('service-id')
    expect(service.client.listTranslations).toHaveBeenCalledWith({ serviceId: 'service-id' })
  })

  it('should create translation', () => {
    const mockResponse = new Translation({ language: 'lv', original: false, messages: [] })

    spyOn(service, 'createTranslation').and.returnValue(of(mockResponse)).and.callThrough()
    spyOn(service.client, 'createTranslation').and.returnValue(Promise.resolve(mockResponse))

    service.createTranslation('service-id', 'lv')

    expect(service.createTranslation).toHaveBeenCalledWith('service-id', 'lv')
    expect(service.client.createTranslation).toHaveBeenCalledWith({
      serviceId: 'service-id',
      translation: { language: 'lv' },
    })
  })

  it('should update translation', () => {
    const mockResponse = new Translation({
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
          message: ' (ausgeschlossen test)',
          description: '',
          status: Message_Status.UNTRANSLATED,
          positions: ['superset-frontend/src/filters/components/Select/SelectFilterPlugin.tsx:130'],
        },
      ],
    })

    spyOn(service, 'updateTranslation').and.returnValue(of(mockResponse)).and.callThrough()
    spyOn(service.client, 'updateTranslation').and.returnValue(Promise.resolve(mockResponse))

    service.updateTranslation(
      'service-id',
      new Translation({
        language: 'de',
        original: false,
        messages: [
          {
            id: ' (excluded)',
            pluralId: '',
            message: ' (ausgeschlossen test)',
            description: '',
            status: Message_Status.UNTRANSLATED,
            positions: ['superset-frontend/src/filters/components/Select/SelectFilterPlugin.tsx:130'],
          },
        ],
      }),
      ['messages'],
    )

    expect(service.updateTranslation).toHaveBeenCalledWith(
      'service-id',
      new Translation({
        language: 'de',
        original: false,
        messages: [
          {
            id: ' (excluded)',
            pluralId: '',
            message: ' (ausgeschlossen test)',
            description: '',
            status: Message_Status.UNTRANSLATED,
            positions: ['superset-frontend/src/filters/components/Select/SelectFilterPlugin.tsx:130'],
          },
        ],
      }),
      ['messages'],
    )
    expect(service.client.updateTranslation).toHaveBeenCalledWith({
      serviceId: 'service-id',
      translation: new Translation({
        language: 'de',
        original: false,
        messages: [
          {
            id: ' (excluded)',
            pluralId: '',
            message: ' (ausgeschlossen test)',
            description: '',
            status: Message_Status.UNTRANSLATED,
            positions: ['superset-frontend/src/filters/components/Select/SelectFilterPlugin.tsx:130'],
          },
        ],
      }),
      updateMask: {
        paths: ['messages'],
      },
      populateTranslations: undefined,
    })
  })

  it('should upload translation file', () => {
    spyOn(service, 'uploadTranslationFile')
      .and.returnValue(of(new Empty({})))
      .and.callThrough()
    spyOn(service.client, 'uploadTranslationFile').and.returnValue(Promise.resolve(new Empty({})))

    service.uploadTranslationFile(new Uint8Array(), 'en', Schema.PO, true, 'service-id', true)

    expect(service.uploadTranslationFile).toHaveBeenCalledWith(
      new Uint8Array(),
      'en',
      Schema.PO,
      true,
      'service-id',
      true,
    )
    expect(service.client.uploadTranslationFile).toHaveBeenCalledWith({
      data: new Uint8Array(),
      language: 'en',
      schema: Schema.PO,
      original: true,
      serviceId: 'service-id',
      populateTranslations: true,
    })
  })

  it('should download translation file', () => {
    spyOn(service, 'downloadTranslationFile')
      .and.returnValue(of(new DownloadTranslationFileResponse({ data: new Uint8Array() })))
      .and.callThrough()

    spyOn(service.client, 'downloadTranslationFile').and.returnValue(
      Promise.resolve(new DownloadTranslationFileResponse({ data: new Uint8Array() })),
    )

    service.downloadTranslationFile('en', Schema.PO, 'service-id')

    expect(service.downloadTranslationFile).toHaveBeenCalledWith('en', Schema.PO, 'service-id')
    expect(service.client.downloadTranslationFile).toHaveBeenCalledWith({
      language: 'en',
      schema: Schema.PO,
      serviceId: 'service-id',
    })
  })
})
