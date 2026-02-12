package com.shadow.template.modules.rbac.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shadow.template.modules.rbac.entity.SysRolePermissionEntity;

@Mapper
public interface SysRolePermissionMapper extends BaseMapper<SysRolePermissionEntity> {
}
