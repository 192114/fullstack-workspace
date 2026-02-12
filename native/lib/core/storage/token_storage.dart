import 'package:flutter/foundation.dart';
import 'package:flutter_mvvm_template/core/provider/shared_preferences_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TokenStorage extends ChangeNotifier {
  static const _keyAccessToken = 'access_token';
  static const _keyRefreshToken = 'refresh_token';

  final SharedPreferences _prefs;

  TokenStorage(this._prefs);

  String? get accessToken => _prefs.getString(_keyAccessToken);
  String? get refreshToken => _prefs.getString(_keyRefreshToken);

  Future<void> saveTokens(String accessToken, String refreshToken) async {
    await _prefs.setString(_keyAccessToken, accessToken);
    await _prefs.setString(_keyRefreshToken, refreshToken);
    notifyListeners();
  }

  Future<void> clearTokens() async {
    await _prefs.remove(_keyAccessToken);
    await _prefs.remove(_keyRefreshToken);
    notifyListeners();
  }

  bool get hasToken => accessToken != null;
}

final tokenStorageProvider = Provider<TokenStorage>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return TokenStorage(prefs);
});
