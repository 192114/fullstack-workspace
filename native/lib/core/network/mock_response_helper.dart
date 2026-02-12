import 'package:flutter_mvvm_template/core/network/exceptions.dart';

class MockResponseHelper {
  MockResponseHelper._();

  // 模拟网络延迟
  static Future<void> delay([int milliseconds = 500]) {
    return Future.delayed(Duration(milliseconds: milliseconds));
  }

  // 返回成功响应
  static Future<T> success<T>({
    required T data,
    String message = 'success',
    int delayMs = 500,
  }) async {
    await delay(delayMs);
    return data;
  }

  // 返回错误响应
  static Future<T> error<T>({
    required String message,
    int code = 400,
    int delayMs = 500,
  }) async {
    await delay(delayMs);
    throw AppException(message, code);
  }
}