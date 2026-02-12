import 'package:flutter_mvvm_template/features/home/models/user_model.dart';

class UserMockData {
  // 这是私有的构造函数 不可以实例化
  UserMockData._();

  // mock 数据
  static List<UserModel> get users => [
    const UserModel(id: '1', name: '张三', email: 'zhangsan@example.com'),
    const UserModel(id: '2', name: '李四', email: 'lisi@example.com'),
    const UserModel(id: '3', name: '王五', email: 'wangwu@example.com'),
    const UserModel(id: '4', name: 'John Doe', email: 'john@example.com'),
    const UserModel(id: '5', name: 'Jane Smith', email: 'jane@example.com'),
  ];

  // 根据id获取某个用户
  static UserModel? getUserById(String id) {
    try {
      return users.firstWhere((user) => user.id == id);
    } catch (e) {
      return null;
    }
  }

  // 模拟分页数据
  static List<UserModel> getUsersByPage(int page, int pageSize) {
    final startIndex = (page - 1) * pageSize;
    final endIndex = startIndex + pageSize;

    if (startIndex >= users.length) {
      return [];
    }

    return users.sublist(
      startIndex,
      endIndex > users.length ? users.length : endIndex,
    );
  }
}
