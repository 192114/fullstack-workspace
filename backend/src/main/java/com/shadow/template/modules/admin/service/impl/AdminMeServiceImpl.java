package com.shadow.template.modules.admin.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shadow.template.modules.admin.vo.AdminMeVo;
import com.shadow.template.modules.admin.vo.AdminUserVo;
import com.shadow.template.modules.rbac.service.MenuService;
import com.shadow.template.modules.rbac.service.PermissionService;
import com.shadow.template.modules.admin.service.AdminMeService;
import com.shadow.template.modules.user.entity.UserAuthEntity;
import com.shadow.template.modules.user.entity.UserProfileEntity;
import com.shadow.template.modules.user.service.UserService;

@Service
public class AdminMeServiceImpl implements AdminMeService {

  @Autowired
  private UserService userService;
  @Autowired
  private PermissionService permissionService;
  @Autowired
  private MenuService menuService;

  @Override
  public AdminMeVo getMe(Long userId) {
    UserAuthEntity auth = userService.getUserById(userId);
    if (auth == null) {
      throw new com.shadow.template.common.exception.BizException(com.shadow.template.common.result.ResultCode.NOT_FOUND);
    }
    UserProfileEntity profile = userService.getProfileByUserId(userId);

    AdminMeVo vo = new AdminMeVo();
    AdminUserVo userVo = new AdminUserVo();
    userVo.setId(auth.getId());
    userVo.setEmail(auth.getEmail());
    userVo.setNickname(profile != null ? profile.getNickname() : null);
    userVo.setAvatarUrl(profile != null ? profile.getAvatarUrl() : null);
    vo.setUser(userVo);
    vo.setMenus(menuService.getTreeForUser(userId));
    vo.setPermissions(permissionService.getPermissionCodesByUserId(userId));
    return vo;
  }
}
