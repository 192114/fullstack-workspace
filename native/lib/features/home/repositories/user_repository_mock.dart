import 'package:flutter_mvvm_template/core/network/mock_response_helper.dart';
import 'package:flutter_mvvm_template/features/home/models/user_model.dart';
import 'package:flutter_mvvm_template/features/home/repositories/user_mock_data.dart';
import 'package:flutter_mvvm_template/features/home/repositories/user_repository.dart';

/// 用户仓储 Mock 实现
class UserRepositoryMock implements UserRepository {
  const UserRepositoryMock();

  @override
  Future<List<UserModel>> getUsers() async {
    // 使用统一的 Mock 响应助手
    return MockResponseHelper.success(
      data: UserMockData.users,
      message: '获取用户列表成功',
      delayMs: 800,
    );
    
    // 可选：模拟错误场景
    // return MockResponseHelper.error(
    //   message: '模拟服务器错误',
    //   code: 500,
    // );
  }

  /// 根据 ID 获取用户（示例扩展方法）
  Future<UserModel?> getUserById(String id) async {
    return MockResponseHelper.success(
      data: UserMockData.getUserById(id),
      message: '获取用户详情成功',
    );
  }
}