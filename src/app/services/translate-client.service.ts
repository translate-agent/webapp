import { Injectable } from '@angular/core'
import { TranslateService } from '@buf/expectdigital_translate-agent.bufbuild_connect-es/translate/v1/translate_connect'
import {
  CreateServiceRequest,
  DownloadTranslationFileRequest,
  DownloadTranslationFileResponse,
  ListServicesResponse,
  ListTranslationsResponse,
  Schema,
  Service,
  Translation,
  UpdateTranslationRequest,
  UploadTranslationFileRequest,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { PromiseClient, createPromiseClient } from '@bufbuild/connect'
import { createGrpcWebTransport } from '@bufbuild/connect-web'
import { Empty } from '@bufbuild/protobuf'
import { Observable, from } from 'rxjs'
import { environment } from 'src/environments/environments'

@Injectable({
  providedIn: 'root',
})
export class TranslateClientService {
  private transport = createGrpcWebTransport({
    baseUrl: environment.backendUrl,
  })

  private client: PromiseClient<typeof TranslateService>

  constructor() {
    this.client = createPromiseClient(TranslateService, this.transport)
  }

  listService(): Observable<ListServicesResponse> {
    return from(this.client.listServices({}))
  }

  getService(serviceId: string) {
    return from(this.client.getService({ id: serviceId }))
  }

  createService(serviceName: string): Observable<Service> {
    const request = new CreateServiceRequest({
      service: new Service({ name: serviceName }),
    })
    return from(this.client.createService(request))
  }

  listTranslations(serviceId: string): Observable<ListTranslationsResponse> {
    return from(
      this.client.listTranslations({
        serviceId,
      }),
    )
  }

  updateTranslation(serviceId: string, translation: Translation, populateTranslations?: boolean) {
    UpdateTranslationRequest
    return from(this.client.updateTranslation({ serviceId, translation, populateTranslations }))
  }

  createTranslation(serviceId: string, language?: string) {
    return from(this.client.createTranslation({ serviceId, translation: { language: language } }))
  }

  updateService(service: Service): Observable<Service> {
    return from(this.client.updateService({ service }))
  }

  deleteService(serviceId: string): Observable<Empty> {
    return from(this.client.deleteService({ id: serviceId }))
  }

  uploadTranslationFile(
    data: Uint8Array,
    language: string,
    schema: Schema | undefined,
    original: boolean,
    serviceId: string,
    populateTranslations: boolean,
  ): Observable<Empty> {
    UploadTranslationFileRequest
    return from(
      this.client.uploadTranslationFile({
        language,
        data,
        schema,
        original,
        serviceId,
        populateTranslations,
      }),
    )
  }

  downloadTranslationFile(language: string, schema: Schema, serviceId: string) {
    DownloadTranslationFileRequest
    DownloadTranslationFileResponse
    return from(this.client.downloadTranslationFile({ language, schema, serviceId }))
  }
}
