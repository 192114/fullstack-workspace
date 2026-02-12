package com.shadow.template.modules.rbac.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.shadow.template.modules.rbac.enums.PermissionTypeEnum;

import lombok.Data;

@TableName("sys_permission")
@Data
public class SysPermissionEntity {
  @TableId(type = IdType.AUTO)
  private Long id;
  private String code;
  private String name;
  private PermissionTypeEnum type;
  @TableField(value = "parent_id")
  private Long parentId;
  @TableField(value = "sort_order")
  private Integer sortOrder;
  @TableField(fill = FieldFill.INSERT, value = "create_time")
  private LocalDateTime createTime;
  @TableField(fill = FieldFill.INSERT_UPDATE, value = "update_time")
  private LocalDateTime updateTime;
}
