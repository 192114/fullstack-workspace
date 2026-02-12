import 'package:flutter_mvvm_template/core/utils/logger.dart';

/// mock: Mock环境用于本地开发和测试
/// dev: 开发环境
/// prod: 生产环境
enum Environment { mock, dev, prod }

class EnvConfig {
  // 从编译参数读取环境变量
  static const String _envString = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'dev',
  );

  static Environment get currentEnv {
    switch (_envString) {
      case 'mock':
        return Environment.mock;
      case 'prod':
      case 'production':
        return Environment.prod;
      case 'dev':
      case 'development':
      default:
        return Environment.dev;
    }
  }

  static String get baseUrl {
    switch (currentEnv) {
      case Environment.mock:
        return 'mock://local';
      case Environment.dev:
        return const String.fromEnvironment(
          'BASE_URL',
          defaultValue: 'https://localhost:8899',
        );
      case Environment.prod:
        return const String.fromEnvironment(
          'BASE_URL',
          defaultValue: 'https://api.example.com',
        );
    }
  }

  static const int connectTimeout = int.fromEnvironment(
    'CONNECT_TIMEOUT',
    defaultValue: 30000,
  );

  static const int receiveTimeout = int.fromEnvironment(
    'RECEIVE_TIMEOUT',
    defaultValue: 30000,
  );

  static bool get isProduction => currentEnv == Environment.prod;
  static bool get isDevelopment => currentEnv == Environment.dev;
  static bool get isMock => currentEnv == Environment.mock;

  // 调试信息
  static void printConfig() {
    AppLogger.i('========== 环境配置 ==========');
    AppLogger.i('Environment: $_envString (${currentEnv.name})');
    AppLogger.i('Base URL: $baseUrl');
    AppLogger.i('Connect Timeout: $connectTimeout ms');
    AppLogger.i('Receive Timeout: $receiveTimeout ms');
    AppLogger.i('Is Production: $isProduction');
    AppLogger.i('==============================');
  }
}
