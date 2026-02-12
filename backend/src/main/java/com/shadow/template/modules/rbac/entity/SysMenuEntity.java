package com.shadow.template.modules.rbac.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

@TableName("sys_menu")
@Data
public class SysMenuEntity {
  @TableId(type = IdType.AUTO)
  private Long id;
  @TableField(value = "permission_id")
  private Long permissionId;
  @TableField(value = "parent_id")
  private Long parentId;
  private String name;
  private String path;
  private String component;
  private String icon;
  @TableField(value = "sort_order")
  private Integer sortOrder;
  private Integer visible;
  @TableField(fill = FieldFill.INSERT, value = "create_time")
  private LocalDateTime createTime;
  @TableField(fill = FieldFill.INSERT_UPDATE, value = "update_time")
  private LocalDateTime updateTime;
}
