package com.shadow.template.modules.auth.vo;

import lombok.Data;

@Data
public class TokenResponseVo {
  private String accessToken;
  private String refreshToken;
}
