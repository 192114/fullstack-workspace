import 'package:flutter_mvvm_template/core/config/env.dart';
import 'package:flutter_mvvm_template/core/network/dio_client.dart';
import 'package:flutter_mvvm_template/features/home/datasources/user_remote_data_source.dart';
import 'package:flutter_mvvm_template/features/home/models/user_model.dart';
import 'package:flutter_mvvm_template/features/home/repositories/user_repository.dart';
import 'package:flutter_mvvm_template/features/home/repositories/user_repository_mock.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart'; 

class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource dataSource;

  const UserRepositoryImpl(this.dataSource);

  @override
  Future<List<UserModel>> getUsers() {
    return dataSource.getUsers();
  }
}

final userRepositoryProvider = Provider<UserRepository>((ref) {
  if (EnvConfig.isMock) {
    return const UserRepositoryMock();
  }

  final dio = ref.watch(dioProvider);
  return UserRepositoryImpl(UserRemoteDataSource(dio));
});
