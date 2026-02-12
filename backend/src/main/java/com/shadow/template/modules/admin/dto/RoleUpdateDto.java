package com.shadow.template.modules.admin.dto;

import lombok.Data;

@Data
public class RoleUpdateDto {
  private String name;
  private String description;
  private Integer status;
}
