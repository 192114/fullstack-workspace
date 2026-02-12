package com.shadow.template.modules.admin.vo;

import lombok.Data;

import java.util.List;

@Data
public class PermissionTreeVo {
  private Long id;
  private String code;
  private String name;
  private Integer type;
  private Long parentId;
  private Integer sortOrder;
  private List<PermissionTreeVo> children;
}
