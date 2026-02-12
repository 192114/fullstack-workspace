package com.shadow.template.modules.admin.vo;

import lombok.Data;

@Data
public class AdminUserVo {
  private Long id;
  private String email;
  private String nickname;
  private String avatarUrl;
}
