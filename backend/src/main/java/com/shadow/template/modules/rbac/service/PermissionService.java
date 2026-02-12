package com.shadow.template.modules.rbac.service;

import java.util.List;

import com.shadow.template.modules.admin.vo.PermissionTreeVo;

public interface PermissionService {

  List<String> getPermissionCodesByUserId(Long userId);

  List<PermissionTreeVo> getTree();
}
