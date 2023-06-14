// package: translate.v1
// file: proto/translate.proto

import * as jspb from 'google-protobuf'
import * as google_protobuf_field_mask_pb from 'google-protobuf/google/protobuf/field_mask_pb'

export class Message extends jspb.Message {
  getId(): string
  setId(value: string): void

  getMessage(): string
  setMessage(value: string): void

  getDescription(): string
  setDescription(value: string): void

  getFuzzy(): boolean
  setFuzzy(value: boolean): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): Message.AsObject
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): Message
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message
}

export namespace Message {
  export type AsObject = {
    id: string
    message: string
    description: string
    fuzzy: boolean
  }
}

export class Messages extends jspb.Message {
  getLanguage(): string
  setLanguage(value: string): void

  clearMessagesList(): void
  getMessagesList(): Array<Message>
  setMessagesList(value: Array<Message>): void
  addMessages(value?: Message, index?: number): Message

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): Messages.AsObject
  static toObject(includeInstance: boolean, msg: Messages): Messages.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: Messages, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): Messages
  static deserializeBinaryFromReader(message: Messages, reader: jspb.BinaryReader): Messages
}

export namespace Messages {
  export type AsObject = {
    language: string
    messagesList: Array<Message.AsObject>
  }
}

export class Service extends jspb.Message {
  getId(): string
  setId(value: string): void

  getName(): string
  setName(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): Service.AsObject
  static toObject(includeInstance: boolean, msg: Service): Service.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: Service, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): Service
  static deserializeBinaryFromReader(message: Service, reader: jspb.BinaryReader): Service
}

export namespace Service {
  export type AsObject = {
    id: string
    name: string
  }
}

export class UploadTranslationFileRequest extends jspb.Message {
  getLanguage(): string
  setLanguage(value: string): void

  getData(): Uint8Array | string
  getData_asU8(): Uint8Array
  getData_asB64(): string
  setData(value: Uint8Array | string): void

  getSchema(): SchemaMap[keyof SchemaMap]
  setSchema(value: SchemaMap[keyof SchemaMap]): void

  getServiceId(): string
  setServiceId(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): UploadTranslationFileRequest.AsObject
  static toObject(includeInstance: boolean, msg: UploadTranslationFileRequest): UploadTranslationFileRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: UploadTranslationFileRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): UploadTranslationFileRequest
  static deserializeBinaryFromReader(
    message: UploadTranslationFileRequest,
    reader: jspb.BinaryReader
  ): UploadTranslationFileRequest
}

export namespace UploadTranslationFileRequest {
  export type AsObject = {
    language: string
    data: Uint8Array | string
    schema: SchemaMap[keyof SchemaMap]
    serviceId: string
  }
}

export class DownloadTranslationFileRequest extends jspb.Message {
  getLanguage(): string
  setLanguage(value: string): void

  getSchema(): SchemaMap[keyof SchemaMap]
  setSchema(value: SchemaMap[keyof SchemaMap]): void

  getServiceId(): string
  setServiceId(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DownloadTranslationFileRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DownloadTranslationFileRequest
  ): DownloadTranslationFileRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: DownloadTranslationFileRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DownloadTranslationFileRequest
  static deserializeBinaryFromReader(
    message: DownloadTranslationFileRequest,
    reader: jspb.BinaryReader
  ): DownloadTranslationFileRequest
}

export namespace DownloadTranslationFileRequest {
  export type AsObject = {
    language: string
    schema: SchemaMap[keyof SchemaMap]
    serviceId: string
  }
}

export class DownloadTranslationFileResponse extends jspb.Message {
  getData(): Uint8Array | string
  getData_asU8(): Uint8Array
  getData_asB64(): string
  setData(value: Uint8Array | string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DownloadTranslationFileResponse.AsObject
  static toObject(
    includeInstance: boolean,
    msg: DownloadTranslationFileResponse
  ): DownloadTranslationFileResponse.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: DownloadTranslationFileResponse, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DownloadTranslationFileResponse
  static deserializeBinaryFromReader(
    message: DownloadTranslationFileResponse,
    reader: jspb.BinaryReader
  ): DownloadTranslationFileResponse
}

export namespace DownloadTranslationFileResponse {
  export type AsObject = {
    data: Uint8Array | string
  }
}

export class GetServiceRequest extends jspb.Message {
  getId(): string
  setId(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): GetServiceRequest.AsObject
  static toObject(includeInstance: boolean, msg: GetServiceRequest): GetServiceRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: GetServiceRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): GetServiceRequest
  static deserializeBinaryFromReader(message: GetServiceRequest, reader: jspb.BinaryReader): GetServiceRequest
}

