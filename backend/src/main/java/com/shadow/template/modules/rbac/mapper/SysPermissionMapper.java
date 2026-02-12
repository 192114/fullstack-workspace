package com.shadow.template.modules.rbac.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.shadow.template.modules.rbac.entity.SysPermissionEntity;

@Mapper
public interface SysPermissionMapper extends BaseMapper<SysPermissionEntity> {

  @Select("SELECT p.code FROM sys_permission p "
      + "INNER JOIN sys_role_permission rp ON rp.permission_id = p.id "
      + "INNER JOIN sys_user_role ur ON ur.role_id = rp.role_id "
      + "WHERE ur.user_id = #{userId}")
  List<String> selectPermissionCodesByUserId(@Param("userId") Long userId);
}
