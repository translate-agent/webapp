// package: translate.v1
// file: proto/translate.proto

import { grpc } from '@improbable-eng/grpc-web'
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'
import * as proto_translate_pb from '../proto/translate_pb'

type TranslateServiceGetService = {
  readonly methodName: string
  readonly service: typeof TranslateService
  readonly requestStream: false
  readonly responseStream: false
  readonly requestType: typeof proto_translate_pb.GetServiceRequest
  readonly responseType: typeof proto_translate_pb.Service
}

type TranslateServiceListServices = {
  readonly methodName: string
  readonly service: typeof TranslateService
  readonly requestStream: false
  readonly responseStream: false
  readonly requestType: typeof proto_translate_pb.ListServicesRequest
  readonly responseType: typeof proto_translate_pb.ListServicesResponse
}

type TranslateServiceCreateService = {
  readonly methodName: string
  readonly service: typeof TranslateService
  readonly requestStream: false
  readonly responseStream: false
  readonly requestType: typeof proto_translate_pb.CreateServiceRequest
  readonly responseType: typeof proto_translate_pb.Service
}

type TranslateServiceUpdateService = {
  readonly methodName: string
  readonly service: typeof TranslateService
  readonly requestStream: false
  readonly responseStream: false
  readonly requestType: typeof proto_translate_pb.UpdateServiceRequest
  readonly responseType: typeof proto_translate_pb.Service
}

type TranslateServiceDeleteService = {
  readonly methodName: string
  readonly service: typeof TranslateService
  readonly requestStream: false
  readonly responseStream: false
  readonly requestType: typeof proto_translate_pb.DeleteServiceRequest
  readonly responseType: typeof google_protobuf_empty_pb.Empty
}

type TranslateServiceUploadTranslationFile = {
  readonly methodName: string
  readonly service: typeof TranslateService
  readonly requestStream: false
  readonly responseStream: false
  readonly requestType: typeof proto_translate_pb.UploadTranslationFileRequest
  readonly responseType: typeof google_protobuf_empty_pb.Empty
}

type TranslateServiceDownloadTranslationFile = {
  readonly methodName: string
  readonly service: typeof TranslateService
  readonly requestStream: false
  readonly responseStream: false
  readonly requestType: typeof proto_translate_pb.DownloadTranslationFileRequest
  readonly responseType: typeof proto_translate_pb.DownloadTranslationFileResponse
}

export class TranslateService {
  static readonly serviceName: string
  static readonly GetService: TranslateServiceGetService
  static readonly ListServices: TranslateServiceListServices
  static readonly CreateService: TranslateServiceCreateService
  static readonly UpdateService: TranslateServiceUpdateService
  static readonly DeleteService: TranslateServiceDeleteService
  static readonly UploadTranslationFile: TranslateServiceUploadTranslationFile
  static readonly DownloadTranslationFile: TranslateServiceDownloadTranslationFile
}

export type ServiceError = { message: string; code: number; metadata: grpc.Metadata }
export type Status = { details: string; code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void
}
interface ResponseStream<T> {
  cancel(): void
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>
  end(): void
  cancel(): void
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>
  end(): void
  cancel(): void
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>
}

export class TranslateServiceClient {
  readonly serviceHost: string

  constructor(serviceHost: string, options?: grpc.RpcOptions)
  getService(
    requestMessage: proto_translate_pb.GetServiceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError | null, responseMessage: proto_translate_pb.Service | null) => void
  ): UnaryResponse
  getService(
    requestMessage: proto_translate_pb.GetServiceRequest,
    callback: (error: ServiceError | null, responseMessage: proto_translate_pb.Service | null) => void
  ): UnaryResponse
  listServices(
    requestMessage: proto_translate_pb.ListServicesRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError | null, responseMessage: proto_translate_pb.ListServicesResponse | null) => void
  ): UnaryResponse
  listServices(
    requestMessage: proto_translate_pb.ListServicesRequest,
    callback: (error: ServiceError | null, responseMessage: proto_translate_pb.ListServicesResponse | null) => void
  ): UnaryResponse
  createService(
    requestMessage: proto_translate_pb.CreateServiceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError | null, responseMessage: proto_translate_pb.Service | null) => void
  ): UnaryResponse
  createService(
    requestMessage: proto_translate_pb.CreateServiceRequest,
    callback: (error: ServiceError | null, responseMessage: proto_translate_pb.Service | null) => void
  ): UnaryResponse
  updateService(
    requestMessage: proto_translate_pb.UpdateServiceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError | null, responseMessage: proto_translate_pb.Service | null) => void
  ): UnaryResponse
  updateService(
    requestMessage: proto_translate_pb.UpdateServiceRequest,
    callback: (error: ServiceError | null, responseMessage: proto_translate_pb.Service | null) => void
  ): UnaryResponse
  deleteService(
    requestMessage: proto_translate_pb.DeleteServiceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError | null, responseMessage: google_protobuf_empty_pb.Empty | null) => void
  ): UnaryResponse
  deleteService(
    requestMessage: proto_translate_pb.DeleteServiceRequest,
    callback: (error: ServiceError | null, responseMessage: google_protobuf_empty_pb.Empty | null) => void
  ): UnaryResponse
  uploadTranslationFile(
    requestMessage: proto_translate_pb.UploadTranslationFileRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError | null, responseMessage: google_protobuf_empty_pb.Empty | null) => void
  ): UnaryResponse
  uploadTranslationFile(
    requestMessage: proto_translate_pb.UploadTranslationFileRequest,
    callback: (error: ServiceError | null, responseMessage: google_protobuf_empty_pb.Empty | null) => void
  ): UnaryResponse
  downloadTranslationFile(
    requestMessage: proto_translate_pb.DownloadTranslationFileRequest,
    metadata: grpc.Metadata,
    callback: (
      error: ServiceError | null,
      responseMessage: proto_translate_pb.DownloadTranslationFileResponse | null
    ) => void
  ): UnaryResponse
  downloadTranslationFile(
    requestMessage: proto_translate_pb.DownloadTranslationFileRequest,
    callback: (
      error: ServiceError | null,
      responseMessage: proto_translate_pb.DownloadTranslationFileResponse | null
    ) => void
  ): UnaryResponse
}