export namespace GetServiceRequest {
  export type AsObject = {
    id: string
  }
}

export class ListServicesRequest extends jspb.Message {
  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ListServicesRequest.AsObject
  static toObject(includeInstance: boolean, msg: ListServicesRequest): ListServicesRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: ListServicesRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ListServicesRequest
  static deserializeBinaryFromReader(message: ListServicesRequest, reader: jspb.BinaryReader): ListServicesRequest
}

export namespace ListServicesRequest {
  export type AsObject = {}
}

export class ListServicesResponse extends jspb.Message {
  clearServicesList(): void
  getServicesList(): Array<Service>
  setServicesList(value: Array<Service>): void
  addServices(value?: Service, index?: number): Service

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): ListServicesResponse.AsObject
  static toObject(includeInstance: boolean, msg: ListServicesResponse): ListServicesResponse.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: ListServicesResponse, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): ListServicesResponse
  static deserializeBinaryFromReader(message: ListServicesResponse, reader: jspb.BinaryReader): ListServicesResponse
}

export namespace ListServicesResponse {
  export type AsObject = {
    servicesList: Array<Service.AsObject>
  }
}

export class CreateServiceRequest extends jspb.Message {
  hasService(): boolean
  clearService(): void
  getService(): Service | undefined
  setService(value?: Service): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): CreateServiceRequest.AsObject
  static toObject(includeInstance: boolean, msg: CreateServiceRequest): CreateServiceRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: CreateServiceRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): CreateServiceRequest
  static deserializeBinaryFromReader(message: CreateServiceRequest, reader: jspb.BinaryReader): CreateServiceRequest
}

export namespace CreateServiceRequest {
  export type AsObject = {
    service?: Service.AsObject
  }
}

export class UpdateServiceRequest extends jspb.Message {
  hasService(): boolean
  clearService(): void
  getService(): Service | undefined
  setService(value?: Service): void

  hasUpdateMask(): boolean
  clearUpdateMask(): void
  getUpdateMask(): google_protobuf_field_mask_pb.FieldMask | undefined
  setUpdateMask(value?: google_protobuf_field_mask_pb.FieldMask): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): UpdateServiceRequest.AsObject
  static toObject(includeInstance: boolean, msg: UpdateServiceRequest): UpdateServiceRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: UpdateServiceRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): UpdateServiceRequest
  static deserializeBinaryFromReader(message: UpdateServiceRequest, reader: jspb.BinaryReader): UpdateServiceRequest
}

export namespace UpdateServiceRequest {
  export type AsObject = {
    service?: Service.AsObject
    updateMask?: google_protobuf_field_mask_pb.FieldMask.AsObject
  }
}

export class DeleteServiceRequest extends jspb.Message {
  getId(): string
  setId(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): DeleteServiceRequest.AsObject
  static toObject(includeInstance: boolean, msg: DeleteServiceRequest): DeleteServiceRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> }
  static serializeBinaryToWriter(message: DeleteServiceRequest, writer: jspb.BinaryWriter): void
  static deserializeBinary(bytes: Uint8Array): DeleteServiceRequest
  static deserializeBinaryFromReader(message: DeleteServiceRequest, reader: jspb.BinaryReader): DeleteServiceRequest
}

export namespace DeleteServiceRequest {
  export type AsObject = {
    id: string
  }
}

export interface SchemaMap {
  UNSPECIFIED: 0
  JSON_NG_LOCALIZE: 1
  JSON_NGX_TRANSLATE: 2
  GO: 3
  ARB: 4
  POT: 5
  XLIFF_12: 6
  XLIFF_2: 7
}

export const Schema: SchemaMap
