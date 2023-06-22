import { Injectable } from '@angular/core'
import { TranslateService } from '@buf/expectdigital_translate-agent.bufbuild_connect-es/translate/v1/translate_connect'
import {
  CreateServiceRequest,
  ListMessagesResponse,
  ListServicesResponse,
  Service,
} from '@buf/expectdigital_translate-agent.bufbuild_es/translate/v1/translate_pb'
import { PromiseClient, createPromiseClient } from '@bufbuild/connect'
import { createGrpcWebTransport } from '@bufbuild/connect-web'
import { environment } from 'src/environments/environments'

@Injectable({
  providedIn: 'root',
})
export class TranslateClientService {
  private transport = createGrpcWebTransport({ baseUrl: environment.backendUrl })

  client: PromiseClient<typeof TranslateService>

  constructor() {
    this.client = createPromiseClient(TranslateService, this.transport)
  }

  listService(): Promise<ListServicesResponse> {
    return this.client.listServices({})
  }

  createService(serviceName: string): Promise<Service> {
    const request = new CreateServiceRequest({ service: new Service({ name: serviceName }) })
    return this.client.createService(request)
  }

  listMessages(serviceId: string): Promise<ListMessagesResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.client.listMessages({ serviceId })
  }
}
