# Flutter MVVM 模板

一个基于 Feature-First 架构的 Flutter MVVM 模板，开箱即用。

## ✨ 特性

- 🏗️ **MVVM 架构** - 清晰的代码分层，Feature-First 组织方式
- 🔄 **Riverpod** - 现代化状态管理
- 🌐 **Dio** - 强大的网络请求，统一响应格式处理
- 🧊 **Freezed** - 不可变数据模型，类型安全
- 🚀 **GoRouter** - 声明式路由管理
- 💾 **SharedPreferences** - 简单本地存储
- 🎨 **主题管理** - 支持亮色/暗色主题切换
- 🧪 **Mock 支持** - 内置 Mock 数据层，便于开发和测试
- 📦 **统一响应** - ApiResponse 统一 API 响应格式
- ⚙️ **多环境配置** - 支持 Mock/Dev/Prod 三种环境

## 📁 项目结构

```
lib/
├── app/                    # 应用配置
│   ├── app.dart           # 应用主组件
│   └── router.dart        # 路由配置
├── core/                  # 核心功能模块
│   ├── config/           # 环境配置
│   │   └── env.dart      # 多环境配置（Mock/Dev/Prod）
│   ├── network/          # 网络层
│   │   ├── api_response.dart        # 统一响应格式
│   │   ├── dio_client.dart          # Dio 客户端配置
│   │   ├── exceptions.dart          # 异常定义
│   │   └── mock_response_helper.dart # Mock 响应助手
│   ├── provider/         # 全局 Provider
│   ├── storage/          # 本地存储
│   │   ├── token_storage.dart  # Token 存储
│   │   └── theme_storage.dart  # 主题存储
│   ├── theme/            # 主题配置
│   └── utils/            # 工具类
│       └── logger.dart   # 日志工具
├── features/             # 功能模块（Feature-First）
│   ├── auth/            # 认证模块
│   │   ├── models/      # 数据模型
│   │   ├── repositories/ # 仓储层（包含接口、实现、Mock）
│   │   ├── view/        # 视图层
│   │   └── view_model/  # ViewModel 层
│   └── home/            # 首页模块
│       ├── datasources/ # 数据源（远程/本地）
│       ├── models/      # 数据模型
│       ├── repositories/ # 仓储层
│       ├── view/        # 视图层
│       └── view_model/  # ViewModel 层
└── main.dart            # 应用入口
```

### 架构说明

- **Feature-First**: 按功能模块组织代码，每个 feature 包含完整的业务逻辑
- **分层架构**: View → ViewModel → Repository → DataSource → Model
- **依赖注入**: 使用 Riverpod Provider 进行依赖管理
- **数据流向**: View 监听 ViewModel → ViewModel 调用 Repository → Repository 处理数据源

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd flutter_mvvm_template
```

### 2. 安装依赖
```bash
flutter pub get
```

### 3. 生成代码
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### 4. 运行项目

#### Mock 环境（使用本地 Mock 数据）
```bash
flutter run --dart-define=ENVIRONMENT=mock
```

#### 开发环境（默认）
```bash
flutter run
# 或显式指定
flutter run --dart-define=ENVIRONMENT=dev
```

#### 生产环境
```bash
flutter run --dart-define=ENVIRONMENT=prod
```

#### 自定义 API 地址
```bash
flutter run \
  --dart-define=ENVIRONMENT=dev \
  --dart-define=BASE_URL=https://dev-api.example.com
```

### 环境说明

| 环境 | 说明 | 默认 API 地址 |
|------|------|--------------|
| mock | Mock 环境，使用本地模拟数据 | `mock://local` |
| dev  | 开发环境，连接开发服务器 | `https://localhost:8899` |
| prod | 生产环境，连接生产服务器 | `https://api.example.com` |

## 📝 使用指南

### 添加新功能模块

按照 Feature-First 架构，创建完整的功能模块：

1. 在 `lib/features/` 创建新功能目录
```bash
lib/features/my_feature/
├── models/          # 数据模型
├── repositories/    # 仓储层（接口、实现、Mock）
├── datasources/     # 数据源（可选）
├── view/           # 视图层
└── view_model/     # ViewModel 层
```

2. 创建数据模型（使用 Freezed）
```dart
// lib/features/my_feature/models/my_model.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'my_model.freezed.dart';
part 'my_model.g.dart';

@freezed
class MyModel with _$MyModel {
  const factory MyModel({
    required String id,
    required String name,
  }) = _MyModel;
  
  factory MyModel.fromJson(Map<String, dynamic> json) => 
      _$MyModelFromJson(json);
}
```

