package com.shadow.template.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleCreateDto {
  @NotBlank(message = "角色编码不能为空")
  private String code;
  @NotBlank(message = "角色名称不能为空")
  private String name;
  private String description;
  @NotNull(message = "角色类型不能为空")
  private Integer type;
  private Integer status;
}
