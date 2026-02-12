class AppException implements Exception {
  final String message;
  final int? statusCode;

  const AppException(this.message, [this.statusCode]);

  @override
  String toString() {
    return message;
  }
}

class NetworkException extends AppException {
  NetworkException([super.message = '网络连接失败', super.statusCode]);
}

class ServerException extends AppException {
  ServerException([super.message = '服务端错误', super.statusCode]);
}

class UnauthorizedException extends AppException {
  UnauthorizedException([super.message = '未授权，请重新登录', super.statusCode = 401]);
}
