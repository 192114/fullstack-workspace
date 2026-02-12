package com.shadow.template.modules.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminUserCreateDto {
  @NotBlank(message = "邮箱不能为空")
  @Email(message = "邮箱格式不正确")
  private String email;
  @NotBlank(message = "密码不能为空")
  private String password;
  private String nickname;
  private Integer status;
}
