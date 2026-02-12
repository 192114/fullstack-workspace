package com.shadow.template.modules.rbac.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shadow.template.common.exception.BizException;
import com.shadow.template.common.result.ResultCode;
import com.shadow.template.modules.admin.dto.RoleCreateDto;
import com.shadow.template.modules.admin.dto.RoleUpdateDto;
import com.shadow.template.modules.admin.vo.PageResult;
import com.shadow.template.modules.admin.vo.RoleDetailVo;
import com.shadow.template.modules.admin.vo.RoleListVo;
import com.shadow.template.modules.rbac.entity.SysRoleEntity;
import com.shadow.template.modules.rbac.entity.SysRolePermissionEntity;
import com.shadow.template.modules.rbac.enums.RoleStatusEnum;
import com.shadow.template.modules.rbac.enums.RoleTypeEnum;
import com.shadow.template.modules.rbac.mapper.SysRoleMapper;
import com.shadow.template.modules.rbac.mapper.SysRolePermissionMapper;
import com.shadow.template.modules.rbac.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

  @Autowired
  private SysRoleMapper sysRoleMapper;
  @Autowired
  private SysRolePermissionMapper sysRolePermissionMapper;

  @Override
  public PageResult<RoleListVo> list(int page, int pageSize, String keyword) {
    LambdaQueryWrapper<SysRoleEntity> qw = Wrappers.lambdaQuery();
    if (keyword != null && !keyword.isBlank()) {
      qw.and(w -> w.like(SysRoleEntity::getCode, keyword).or().like(SysRoleEntity::getName, keyword));
    }
    qw.orderByAsc(SysRoleEntity::getId);
    Page<SysRoleEntity> p = sysRoleMapper.selectPage(new Page<>(page, pageSize), qw);
    List<RoleListVo> list = p.getRecords().stream().map(this::toListVo).collect(Collectors.toList());
    return new PageResult<>(list, p.getTotal());
  }

  @Override
  public Long create(RoleCreateDto dto) {
    LambdaQueryWrapper<SysRoleEntity> qw = Wrappers.lambdaQuery();
    qw.eq(SysRoleEntity::getCode, dto.getCode());
    if (sysRoleMapper.selectCount(qw) > 0) {
      throw new BizException(ResultCode.PARAM_ERROR);
    }
    SysRoleEntity entity = new SysRoleEntity();
    entity.setCode(dto.getCode());
    entity.setName(dto.getName());
    entity.setDescription(dto.getDescription());
    entity.setType(RoleTypeEnum.fromCode(dto.getType()));
    entity.setStatus(dto.getStatus() != null && dto.getStatus() == 0 ? RoleStatusEnum.DISABLED : RoleStatusEnum.ENABLE);
    sysRoleMapper.insert(entity);
    return entity.getId();
  }

  @Override
  public RoleDetailVo getById(Long id) {
    SysRoleEntity entity = sysRoleMapper.selectById(id);
    if (entity == null) {
      throw new BizException(ResultCode.NOT_FOUND);
    }
    return toDetailVo(entity);
  }

  @Override
  public void update(Long id, RoleUpdateDto dto) {
    SysRoleEntity entity = sysRoleMapper.selectById(id);
    if (entity == null) {
      throw new BizException(ResultCode.NOT_FOUND);
    }
    if (dto.getName() != null) {
      entity.setName(dto.getName());
    }
    if (dto.getDescription() != null) {
      entity.setDescription(dto.getDescription());
    }
    if (dto.getStatus() != null) {
      entity.setStatus(dto.getStatus() == 0 ? RoleStatusEnum.DISABLED : RoleStatusEnum.ENABLE);
    }
    sysRoleMapper.updateById(entity);
  }

  @Override
  public void delete(Long id) {
    if (sysRoleMapper.selectById(id) == null) {
      throw new BizException(ResultCode.NOT_FOUND);
    }
    sysRoleMapper.deleteById(id);
  }

  @Override
  public List<Long> getPermissionIds(Long roleId) {
    LambdaQueryWrapper<SysRolePermissionEntity> qw = Wrappers.lambdaQuery();
    qw.eq(SysRolePermissionEntity::getRoleId, roleId);
    return sysRolePermissionMapper.selectList(qw).stream()
        .map(SysRolePermissionEntity::getPermissionId)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public void assignPermissions(Long roleId, List<Long> permissionIds) {
    LambdaQueryWrapper<SysRolePermissionEntity> qw = Wrappers.lambdaQuery();
    qw.eq(SysRolePermissionEntity::getRoleId, roleId);
    sysRolePermissionMapper.delete(qw);
    for (Long permissionId : permissionIds) {
      SysRolePermissionEntity entity = new SysRolePermissionEntity();
      entity.setRoleId(roleId);
      entity.setPermissionId(permissionId);
      sysRolePermissionMapper.insert(entity);
    }
  }

  private RoleListVo toListVo(SysRoleEntity e) {
    RoleListVo vo = new RoleListVo();
    vo.setId(e.getId());
    vo.setCode(e.getCode());
    vo.setName(e.getName());
    vo.setDescription(e.getDescription());
    vo.setType(e.getType() != null ? e.getType().getCode() : null);
    vo.setStatus(e.getStatus() != null ? e.getStatus().getCode() : null);
    vo.setCreateTime(e.getCreateTime());
    return vo;
  }

  private RoleDetailVo toDetailVo(SysRoleEntity e) {
    RoleDetailVo vo = new RoleDetailVo();
    vo.setId(e.getId());
    vo.setCode(e.getCode());
    vo.setName(e.getName());
    vo.setDescription(e.getDescription());
    vo.setType(e.getType() != null ? e.getType().getCode() : null);
    vo.setStatus(e.getStatus() != null ? e.getStatus().getCode() : null);
    vo.setCreateTime(e.getCreateTime());
    vo.setUpdateTime(e.getUpdateTime());
    return vo;
  }
}
