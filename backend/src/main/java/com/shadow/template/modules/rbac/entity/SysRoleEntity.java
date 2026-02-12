package com.shadow.template.modules.rbac.entity;

import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.shadow.template.modules.rbac.enums.RoleStatusEnum;
import com.shadow.template.modules.rbac.enums.RoleTypeEnum;

import lombok.Data;

@TableName("sys_role")
@Data
public class SysRoleEntity {
  @TableId(type = IdType.AUTO)
  private Long id;
  private String code;
  private String name;
  private String description;
  private RoleTypeEnum type;
  private RoleStatusEnum status;
  @TableField(fill = FieldFill.INSERT, value = "create_time")
  private LocalDateTime createTime;
  @TableField(fill = FieldFill.INSERT_UPDATE, value = "update_time")
  private LocalDateTime updateTime;
}
