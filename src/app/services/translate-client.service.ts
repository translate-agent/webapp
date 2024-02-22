import { Injectable } from '@angular/core'
import {
  DownloadTranslationFileResponse,
  ListServicesResponse,
  Schema,
  Service,
  Translation,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb.js'
import { TranslateService } from '@buf/expectdigital_translate-agent.connectrpc_es/translate/v1/translate_connect'
import { Empty } from '@bufbuild/protobuf'
import { createPromiseClient } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { Observable, from, map } from 'rxjs'
import { environment } from 'src/environments/environments'

@Injectable({
  providedIn: 'root',
})
export class TranslateClientService {
  private transport = createGrpcWebTransport({
    baseUrl: environment.backendUrl,
  })

  readonly client = createPromiseClient(TranslateService, this.transport)

  constructor() {}

  listServices(): Observable<ListServicesResponse> {
    return from(this.client.listServices({}))
  }

  getService(serviceId: string): Observable<Service> {
    return from(this.client.getService({ id: serviceId }))
  }

  createService(serviceName: string): Observable<Service> {
    return from(
      this.client.createService({
        service: new Service({ name: serviceName }),
      }),
    )
  }

  updateService(id: string, name: string): Observable<Service> {
    return from(this.client.updateService({ service: new Service({ id, name }) }))
  }

  deleteService(serviceId: string): Observable<Empty> {
    return from(this.client.deleteService({ id: serviceId }))
  }

  listTranslations(serviceId: string): Observable<Translation[]> {
    return from(
      this.client.listTranslations({
        serviceId,
      }),
    ).pipe(
      map((v) => v.translations),
      map((v) => v.sort((a, b) => Number(b.original) - Number(a.original))),
    )
  }

  createTranslation(serviceId: string, language?: string): Observable<Translation> {
    return from(this.client.createTranslation({ serviceId, translation: { language: language } }))
  }

  updateTranslation(
    serviceId: string,
    translation: Translation,
    paths: string[],
    populateTranslations?: boolean,
  ): Observable<Translation> {
    return from(
      this.client.updateTranslation({
        serviceId,
        translation,
        updateMask: { paths },
        populateTranslations,
      }),
    )
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

  downloadTranslationFile(
    language: string,
    schema: Schema,
    serviceId: string,
  ): Observable<DownloadTranslationFileResponse> {
    return from(this.client.downloadTranslationFile({ language, schema: schema, serviceId }))
  }
}
