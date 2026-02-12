package com.shadow.template.modules.rbac.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import lombok.Data;

@TableName("sys_role_permission")
@Data
public class SysRolePermissionEntity {
  @TableId(type = IdType.AUTO)
  private Long id;
  @TableField(value = "role_id")
  private Long roleId;
  @TableField(value = "permission_id")
  private Long permissionId;
  @TableField(fill = FieldFill.INSERT, value = "create_time")
  private LocalDateTime createTime;
}
