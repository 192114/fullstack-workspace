package com.shadow.template.modules.auth.dto;

import com.shadow.template.modules.auth.validation.ChangePasswordConstraint;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@ChangePasswordConstraint
public class ChangePasswordDto {
  private String oldPassword;
  private String emailCode;
  @NotBlank(message = "新密码不能为空")
  private String newPassword;
}
