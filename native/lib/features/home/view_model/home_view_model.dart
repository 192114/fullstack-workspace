import 'package:flutter_mvvm_template/features/home/models/user_model.dart';
import 'package:flutter_mvvm_template/features/home/repositories/user_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 可创建多个独立的provider
final usersProvider = AsyncNotifierProvider<UsersNotifier, List<UserModel>>(UsersNotifier.new);

// AsyncNotifier 适合数据的获取 riverpod 自动管理异步状态
class UsersNotifier extends AsyncNotifier<List<UserModel>> {
  @override
  Future<List<UserModel>> build() async {
    final repo = ref.watch(userRepositoryProvider);
    return repo.getUsers();
  }

  Future<void> reload() async {
    state = const AsyncValue.loading();
    final repo = ref.watch(userRepositoryProvider);
    state = await AsyncValue.guard(repo.getUsers);
  }
}
