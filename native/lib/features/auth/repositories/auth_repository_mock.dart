import 'package:flutter_mvvm_template/core/network/mock_response_helper.dart';
import 'package:flutter_mvvm_template/features/auth/models/auth_model.dart';
import 'package:flutter_mvvm_template/features/auth/repositories/auth_mock_data.dart';
import 'package:flutter_mvvm_template/features/auth/repositories/auth_repository.dart';

class AuthRepositoryMock implements AuthRepository {
  const AuthRepositoryMock();

  @override
  Future<LoginResponse> login(String username, String password) async {
    // 模拟延迟
    await MockResponseHelper.delay(800);
    
    // 使用原有的登录逻辑（会抛出 Exception）
    // 这里我们需要将 Exception 转换为 AppException
    try {
      return await AuthMockData.login(username, password);
    } catch (e) {
      // 将普通 Exception 转换为 AppException 以保持一致性
      return MockResponseHelper.error(
        message: e.toString(),
        code: 401,
        delayMs: 0, // 已经延迟过了
      );
    }
  }
}