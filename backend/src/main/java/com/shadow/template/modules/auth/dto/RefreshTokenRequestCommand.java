package com.shadow.template.modules.auth.dto;

import lombok.Data;

@Data
public class RefreshTokenRequestCommand {
  private String refreshToken;
  private String deviceId;
  private String userAgent;
  private String ipAddress;
}
