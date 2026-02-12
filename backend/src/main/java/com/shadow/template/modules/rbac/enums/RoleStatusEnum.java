package com.shadow.template.modules.rbac.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;

@Getter
public enum RoleStatusEnum {
  DISABLED(0, "禁用"),
  ENABLE(1, "启用");

  @EnumValue
  @JsonValue
  private final int code;
  private final String desc;

  RoleStatusEnum(int code, String desc) {
    this.code = code;
    this.desc = desc;
  }
}
