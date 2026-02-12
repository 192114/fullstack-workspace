package com.shadow.template.modules.rbac.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.shadow.template.modules.admin.vo.PermissionTreeVo;
import com.shadow.template.modules.rbac.entity.SysPermissionEntity;
import com.shadow.template.modules.rbac.mapper.SysPermissionMapper;
import com.shadow.template.modules.rbac.service.PermissionService;

@Service
public class PermissionServiceImpl implements PermissionService {

  @Autowired
  private SysPermissionMapper sysPermissionMapper;

  @Override
  public List<String> getPermissionCodesByUserId(Long userId) {
    return sysPermissionMapper.selectPermissionCodesByUserId(userId);
  }

  @Override
  public List<PermissionTreeVo> getTree() {
    LambdaQueryWrapper<SysPermissionEntity> qw = Wrappers.lambdaQuery();
    qw.orderByAsc(SysPermissionEntity::getSortOrder);
    List<SysPermissionEntity> all = sysPermissionMapper.selectList(qw);
    return buildPermissionTree(all, 0L);
  }

  private List<PermissionTreeVo> buildPermissionTree(List<SysPermissionEntity> all, Long parentId) {
    return all.stream()
        .filter(p -> java.util.Objects.equals(p.getParentId(), parentId))
        .map(p -> {
          PermissionTreeVo vo = new PermissionTreeVo();
          vo.setId(p.getId());
          vo.setCode(p.getCode());
          vo.setName(p.getName());
          vo.setType(p.getType() != null ? p.getType().getCode() : null);
          vo.setParentId(p.getParentId());
          vo.setSortOrder(p.getSortOrder());
          vo.setChildren(buildPermissionTree(all, p.getId()));
          return vo;
        })
        .collect(Collectors.toList());
  }
}
