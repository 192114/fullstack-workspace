package com.shadow.template.modules.admin.vo;

import lombok.Data;

import java.util.List;

@Data
public class AdminMeVo {
  private AdminUserVo user;
  private List<MenuTreeVo> menus;
  private List<String> permissions;
}
