import 'package:flutter_mvvm_template/core/config/env.dart';
import 'package:flutter_mvvm_template/features/auth/models/auth_model.dart';
import 'package:flutter_mvvm_template/features/auth/repositories/auth_repository.dart';
import 'package:flutter_mvvm_template/features/auth/repositories/auth_repository_mock.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthRepositoryImpl implements AuthRepository {
  const AuthRepositoryImpl();

  /// 在此接入真实登录 API，调用后端接口并返回 [LoginResponse]。
  @override
  Future<LoginResponse> login(String username, String password) {
    throw UnimplementedError('真实登录接口待实现');
  }
}

final authRepositoryProvider = Provider((ref) {
  if (EnvConfig.isMock) {
    return const AuthRepositoryMock();
  }

  return const AuthRepositoryImpl();
});
