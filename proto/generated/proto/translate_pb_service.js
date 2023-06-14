// package: translate.v1
// file: proto/translate.proto

var proto_translate_pb = require("../proto/translate_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TranslateService = (function () {
  function TranslateService() {}
  TranslateService.serviceName = "translate.v1.TranslateService";
  return TranslateService;
}());

TranslateService.GetService = {
  methodName: "GetService",
  service: TranslateService,
  requestStream: false,
  responseStream: false,
  requestType: proto_translate_pb.GetServiceRequest,
  responseType: proto_translate_pb.Service
};

TranslateService.ListServices = {
  methodName: "ListServices",
  service: TranslateService,
  requestStream: false,
  responseStream: false,
  requestType: proto_translate_pb.ListServicesRequest,
  responseType: proto_translate_pb.ListServicesResponse
};

TranslateService.CreateService = {
  methodName: "CreateService",
  service: TranslateService,
  requestStream: false,
  responseStream: false,
  requestType: proto_translate_pb.CreateServiceRequest,
  responseType: proto_translate_pb.Service
};

TranslateService.UpdateService = {
  methodName: "UpdateService",
  service: TranslateService,
  requestStream: false,
  responseStream: false,
  requestType: proto_translate_pb.UpdateServiceRequest,
  responseType: proto_translate_pb.Service
};

TranslateService.DeleteService = {
  methodName: "DeleteService",
  service: TranslateService,
  requestStream: false,
  responseStream: false,
  requestType: proto_translate_pb.DeleteServiceRequest,
  responseType: google_protobuf_empty_pb.Empty
};

TranslateService.UploadTranslationFile = {
  methodName: "UploadTranslationFile",
  service: TranslateService,
  requestStream: false,
  responseStream: false,
  requestType: proto_translate_pb.UploadTranslationFileRequest,
  responseType: google_protobuf_empty_pb.Empty
};

TranslateService.DownloadTranslationFile = {
  methodName: "DownloadTranslationFile",
  service: TranslateService,
  requestStream: false,
  responseStream: false,
  requestType: proto_translate_pb.DownloadTranslationFileRequest,
  responseType: proto_translate_pb.DownloadTranslationFileResponse
};

exports.TranslateService = TranslateService;

function TranslateServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TranslateServiceClient.prototype.getService = function getService(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TranslateService.GetService, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TranslateServiceClient.prototype.listServices = function listServices(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TranslateService.ListServices, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TranslateServiceClient.prototype.createService = function createService(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TranslateService.CreateService, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TranslateServiceClient.prototype.updateService = function updateService(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TranslateService.UpdateService, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TranslateServiceClient.prototype.deleteService = function deleteService(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TranslateService.DeleteService, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TranslateServiceClient.prototype.uploadTranslationFile = function uploadTranslationFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TranslateService.UploadTranslationFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TranslateServiceClient.prototype.downloadTranslationFile = function downloadTranslationFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TranslateService.DownloadTranslationFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.TranslateServiceClient = TranslateServiceClient;

