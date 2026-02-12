package com.shadow.template.modules.admin.dto;

import lombok.Data;

@Data
public class AdminUserUpdateDto {
  private String nickname;
  private String avatarUrl;
  private Integer gender;
  private String birthday;
  private String bio;
  private Integer status;
}
