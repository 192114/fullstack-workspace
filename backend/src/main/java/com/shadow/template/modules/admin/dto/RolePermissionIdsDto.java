package com.shadow.template.modules.admin.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RolePermissionIdsDto {
  @NotNull(message = "权限ID列表不能为空")
  private List<Long> permissionIds;
}
