import 'package:flutter/material.dart';
import 'package:flutter_mvvm_template/app/app.dart';
import 'package:flutter_mvvm_template/core/config/env.dart';
import 'package:flutter_mvvm_template/core/provider/shared_preferences_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  // 初始化了消息循环和其他基础设施，这样你就可以创建和交互 Future 和 Stream 等。
  // 对于使用了插件的应用程序，确保插件的初始化工作已经完成，确保可以在插件和平台代码之间正确地交互数据。
  // 因为di.init 是异步操作 所以需要 调用该方法
  WidgetsFlutterBinding.ensureInitialized();

  // 打印当前环境配置（仅在开发环境）
  if (EnvConfig.isDevelopment) {
    EnvConfig.printConfig();
  }

  // 初始化 SharedPreferences 因为是异步的 需在初始化后 注入
  final sharedPreferences = await SharedPreferences.getInstance();

  runApp(
    ProviderScope(
      overrides: [
        sharedPreferencesProvider.overrideWithValue(sharedPreferences),
      ],

      child: const MainApp(),
    ),
  );
}
