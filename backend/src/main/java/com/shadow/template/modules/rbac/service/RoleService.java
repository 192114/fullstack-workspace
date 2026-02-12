package com.shadow.template.modules.rbac.service;

import java.util.List;

import com.shadow.template.modules.admin.dto.RoleCreateDto;
import com.shadow.template.modules.admin.dto.RoleUpdateDto;
import com.shadow.template.modules.admin.vo.PageResult;
import com.shadow.template.modules.admin.vo.RoleDetailVo;
import com.shadow.template.modules.admin.vo.RoleListVo;

public interface RoleService {

  PageResult<RoleListVo> list(int page, int pageSize, String keyword);

  Long create(RoleCreateDto dto);

  RoleDetailVo getById(Long id);

  void update(Long id, RoleUpdateDto dto);

  void delete(Long id);

  List<Long> getPermissionIds(Long roleId);

  void assignPermissions(Long roleId, List<Long> permissionIds);
}
