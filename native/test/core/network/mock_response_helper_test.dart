import 'package:flutter_mvvm_template/core/network/exceptions.dart';
import 'package:flutter_mvvm_template/core/network/mock_response_helper.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('MockResponseHelper', () {
    test('delay completes after specified milliseconds', () async {
      final stopwatch = Stopwatch()..start();
      await MockResponseHelper.delay(50);
      stopwatch.stop();
      expect(stopwatch.elapsedMilliseconds, greaterThanOrEqualTo(45));
    });

    test('success returns data after delay', () async {
      const data = {'id': '1', 'name': 'Test'};
      final result = await MockResponseHelper.success(
        data: data,
        delayMs: 10,
      );
      expect(result, data);
    });

    test('error throws AppException after delay', () async {
      expect(
        () => MockResponseHelper.error(
          message: 'Test error',
          code: 500,
          delayMs: 10,
        ),
        throwsA(isA<AppException>()),
      );
    });

    test('error throws with correct message and code', () async {
      try {
        await MockResponseHelper.error(
          message: 'Custom error',
          code: 401,
          delayMs: 0,
        );
      } on AppException catch (e) {
        expect(e.message, 'Custom error');
        expect(e.statusCode, 401);
      }
    });
  });
}
