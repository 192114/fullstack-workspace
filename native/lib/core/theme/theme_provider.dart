import 'package:flutter/material.dart';
import 'package:flutter_mvvm_template/core/storage/theme_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ThemeModeNotifier extends Notifier<ThemeMode> {
  late final ThemeStorage _themeStorage;

  @override
  ThemeMode build() {
    _themeStorage = ref.read(themeStorageProvider);
    // 初始状态从 service 获取
    return _themeStorage.getThemeMode();
  }

  // 切换到亮色主题
  Future<void> setLightMode() async {
    state = ThemeMode.light;
    await _themeStorage.setThemeMode(ThemeMode.light);
  }

  /// 切换到暗色主题
  Future<void> setDarkMode() async {
    state = ThemeMode.dark;
    await _themeStorage.setThemeMode(ThemeMode.dark);
  }

  /// 跟随系统
  Future<void> setSystemMode() async {
    state = ThemeMode.system;
    await _themeStorage.setThemeMode(ThemeMode.system);
  }

  /// 切换主题（亮色 <-> 暗色）
  Future<void> toggleTheme() async {
    if (state == ThemeMode.light) {
      await setDarkMode();
    } else {
      await setLightMode();
    }
  }
}

final themeModeProvider = NotifierProvider<ThemeModeNotifier, ThemeMode>(
  ThemeModeNotifier.new,
);
