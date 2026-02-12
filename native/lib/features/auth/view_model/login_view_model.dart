import 'dart:async';

import 'package:flutter_mvvm_template/core/storage/token_storage.dart';
import 'package:flutter_mvvm_template/features/auth/models/auth_model.dart';
import 'package:flutter_mvvm_template/features/auth/repositories/auth_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final loginNotifierProvider =
    AsyncNotifierProvider<LoginNotifier, LoginResponse?>(LoginNotifier.new);

class LoginNotifier extends AsyncNotifier<LoginResponse?> {
  @override
  Future<LoginResponse?> build() async {
    // 初始化状态为 未登录状态
    return null;
  }

  // 登录
  Future<bool> login(String username, String password) async {
    if (username.isEmpty || password.isEmpty) {
      state = AsyncValue.error(Exception('用户名密码不能为空'), StackTrace.current);
      return false;
    }

    state = const AsyncValue.loading();

    try {
      final authRepository = ref.read(authRepositoryProvider);
      final response = await authRepository.login(username, password);

      final tokenStorage = ref.read(tokenStorageProvider);

      await tokenStorage.saveTokens(
        response.accessToken,
        response.refreshToken,
      );

      state = AsyncValue.data(response);
      return true;
    } catch (e, stackTrace) {
      state = AsyncValue.error(e, stackTrace);
      return false;
    }
  }

  /// 登出
  Future<void> logout() async {
    final tokenStorage = ref.read(tokenStorageProvider);
    await tokenStorage.clearTokens();
    state = const AsyncValue.data(null);
  }
}
