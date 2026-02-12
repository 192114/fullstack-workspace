package com.shadow.template.modules.auth.dto;

import lombok.Data;

@Data
public class ChangePasswordCommand {
  private Long userId;
  private String oldPassword;
  private String emailCode;
  private String newPassword;
}
