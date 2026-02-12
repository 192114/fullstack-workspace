package com.shadow.template.modules.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminUserDetailVo {
  private Long id;
  private String email;
  private String nickname;
  private String avatarUrl;
  private Integer gender;
  private String birthday;
  private String bio;
  private Integer status;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime createTime;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime updateTime;
}
