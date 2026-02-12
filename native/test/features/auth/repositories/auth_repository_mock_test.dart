import 'package:flutter_mvvm_template/core/network/exceptions.dart';
import 'package:flutter_mvvm_template/features/auth/repositories/auth_repository_mock.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  late AuthRepositoryMock repository;

  setUp(() {
    repository = const AuthRepositoryMock();
  });

  group('AuthRepositoryMock', () {
    test('login succeeds with valid admin credentials', () async {
      final response = await repository.login('admin', '123456');

      expect(response.accessToken, isNotEmpty);
      expect(response.refreshToken, isNotEmpty);
      expect(response.user.username, 'admin');
      expect(response.user.email, 'admin@example.com');
    });

    test('login succeeds with valid test credentials', () async {
      final response = await repository.login('test', '123456');

      expect(response.accessToken, isNotEmpty);
      expect(response.user.username, 'test');
    });

    test('login throws when username does not exist', () async {
      expect(
        () => repository.login('nonexistent', '123456'),
        throwsA(isA<AppException>()),
      );
    });

    test('login throws when password is wrong', () async {
      expect(
        () => repository.login('admin', 'wrongpassword'),
        throwsA(isA<AppException>()),
      );
    });
  });
}
