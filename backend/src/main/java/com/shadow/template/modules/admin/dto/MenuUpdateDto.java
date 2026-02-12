package com.shadow.template.modules.admin.dto;

import lombok.Data;

@Data
public class MenuUpdateDto {
  private Long permissionId;
  private Long parentId;
  private String name;
  private String path;
  private String component;
  private String icon;
  private Integer sortOrder;
  private Integer visible;
}
