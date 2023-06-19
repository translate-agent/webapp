import { Injectable } from '@angular/core'
import { TranslateService } from '@buf/expectdigital_translate-agent.bufbuild_connect-es/translate/v1/translate_connect'
import {
  CreateServiceRequest,
  ListServicesResponse,
  Service,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { createPromiseClient } from '@bufbuild/connect'
import { createGrpcWebTransport } from '@bufbuild/connect-web'
import { environment } from 'src/environments/environments'

@Injectable({
  providedIn: 'root',
})
export class TranslateClientService {
  readonly transport = createGrpcWebTransport({ baseUrl: environment.backendUrl })

  readonly client = createPromiseClient(TranslateService, this.transport)

  constructor() {}

  listService(): Promise<ListServicesResponse> {
    return this.client.listServices({})
  }

  createService(serviceName: string): Promise<Service> {
    const request = new CreateServiceRequest({ service: new Service({ name: serviceName }) })

    return this.client.createService(request)
  }
}
