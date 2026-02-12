package com.shadow.template.modules.rbac.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;

@Getter
public enum RoleTypeEnum {
  ADMIN(1, "Admin端"),
  NORMAL(2, "普通用户");

  @EnumValue
  @JsonValue
  private final int code;
  private final String desc;

  RoleTypeEnum(int code, String desc) {
    this.code = code;
    this.desc = desc;
  }

  public static RoleTypeEnum fromCode(Integer code) {
    if (code == null) {
      return null;
    }
    for (RoleTypeEnum e : values()) {
      if (e.code == code) {
        return e;
      }
    }
    throw new IllegalArgumentException("Unknown role type: " + code);
  }
}