3. 创建仓储层
```dart
// lib/features/my_feature/repositories/my_repository.dart
abstract class MyRepository {
  Future<List<MyModel>> getItems();
}

// lib/features/my_feature/repositories/my_repository_impl.dart
class MyRepositoryImpl implements MyRepository {
  final Dio _dio;
  const MyRepositoryImpl(this._dio);
  
  @override
  Future<List<MyModel>> getItems() async {
    try {
      final response = await _dio.get('/items');
      // 处理统一响应格式
      final apiResponse = response.data as ApiResponse;
      return (apiResponse.data as List)
          .map((json) => MyModel.fromJson(json))
          .toList();
    } on DioException catch (e) {
      if (e.error is AppException) {
        throw e.error as AppException;
      }
      throw AppException('获取数据失败: ${e.message}');
    }
  }
}

// lib/features/my_feature/repositories/my_repository_mock.dart
class MyRepositoryMock implements MyRepository {
  @override
  Future<List<MyModel>> getItems() async {
    return MockResponseHelper.success(
      data: [/* mock data */],
      message: '获取成功',
      delayMs: 800,
    );
  }
}
```

4. 创建 ViewModel
```dart
// lib/features/my_feature/view_model/my_view_model.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final myRepositoryProvider = Provider<MyRepository>((ref) {
  if (EnvConfig.isMock) {
    return const MyRepositoryMock();
  }
  final dio = ref.watch(dioProvider);
  return MyRepositoryImpl(dio);
});

final myItemsProvider = FutureProvider<List<MyModel>>((ref) async {
  final repository = ref.watch(myRepositoryProvider);
  return repository.getItems();
});
```

5. 创建视图
```dart
// lib/features/my_feature/view/my_page.dart
class MyPage extends ConsumerWidget {
  const MyPage({super.key});
  
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemsAsync = ref.watch(myItemsProvider);
    
    return Scaffold(
      appBar: AppBar(title: const Text('我的页面')),
      body: itemsAsync.when(
        data: (items) => ListView.builder(
          itemCount: items.length,
          itemBuilder: (context, index) => ListTile(
            title: Text(items[index].name),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('错误: $error')),
      ),
    );
  }
}
```

6. 在 `lib/app/router.dart` 添加路由

7. 运行代码生成
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### 统一响应格式

项目使用 `ApiResponse` 统一处理 API 响应：

```dart
// API 响应格式
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "meta": { ... }  // 可选
}

// 在代码中使用
final response = await dio.get('/api/users');
final apiResponse = response.data as ApiResponse;

if (apiResponse.isSuccess) {
  final users = (apiResponse.data as List)
      .map((json) => User.fromJson(json))
      .toList();
}
```

Dio 拦截器会自动处理响应格式转换和错误处理。

### Mock 数据开发

使用 `MockResponseHelper` 快速创建 Mock 仓储：

```dart
class MyRepositoryMock implements MyRepository {
  @override
  Future<List<Item>> getItems() async {
    // 成功响应
    return MockResponseHelper.success(
      data: [Item(id: '1', name: 'Test')],
      message: '获取成功',
      delayMs: 800,  // 模拟网络延迟
    );
    
    // 错误响应
    // return MockResponseHelper.error(
    //   message: '服务器错误',
    //   code: 500,
    //   delayMs: 500,
    // );
  }
}
```

### 环境配置

修改 `lib/core/config/env.dart` 配置不同环境的参数：

```dart
static String get baseUrl {
  switch (currentEnv) {
    case Environment.mock:
      return 'mock://local';
    case Environment.dev:
      return 'https://dev-api.example.com';
    case Environment.prod:
      return 'https://api.example.com';
  }
}
```

### 状态管理

使用 Riverpod Provider 管理状态：

```dart
// 简单数据获取
final dataProvider = FutureProvider<List<Model>>((ref) async {
  final repository = ref.watch(repositoryProvider);
  return repository.getData();
});

// 可变状态管理
final counterProvider = StateProvider<int>((ref) => 0);

// 复杂状态管理
final notifierProvider = AsyncNotifierProvider<MyNotifier, List<Model>>(
  MyNotifier.new,
);
```

## 🛠️ 代码生成

Freezed 和 JsonSerializable 需要运行代码生成：

```bash
# 监听文件变化，自动生成
flutter pub run build_runner watch

# 手动生成
flutter pub run build_runner build --delete-conflicting-outputs

# 清理后重新生成
flutter pub run build_runner clean
flutter pub run build_runner build --delete-conflicting-outputs
```

## 📦 打包发布

### Android

```bash
# Mock 版本（用于演示）
flutter build apk --dart-define=ENVIRONMENT=mock

# 开发版本
flutter build apk --dart-define=ENVIRONMENT=dev

# 生产版本
flutter build apk \
  --dart-define=ENVIRONMENT=prod \
  --dart-define=BASE_URL=https://api.example.com \
  --release
```

### iOS

```bash
# Mock 版本（用于演示）
flutter build ios --dart-define=ENVIRONMENT=mock

# 开发版本
flutter build ios --dart-define=ENVIRONMENT=dev

# 生产版本
flutter build ios \
  --dart-define=ENVIRONMENT=prod \
  --dart-define=BASE_URL=https://api.example.com \
  --release
```

### Web

