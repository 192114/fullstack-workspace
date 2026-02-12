import 'package:flutter_mvvm_template/features/home/models/user_model.dart';

abstract class UserRepository {
  Future<List<UserModel>> getUsers();
}