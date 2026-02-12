import 'package:flutter/material.dart';
import 'package:flutter_mvvm_template/core/provider/shared_preferences_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeStorage {
  static const _keyThemeMode = 'theme_mode';

  final SharedPreferences _prefs;

  const ThemeStorage(this._prefs);

  ThemeMode getThemeMode() {
    final value = _prefs.getString(_keyThemeMode);

    switch (value) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    final value = mode.name;
    await _prefs.setString(_keyThemeMode, value);
  }
}

final themeStorageProvider = Provider<ThemeStorage>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return ThemeStorage(prefs);
});