```bash
# 开发版本
flutter build web --dart-define=ENVIRONMENT=dev

# 生产版本
flutter build web \
  --dart-define=ENVIRONMENT=prod \
  --dart-define=BASE_URL=https://api.example.com \
  --release
```

## 🧪 测试

```bash
# 运行所有测试
flutter test

# 运行特定测试文件
flutter test test/example_test.dart

# 带覆盖率报告
flutter test --coverage
```

## 🎨 VS Code 调试

项目可配置 `.vscode/launch.json`，按 `F5` 或点击 Run and Debug 选择不同环境：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Mock 环境",
      "request": "launch",
      "type": "dart",
      "args": [
        "--dart-define=ENVIRONMENT=mock"
      ]
    },
    {
      "name": "开发环境",
      "request": "launch",
      "type": "dart",
      "args": [
        "--dart-define=ENVIRONMENT=dev"
      ]
    },
    {
      "name": "生产环境",
      "request": "launch",
      "type": "dart",
      "args": [
        "--dart-define=ENVIRONMENT=prod",
        "--dart-define=BASE_URL=https://api.example.com"
      ]
    }
  ]
}
```

## 📚 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Flutter | 3.9.2+ | UI 框架 |
| Dart | 3.9.2+ | 编程语言 |
| Riverpod | 3.0.3+ | 状态管理 |
| GoRouter | 16.3.0+ | 路由管理 |
| Dio | 5.9.0+ | 网络请求 |
| Freezed | 3.2.3+ | 数据模型生成 |
| JsonSerializable | 6.11.1+ | JSON 序列化 |
| SharedPreferences | 2.5.3+ | 本地存储 |
| Logger | 2.6.2+ | 日志工具 |
| PrettyDioLogger | 1.4.0+ | 网络请求日志 |

### 开发依赖

| 技术 | 版本 | 说明 |
|------|------|------|
| BuildRunner | 2.7.1+ | 代码生成工具 |
| FlutterLints | 6.0.0+ | 代码规范 |
| RiverpodLint | 3.0.3+ | Riverpod 专用 Lint |
| CustomLint | 0.8.0+ | 自定义 Lint 规则 |

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 License

MIT License

---

## 💡 常见问题

### 如何修改应用名称？
修改 `pubspec.yaml` 中的 `name` 字段，然后重新生成代码。

### 如何添加新的依赖包？
1. 在 `pubspec.yaml` 中添加依赖
2. 运行 `flutter pub get`
3. 如果是需要代码生成的包，运行 `flutter pub run build_runner build`

### 代码生成失败怎么办？
```bash
# 清理缓存后重新生成
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
```

### 如何切换环境？
使用 `--dart-define=ENVIRONMENT=<env>` 参数，支持 `mock`、`dev`、`prod` 三种环境。

### Mock 环境和真实 API 如何切换？
在 Repository Provider 中根据环境判断：
```dart
final myRepositoryProvider = Provider<MyRepository>((ref) {
  if (EnvConfig.isMock) {
    return const MyRepositoryMock();  // 返回 Mock 实现
  }
  final dio = ref.watch(dioProvider);
  return MyRepositoryImpl(dio);       // 返回真实实现
});
```

### 如何处理 API 响应？
项目使用统一的 `ApiResponse` 格式，Dio 拦截器会自动处理：
- 成功响应（code=200）：自动解析为 `ApiResponse` 对象
- 失败响应（code≠200）：自动转换为 `AppException` 异常
- 网络错误：自动转换为 `NetworkException` 异常

### 如何添加新的异常类型？
在 `lib/core/network/exceptions.dart` 中定义新的异常类：
```dart
class MyCustomException extends AppException {
  const MyCustomException([String? message]) 
      : super(message ?? '自定义错误', 400);
}
```

### 如何在 Mock 环境中模拟延迟和错误？
使用 `MockResponseHelper`：
```dart
// 模拟成功（延迟 800ms）
return MockResponseHelper.success(
  data: mockData,
  delayMs: 800,
);

// 模拟错误
return MockResponseHelper.error(
  message: '服务器错误',
  code: 500,
);
```

### Feature-First 架构有什么优势？
- **高内聚**：相关代码组织在一起，易于理解和维护
- **低耦合**：功能模块之间相互独立
- **可扩展**：添加新功能不影响现有代码
- **易测试**：每个 feature 可独立测试
- **团队协作**：多人可并行开发不同 feature

---

## 🎯 最佳实践

1. **环境隔离**：开发时使用 Mock 环境，联调时使用 Dev 环境，发布时使用 Prod 环境
2. **异常处理**：统一使用 `AppException` 及其子类处理异常
3. **状态管理**：简单状态用 `Provider`，复杂状态用 `AsyncNotifier`
4. **代码生成**：修改 Model 后及时运行 `build_runner`
5. **Mock 数据**：先写 Mock 实现，再实现真实 API 调用
6. **日志记录**：使用 `AppLogger` 记录关键操作和错误
7. **依赖注入**：通过 Provider 管理依赖，便于测试和替换

---

**Happy Coding! 🎉**