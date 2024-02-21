import { TestBed } from '@angular/core/testing'
import { TranslateService } from '@buf/expectdigital_translate-agent.bufbuild_connect-es/translate/v1/translate_connect.js'
import {
  DownloadTranslationFileResponse,
  ListServicesResponse,
  ListTranslationsResponse,
  Message_Status,
  Schema,
  Service,
  Translation,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb.js'
import { Empty } from '@bufbuild/protobuf'
import { TranslateClientService } from './translate-client.service'

describe('TranslateClientService', () => {
  let service: TranslateClientService
  const mockTranslateClientService = jasmine.createSpyObj('TranslateService', [
    'listServices',
    'getService',
    'createService',
    'updateService',
    'deleteService',
    'listTranslations',
    'createTranslation',
    'updateTranslation',
    'uploadTranslationFile',
    'downloadTranslationFile',
  ])
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TranslateService, useValue: mockTranslateClientService }],
    })
    service = TestBed.inject(TranslateClientService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should list services', async () => {
    const mockService = new ListServicesResponse({
      services: [{ id: 'service-id', name: 'Test Service' }],
    })
    const listServicesSpy = spyOn(service.client, 'listServices').and.returnValue(Promise.resolve(mockService))

    service.listServices().subscribe((response) => {
      expect(response).toBeDefined()
      expect(response.services.length).toBe(1)
      expect(response).toEqual(mockService)
    })

    expect(listServicesSpy).toHaveBeenCalledTimes(1)
    expect(listServicesSpy).toHaveBeenCalledWith({})
  })

  it('should get service', async () => {
    const mockService = new Service({ id: 'service-id', name: 'Test Service' })
    const getServiceSpy = spyOn(service.client, 'getService').and.returnValue(Promise.resolve(mockService))

    service.getService('service-id').subscribe((response) => {
      expect(response).toBeDefined()
      expect(response).toEqual(mockService)
    })

    expect(getServiceSpy).toHaveBeenCalledTimes(1)
    expect(getServiceSpy).toHaveBeenCalledWith({ id: 'service-id' })
  })

  it('should create service', async () => {
    const mockService = new Service({ id: 'service-id', name: 'Test Service' })

    const createServiceSpy = spyOn(service.client, 'createService').and.returnValue(Promise.resolve(mockService))

    service.createService('Test Service').subscribe((response) => {
      expect(response).toBeDefined()
      expect(response).toEqual(mockService)
    })

    expect(createServiceSpy).toHaveBeenCalled()
    expect(createServiceSpy).toHaveBeenCalledTimes(1)
    expect(createServiceSpy).toHaveBeenCalledWith({ service: new Service({ name: 'Test Service', id: '' }) })
  })

  it('should update service', async () => {
    const updateServiceSpy = spyOn(service.client, 'updateService').and.returnValue(
      Promise.resolve(new Service({ id: 'service-id', name: 'New Test Service' })),
    )

    expect(updateServiceSpy).toHaveBeenCalledTimes(0)

    service.updateService('service-id', 'New Test Service').subscribe((response) => {
      expect(response).toBeDefined()
      expect(response).toEqual(new Service({ id: 'service-id', name: 'New Test Service' }))
    })

    expect(updateServiceSpy).toHaveBeenCalled()
    expect(updateServiceSpy).toHaveBeenCalledTimes(1)
    expect(updateServiceSpy).toHaveBeenCalledWith({
      service: new Service({ id: 'service-id', name: 'New Test Service' }),
    })
  })

  it('should delete service', async () => {
    const deleteServiceSpy = spyOn(service.client, 'deleteService').and.returnValue(Promise.resolve(new Empty({})))

    expect(deleteServiceSpy).toHaveBeenCalledTimes(0)

    service.deleteService('service-id').subscribe((response) => {
      expect(response).toBeDefined()
      expect(response).toEqual(new Empty({}))
    })

    expect(deleteServiceSpy).toHaveBeenCalledTimes(1)
    expect(deleteServiceSpy).toHaveBeenCalledWith({ id: 'service-id' })
  })

  it('should list translations', async () => {
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

    const listTranslationsSpy = spyOn(service.client, 'listTranslations').and.returnValue(Promise.resolve(mockData))

    expect(listTranslationsSpy).toHaveBeenCalledTimes(0)

    service.listTranslations('service-id').subscribe((response) => {
      expect(response).toBeDefined()
      expect(response.length).toBe(2)
      expect(response).toEqual(mockData.translations)
    })

    expect(listTranslationsSpy).toHaveBeenCalledTimes(1)
    expect(listTranslationsSpy).toHaveBeenCalledWith({ serviceId: 'service-id' })
  })

  it('should create translation', async () => {
    const mockData = new Translation({ language: 'lv', original: false, messages: [] })
    const createTranslationSpy = spyOn(service.client, 'createTranslation').and.returnValue(Promise.resolve(mockData))

    expect(createTranslationSpy).toHaveBeenCalledTimes(0)

    service.createTranslation('service-id', 'lv').subscribe((response) => {
      expect(response).toBeDefined()
      expect(response).toEqual(mockData)
    })

    expect(createTranslationSpy).toHaveBeenCalledTimes(1)
    expect(createTranslationSpy).toHaveBeenCalledWith({ serviceId: 'service-id', translation: { language: 'lv' } })
  })

  it('should update translation', async () => {
    const mockReturnedTranslation = new Translation({
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
    const updateTranslationSpy = spyOn(service.client, 'updateTranslation').and.returnValue(
      Promise.resolve(mockReturnedTranslation),
    )

    expect(updateTranslationSpy).toHaveBeenCalledTimes(0)

    service
      .updateTranslation(
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
      .subscribe((response) => {
        expect(response).toBeDefined()
        expect(response).toEqual(mockReturnedTranslation)
      })

    expect(updateTranslationSpy).toHaveBeenCalledTimes(1)
    expect(updateTranslationSpy).toHaveBeenCalledWith({
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

  it('should upload translation file', async () => {
    const uploadTranslationFileSpy = spyOn(service.client, 'uploadTranslationFile').and.returnValue(
      Promise.resolve(new Empty({})),
    )

    expect(uploadTranslationFileSpy).toHaveBeenCalledTimes(0)

    service
      .uploadTranslationFile(new Uint8Array(), 'en', Schema.POT, true, 'service-id', true)
      .subscribe((response) => {
        expect(response).toBeDefined()
        expect(response).toEqual(new Empty({}))
      })

    expect(uploadTranslationFileSpy).toHaveBeenCalledTimes(1)
    expect(uploadTranslationFileSpy).toHaveBeenCalledWith({
      data: new Uint8Array(),
      language: 'en',
      schema: Schema.POT,
      original: true,
      serviceId: 'service-id',
      populateTranslations: true,
    })
  })

  it('should download translation file', async () => {
    const downloadTranslationFileSpy = spyOn(service.client, 'downloadTranslationFile').and.returnValue(
      Promise.resolve(new DownloadTranslationFileResponse({ data: new Uint8Array() })),
    )

    expect(downloadTranslationFileSpy).toHaveBeenCalledTimes(0)

    service.downloadTranslationFile('en', Schema.POT, 'service-id').subscribe((response) => {
      expect(response).toBeDefined()
      expect(response).toEqual(new DownloadTranslationFileResponse({ data: new Uint8Array() }))
    })

    expect(downloadTranslationFileSpy).toHaveBeenCalledTimes(1)
    expect(downloadTranslationFileSpy).toHaveBeenCalledWith({
      language: 'en',
      schema: Schema.POT,
      serviceId: 'service-id',
    })
  })
})
