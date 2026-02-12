import 'package:flutter_mvvm_template/features/auth/models/auth_model.dart';

abstract class AuthRepository {
  /// 登录
  Future<LoginResponse> login(String username, String password);
}
