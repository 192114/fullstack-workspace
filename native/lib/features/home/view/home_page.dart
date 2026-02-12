import 'package:flutter/material.dart';
import 'package:flutter_mvvm_template/app/router.dart';
import 'package:flutter_mvvm_template/core/theme/theme_provider.dart';
import 'package:flutter_mvvm_template/features/auth/view_model/login_view_model.dart';
import 'package:flutter_mvvm_template/features/home/view_model/home_view_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final usersState = ref.watch(usersProvider);
    final themeNotifier = ref.read(themeModeProvider.notifier);
    final loginNotifier = ref.read(loginNotifierProvider.notifier);
    return Scaffold(
      appBar: AppBar(
        title: const Text('首页'),
        actions: [
          IconButton(
            onPressed: () => themeNotifier.toggleTheme(),
            icon: const Icon(Icons.brightness_6_outlined),
            tooltip: '切换主题',
          ),
          IconButton(
            onPressed: () async {
              await loginNotifier.logout();
              if (context.mounted) {
                context.go(AppRoutes.login);
              }
            },
            icon: const Icon(Icons.logout),
            tooltip: '登出',
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: switch (usersState) {
                AsyncData(:final value) => RefreshIndicator(
                  onRefresh: () =>
                      ref.read(usersProvider.notifier).reload(),
                  child: ListView.builder(
                    itemBuilder: (context, index) =>
                        ListTile(title: Text(value[index].name)),
                    itemCount: value.length,
                  ),
                ),
                AsyncLoading() => const Center(
                  child: CircularProgressIndicator(),
                ),
                AsyncError(:final error) => Center(
                  child: Text('Error: $error'),
                ),
              },
            ),
          ],
        ),
      ),
    );
  }
}
