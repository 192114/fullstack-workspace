import 'package:flutter_mvvm_template/core/storage/token_storage.dart';
import 'package:flutter_mvvm_template/features/auth/view/login_page.dart';
import 'package:flutter_mvvm_template/features/home/view/home_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// 路由路径常量
class AppRoutes {
  AppRoutes._();

  static const String login = '/login';
  static const String home = '/';
}

/// 应用路由配置
final routerProvider = Provider((ref) {
  final tokenStorage = ref.watch(tokenStorageProvider);
  return GoRouter(
    initialLocation: tokenStorage.hasToken ? AppRoutes.home : AppRoutes.login,
    refreshListenable: tokenStorage,
    redirect: (context, state) {
      final isLoggedIn = tokenStorage.hasToken; // 有token 
      final isLoggingIn = state.matchedLocation == AppRoutes.login; // 处于登录页面

      if (!isLoggingIn && !isLoggedIn) {
        return AppRoutes.login;
      }

      if (isLoggedIn && isLoggingIn) {
        return AppRoutes.home;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: AppRoutes.home,
        builder: (context, state) => const HomePage(),
      ),
    ],
  );
});

