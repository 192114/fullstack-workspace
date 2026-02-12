import 'package:flutter_mvvm_template/features/home/models/user_model.dart';
import 'package:flutter_mvvm_template/features/home/repositories/user_repository.dart';
import 'package:flutter_mvvm_template/features/home/repositories/user_repository_impl.dart';
import 'package:flutter_mvvm_template/features/home/view_model/home_view_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('UsersNotifier', () {
    test('build returns users from repository', () async {
      final mockUsers = [
        const UserModel(id: '1', name: 'Alice', email: 'alice@test.com'),
        const UserModel(id: '2', name: 'Bob', email: 'bob@test.com'),
      ];

      final container = ProviderContainer(
        overrides: [
          userRepositoryProvider.overrideWithValue(_MockUserRepository(mockUsers)),
        ],
      );

      addTearDown(container.dispose);

      final notifier = container.read(usersProvider.notifier);
      final users = await notifier.future;

      expect(users, mockUsers);
    });

    test('reload fetches fresh data', () async {
      final mockUsers = [
        const UserModel(id: '1', name: 'Alice', email: 'alice@test.com'),
      ];

      final container = ProviderContainer(
        overrides: [
          userRepositoryProvider.overrideWithValue(_MockUserRepository(mockUsers)),
        ],
      );

      addTearDown(container.dispose);

      final notifier = container.read(usersProvider.notifier);
      await notifier.reload();

      final state = container.read(usersProvider);
      expect(state.value, mockUsers);
    });
  });
}

class _MockUserRepository implements UserRepository {
  _MockUserRepository(this._users);

  final List<UserModel> _users;

  @override
  Future<List<UserModel>> getUsers() async => _users;
}
