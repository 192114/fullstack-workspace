package com.shadow.template.modules.admin.vo;

import lombok.Data;

import java.util.List;

@Data
public class MenuManagementTreeVo {
  private Long id;
  private Long permissionId;
  private Long parentId;
  private String name;
  private String path;
  private String component;
  private String icon;
  private Integer sortOrder;
  private Integer visible;
  private List<MenuManagementTreeVo> children;
}
