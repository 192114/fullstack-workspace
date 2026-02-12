import 'package:dio/dio.dart';
import 'package:flutter_mvvm_template/core/config/env.dart';
import 'package:flutter_mvvm_template/core/network/api_response.dart';
import 'package:flutter_mvvm_template/core/network/exceptions.dart';
import 'package:flutter_mvvm_template/core/storage/token_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: EnvConfig.baseUrl,
      connectTimeout: const Duration(milliseconds: EnvConfig.connectTimeout),
      receiveTimeout: const Duration(milliseconds: EnvConfig.receiveTimeout),
      responseType: ResponseType.json,
    ),
  );

  final tokenStorage = ref.watch(tokenStorageProvider);

  dio.interceptors.addAll([
    TokenInterceptor(tokenStorage),
    if (!EnvConfig.isProduction)
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
      ),
    ResponseInterceptor(),
    ErrorInterceptor(),
  ]);

  return dio;
});

// 响应的统一处理
class ResponseInterceptor extends Interceptor {
  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    // 如果数据不是 Map 直接通过
    if (response.data is! Map<String, dynamic>) {
      handler.next(response);
      return;
    }

    final data = response.data as Map<String, dynamic>;

    // 检查是否是统一的返回格式
    if (data.containsKey('code') && data.containsKey('message')) {
      final code = data['code'] as int? ?? 200;

      if (code == 200) {
        // 成功的情况
        response.data = ApiResponse.fromJson(data, null);
        handler.next(response);
      } else {
        // 异常的情况
        final message = data['message'] as String? ?? '请求失败';
        handler.reject(
          DioException(
            requestOptions: response.requestOptions,
            response: response,
            type: DioExceptionType.badResponse,
            error: AppException(message, code),
          ),
        );
      }
    } else {
      // 不符合结构直接返回
      handler.next(response);
    }
  }
}

// 错误处理
class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppException exception;

    if (err.error is AppException) {
      handler.next(err);
      return;
    }

    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        exception = NetworkException('请求超时，请检查网络');
        break;

      case DioExceptionType.connectionError:
        exception = NetworkException('网络连接失败');
        break;

      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode;

        if (statusCode == 401) {
          exception = UnauthorizedException();
        } else if (statusCode != null && statusCode >= 500) {
          exception = ServerException('服务器错误（$statusCode）', statusCode);
        } else {
          String message = '请求失败';

          if (err.response?.data is Map<String, dynamic>) {
            final data = err.response!.data as Map<String, dynamic>;
            message = data['message'] as String? ?? message;
          }

          exception = ServerException(message, statusCode);
        }
        break;
      case DioExceptionType.cancel:
        exception = const AppException('请求已取消');
        break;
      default:
        exception = AppException('未知错误: ${err.message}');
    }

    handler.reject(err.copyWith(error: exception));
  }
}

/// token的拦截器
class TokenInterceptor extends Interceptor {
  final TokenStorage tokenStorage;

  const TokenInterceptor(this.tokenStorage);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = tokenStorage.accessToken;

    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    handler.next(options);
  }
}
