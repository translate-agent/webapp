import { Injectable } from '@angular/core'
import { TranslateService } from '@buf/expectdigital_translate-agent.bufbuild_connect-es/translate/v1/translate_connect'
import {
  CreateServiceRequest,
  ListServicesResponse,
  Messages,
  Schema,
  Service,
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

  createService(serviceName: string): Observable<Service> {
    const request = new CreateServiceRequest({
      service: new Service({ name: serviceName }),
    })
    return from(this.client.createService(request))
  }

  listMessages(serviceId: string) {
    return from(
      this.client.listMessages({
        serviceId,
      })
    )
  }

  updateMessages(serviceId: string, messages: Messages) {
    return from(this.client.updateMessages({ serviceId, messages }))
  }

  updateService(service: Service): Observable<Service> {
    return from(this.client.updateService({ service }))
  }

  delete(serviceId: string): Observable<Empty> {
    return from(this.client.deleteService({ id: serviceId }))
  }

  uploadTranslationFile(
    data: Uint8Array,
    language: string,
    schema: Schema,
    original: boolean,
    serviceId: string,
    populateTranslations: boolean
  ): Observable<Empty> {
    return from(
      this.client.uploadTranslationFile({
        language,
        data,
        schema,
        original,
        serviceId,
        populateTranslations,
      })
    )
  }
}
