package com.shadow.template.modules.admin.service;

import java.util.List;

import com.shadow.template.modules.admin.dto.AdminUserCreateDto;
import com.shadow.template.modules.admin.dto.AdminUserUpdateDto;
import com.shadow.template.modules.admin.vo.AdminUserDetailVo;
import com.shadow.template.modules.admin.vo.AdminUserListVo;
import com.shadow.template.modules.admin.vo.PageResult;

public interface AdminUserService {

  PageResult<AdminUserListVo> list(int page, int pageSize, String keyword, Integer status);

  Long create(AdminUserCreateDto dto);

  AdminUserDetailVo getById(Long id);

  void update(Long id, AdminUserUpdateDto dto);

  void delete(Long id);

  List<Long> getRoleIds(Long userId);

  void assignRoles(Long userId, List<Long> roleIds);
}
