import { Injectable } from '@angular/core'
import {
  CreateServiceRequest,
  ListServicesRequest,
  ListServicesResponse,
  Service,
} from 'proto/generated/proto/translate_pb'
import { ServiceError, TranslateServiceClient } from 'proto/generated/proto/translate_pb_service'
import { environment } from 'src/environments/environments'

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private client: TranslateServiceClient

  constructor() {
    this.client = new TranslateServiceClient(environment.backendUrl)
  }

  listService() {
    const request = new ListServicesRequest()
    this.client.listServices(request, (error: ServiceError | null, responseMessage: ListServicesResponse | null) => {
      console.log(error)
      console.log(responseMessage)
    })
  }

  createService() {
    const request = new CreateServiceRequest()
    const service1 = new Service()
    service1.setId('abc')
    service1.setName('TEST')
    request.setService(service1)
    this.client.createService(request, (error: ServiceError | null, responseMessage: Service | null) => {
      if (error) {
        console.error('Error:', error)
        return
      }
      console.log('Response:', responseMessage)
    })
  }
}
