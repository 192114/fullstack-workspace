package com.shadow.template.modules.admin.vo;

import lombok.Data;

import java.util.List;

@Data
public class MenuTreeVo {
  private Long id;
  private String name;
  private String path;
  private String component;
  private String icon;
  private List<MenuTreeVo> children;
}
