class ApiResponse<T> {
  final int code;
  final String message;
  final T? data;
  final dynamic meta;

  const ApiResponse({
    required this.code,
    required this.message,
    this.data,
    this.meta,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse<T>(
      code: json['code'] as int? ?? 200,
      message: json['message'] as String? ?? '',
      data: fromJsonT != null && json['data'] != null
          ? fromJsonT(json['data'])
          : json['data'] as T?,
      meta: json['meta'],
    );
  }

  Map<String, dynamic> toJson(Object? Function(T)? toJsonT) {
    return {
      'code': code,
      'message': message,
      'data': toJsonT != null && data != null ? toJsonT(data as T) : data,
      if (meta != null) 'meta': meta,
    };
  }

  // 获取是否成功
  bool get isSuccess => code == 200;

  // 成功的 快捷构造
  factory ApiResponse.success({
    T? data,
    String message = 'success',
    dynamic meta,
  }) {
    return ApiResponse<T>(code: 200, message: message, data: data, meta: meta);
  }

  // 失败的 快捷构造
  factory ApiResponse.error({
    required int code,
    required String message,
    T? data,
  }) {
    return ApiResponse<T>(code: code, message: message, data: data);
  }
}
