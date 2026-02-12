package com.shadow.template.modules.auth.vo;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UserMeVo {
  private Long id;
  private String email;
  private String nickname;
  private String avatarUrl;
  private Integer gender;
  private LocalDate birthday;
  private String bio;
}
