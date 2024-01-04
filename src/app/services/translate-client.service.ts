import { Injectable } from '@angular/core'
import { TranslateService } from '@buf/expectdigital_translate-agent.bufbuild_connect-es/translate/v1/translate_connect'
import {
  CreateServiceRequest,
  DownloadTranslationFileRequest,
  ListServicesResponse,
  Schema,
  Service,
  Translation,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { PromiseClient, createPromiseClient } from '@bufbuild/connect'
import { createGrpcWebTransport } from '@bufbuild/connect-web'
import { Empty } from '@bufbuild/protobuf'
import { Observable, from, map } from 'rxjs'
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

  updateService(id: string, name: string): Observable<Service> {
    return from(this.client.updateService({ service: new Service({ id, name }) }))
  }

  deleteService(serviceId: string): Observable<Empty> {
    return from(this.client.deleteService({ id: serviceId }))
  }

  listTranslations(serviceId: string) {
    return from(
      this.client.listTranslations({
        serviceId,
      }),
    ).pipe(
      map((v) => v.translations),
      map((v) => v.sort((a, b) => Number(b.original) - Number(a.original))),
      map((v) => {
        v.map((messages) => messages.messages.sort((a, b) => a.id.localeCompare(b.id)))
        return v
      }),
    )
  }

  createTranslation(serviceId: string, language?: string) {
    return from(this.client.createTranslation({ serviceId, translation: { language: language } }))
  }

  updateTranslation(serviceId: string, translation: Translation, populateTranslations?: boolean) {
    return from(this.client.updateTranslation({ serviceId, translation, populateTranslations }))
  }

  uploadTranslationFile(
    data: Uint8Array,
    language: string,
    schema: Schema | undefined,
    original: boolean,
    serviceId: string,
    populateTranslations: boolean,
  ): Observable<Empty> {
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
    const request = new DownloadTranslationFileRequest({ language, schema: schema, serviceId })
    return from(this.client.downloadTranslationFile(request))
  }
}
