package com.shadow.template.modules.auth.dto;

import lombok.Data;

@Data
public class RefreshTokenDto {
  private String refreshToken;
  private String deviceId;
}
