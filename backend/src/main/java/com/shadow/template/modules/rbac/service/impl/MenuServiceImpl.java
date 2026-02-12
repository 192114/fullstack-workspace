package com.shadow.template.modules.rbac.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.shadow.template.common.exception.BizException;
import com.shadow.template.common.result.ResultCode;
import com.shadow.template.modules.admin.dto.MenuCreateDto;
import com.shadow.template.modules.admin.dto.MenuUpdateDto;
import com.shadow.template.modules.admin.vo.MenuManagementTreeVo;
import com.shadow.template.modules.admin.vo.MenuTreeVo;
import com.shadow.template.modules.rbac.entity.SysMenuEntity;
import com.shadow.template.modules.rbac.mapper.SysMenuMapper;
import com.shadow.template.modules.rbac.mapper.SysPermissionMapper;
import com.shadow.template.modules.rbac.service.MenuService;
import com.shadow.template.modules.rbac.service.PermissionService;

@Service
public class MenuServiceImpl implements MenuService {

  @Autowired
  private SysMenuMapper sysMenuMapper;
  @Autowired
  private SysPermissionMapper sysPermissionMapper;
  @Autowired
  private PermissionService permissionService;

  @Override
  public List<MenuTreeVo> getTreeForUser(Long userId) {
    java.util.Set<String> permissionCodes = new java.util.HashSet<>(permissionService.getPermissionCodesByUserId(userId));
    if (permissionCodes.isEmpty()) {
      return List.of();
    }
    LambdaQueryWrapper<SysMenuEntity> qw = Wrappers.lambdaQuery();
    qw.eq(SysMenuEntity::getVisible, 1);
    qw.orderByAsc(SysMenuEntity::getSortOrder);
    List<SysMenuEntity> all = sysMenuMapper.selectList(qw);
    return buildMenuTreeForUser(all, 0L, permissionCodes);
  }

  private List<MenuTreeVo> buildMenuTreeForUser(List<SysMenuEntity> all, Long parentId,
      java.util.Set<String> permissionCodes) {
    return all.stream()
        .filter(m -> java.util.Objects.equals(m.getParentId(), parentId))
        .filter(m -> {
          var perm = sysPermissionMapper.selectById(m.getPermissionId());
          return perm != null && permissionCodes.contains(perm.getCode());
        })
        .map(m -> {
          MenuTreeVo vo = new MenuTreeVo();
          vo.setId(m.getId());
          vo.setName(m.getName());
          vo.setPath(m.getPath());
          vo.setComponent(m.getComponent());
          vo.setIcon(m.getIcon());
          vo.setChildren(buildMenuTreeForUser(all, m.getId(), permissionCodes));
          return vo;
        })
        .collect(Collectors.toList());
  }

  @Override
  public List<MenuManagementTreeVo> getTree() {
    LambdaQueryWrapper<SysMenuEntity> qw = Wrappers.lambdaQuery();
    qw.orderByAsc(SysMenuEntity::getSortOrder);
    List<SysMenuEntity> all = sysMenuMapper.selectList(qw);
    return buildMenuManagementTree(all, 0L);
  }

  private List<MenuManagementTreeVo> buildMenuManagementTree(List<SysMenuEntity> all, Long parentId) {
    return all.stream()
        .filter(m -> java.util.Objects.equals(m.getParentId(), parentId))
        .map(m -> {
          MenuManagementTreeVo vo = new MenuManagementTreeVo();
          vo.setId(m.getId());
          vo.setPermissionId(m.getPermissionId());
          vo.setParentId(m.getParentId());
          vo.setName(m.getName());
          vo.setPath(m.getPath());
          vo.setComponent(m.getComponent());
          vo.setIcon(m.getIcon());
          vo.setSortOrder(m.getSortOrder());
          vo.setVisible(m.getVisible());
          vo.setChildren(buildMenuManagementTree(all, m.getId()));
          return vo;
        })
        .collect(Collectors.toList());
  }

  @Override
  public Long create(MenuCreateDto dto) {
    SysMenuEntity entity = new SysMenuEntity();
    entity.setPermissionId(dto.getPermissionId());
    entity.setParentId(dto.getParentId());
    entity.setName(dto.getName());
    entity.setPath(dto.getPath());
    entity.setComponent(dto.getComponent());
    entity.setIcon(dto.getIcon());
    entity.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
    entity.setVisible(dto.getVisible() != null ? dto.getVisible() : 1);
    sysMenuMapper.insert(entity);
    return entity.getId();
  }

  @Override
  public void update(Long id, MenuUpdateDto dto) {
    SysMenuEntity entity = sysMenuMapper.selectById(id);
    if (entity == null) {
      throw new BizException(ResultCode.NOT_FOUND);
    }
    if (dto.getPermissionId() != null) {
      entity.setPermissionId(dto.getPermissionId());
    }
    if (dto.getParentId() != null) {
      entity.setParentId(dto.getParentId());
    }
    if (dto.getName() != null) {
      entity.setName(dto.getName());
    }
    if (dto.getPath() != null) {
      entity.setPath(dto.getPath());
    }
    if (dto.getComponent() != null) {
      entity.setComponent(dto.getComponent());
    }
    if (dto.getIcon() != null) {
      entity.setIcon(dto.getIcon());
    }
    if (dto.getSortOrder() != null) {
      entity.setSortOrder(dto.getSortOrder());
    }
    if (dto.getVisible() != null) {
      entity.setVisible(dto.getVisible());
    }
    sysMenuMapper.updateById(entity);
  }

  @Override
  public void delete(Long id) {
    if (sysMenuMapper.selectById(id) == null) {
      throw new BizException(ResultCode.NOT_FOUND);
    }
    sysMenuMapper.deleteById(id);
  }
}
