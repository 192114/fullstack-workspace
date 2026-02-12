package com.shadow.template.modules.rbac.service;

import java.util.List;

import com.shadow.template.modules.admin.dto.MenuCreateDto;
import com.shadow.template.modules.admin.dto.MenuUpdateDto;
import com.shadow.template.modules.admin.vo.MenuManagementTreeVo;
import com.shadow.template.modules.admin.vo.MenuTreeVo;

public interface MenuService {

  List<MenuTreeVo> getTreeForUser(Long userId);

  List<MenuManagementTreeVo> getTree();

  Long create(MenuCreateDto dto);

  void update(Long id, MenuUpdateDto dto);

  void delete(Long id);
}
