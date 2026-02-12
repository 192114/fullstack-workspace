package com.shadow.template.modules.auth.dto;

import lombok.Data;

@Data
public class LogoutDto {
  private String refreshToken;
  private String deviceId;
}
