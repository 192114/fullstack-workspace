package com.shadow.template.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MenuCreateDto {
  @NotNull(message = "权限ID不能为空")
  private Long permissionId;
  @NotNull(message = "父菜单ID不能为空")
  private Long parentId;
  @NotBlank(message = "菜单名称不能为空")
  private String name;
  private String path;
  private String component;
  private String icon;
  private Integer sortOrder;
  private Integer visible;
}
