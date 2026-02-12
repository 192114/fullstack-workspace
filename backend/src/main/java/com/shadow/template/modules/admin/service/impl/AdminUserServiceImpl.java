package com.shadow.template.modules.admin.service.impl;

import java.time.LocalDate;
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
import com.shadow.template.modules.admin.dto.AdminUserCreateDto;
import com.shadow.template.modules.admin.dto.AdminUserUpdateDto;
import com.shadow.template.modules.admin.vo.AdminUserDetailVo;
import com.shadow.template.modules.admin.vo.AdminUserListVo;
import com.shadow.template.modules.admin.vo.PageResult;
import com.shadow.template.modules.rbac.entity.SysUserRoleEntity;
import com.shadow.template.modules.rbac.mapper.SysUserRoleMapper;
import com.shadow.template.modules.user.dto.UserCreateCommand;
import com.shadow.template.modules.user.entity.UserAuthEntity;
import com.shadow.template.modules.user.entity.UserProfileEntity;
import com.shadow.template.modules.user.enums.GenderEnum;
import com.shadow.template.modules.user.enums.UserStatusEnum;
import com.shadow.template.modules.user.mapper.UserAuthMapper;
import com.shadow.template.modules.user.mapper.UserProfileMapper;
import com.shadow.template.modules.admin.service.AdminUserService;
import com.shadow.template.modules.user.service.UserService;

@Service
public class AdminUserServiceImpl implements AdminUserService {

  @Autowired
  private UserAuthMapper userAuthMapper;
  @Autowired
  private UserProfileMapper userProfileMapper;
  @Autowired
  private SysUserRoleMapper sysUserRoleMapper;
  @Autowired
  private UserService userService;
  @Override
  public PageResult<AdminUserListVo> list(int page, int pageSize, String keyword, Integer status) {
    LambdaQueryWrapper<UserAuthEntity> qw = Wrappers.lambdaQuery();
    if (keyword != null && !keyword.isBlank()) {
      qw.and(w -> w.like(UserAuthEntity::getEmail, keyword));
    }
    if (status != null) {
      qw.eq(UserAuthEntity::getStatus, status == 0 ? UserStatusEnum.DISABLED : UserStatusEnum.ENABLE);
    }
    qw.orderByDesc(UserAuthEntity::getCreateTime);
    Page<UserAuthEntity> p = userAuthMapper.selectPage(new Page<>(page, pageSize), qw);
    List<AdminUserListVo> list = p.getRecords().stream().map(this::toListVo).collect(Collectors.toList());
    return new PageResult<>(list, p.getTotal());
  }

  @Override
  @Transactional
  public Long create(AdminUserCreateDto dto) {
    UserCreateCommand cmd = new UserCreateCommand();
    cmd.setEmail(dto.getEmail());
    cmd.setPassword(dto.getPassword());
    userService.createUser(cmd);
    UserAuthEntity auth = userService.getUserByEmail(dto.getEmail());
    if (dto.getNickname() != null) {
      UserProfileEntity profile = userService.getProfileByUserId(auth.getId());
      profile.setNickname(dto.getNickname());
      userProfileMapper.updateById(profile);
    }
    if (dto.getStatus() != null && dto.getStatus() == 0) {
      userService.disabledUser(auth.getId());
    }
    return auth.getId();
  }

  @Override
  public AdminUserDetailVo getById(Long id) {
    UserAuthEntity auth = userAuthMapper.selectById(id);
    if (auth == null) {
      throw new BizException(ResultCode.NOT_FOUND);
    }
    UserProfileEntity profile = userProfileMapper.selectById(id);
    AdminUserDetailVo vo = new AdminUserDetailVo();
    vo.setId(auth.getId());
    vo.setEmail(auth.getEmail());
    vo.setNickname(profile != null ? profile.getNickname() : null);
    vo.setAvatarUrl(profile != null ? profile.getAvatarUrl() : null);
    vo.setGender(profile != null && profile.getGender() != null ? profile.getGender().getCode() : null);
    vo.setBirthday(profile != null && profile.getBirthday() != null ? profile.getBirthday().toString() : null);
    vo.setBio(profile != null ? profile.getBio() : null);
    vo.setStatus(auth.getStatus() != null ? auth.getStatus().getCode() : null);
    vo.setCreateTime(auth.getCreateTime());
    vo.setUpdateTime(auth.getUpdateTime());
    return vo;
  }

  @Override
  public void update(Long id, AdminUserUpdateDto dto) {
    UserAuthEntity auth = userAuthMapper.selectById(id);
    if (auth == null) {
      throw new BizException(ResultCode.NOT_FOUND);
    }
    UserProfileEntity profile = userProfileMapper.selectById(id);
    if (profile == null) {
      profile = new UserProfileEntity();
      profile.setUserId(id);
      userProfileMapper.insert(profile);
    }
    if (dto.getNickname() != null) {
      profile.setNickname(dto.getNickname());
    }
    if (dto.getAvatarUrl() != null) {
      profile.setAvatarUrl(dto.getAvatarUrl());
    }
    if (dto.getGender() != null) {
      profile.setGender(GenderEnum.fromCode(dto.getGender()));
    }
    if (dto.getBirthday() != null) {
      profile.setBirthday(LocalDate.parse(dto.getBirthday()));
    }
    if (dto.getBio() != null) {
      profile.setBio(dto.getBio());
    }
    userProfileMapper.updateById(profile);
    if (dto.getStatus() != null) {
      auth.setStatus(dto.getStatus() == 0 ? UserStatusEnum.DISABLED : UserStatusEnum.ENABLE);
      userAuthMapper.updateById(auth);
    }
  }

  @Override
  public void delete(Long id) {
    if (userAuthMapper.selectById(id) == null) {
      throw new BizException(ResultCode.NOT_FOUND);
    }
    userProfileMapper.deleteById(id);
    sysUserRoleMapper.delete(Wrappers.lambdaQuery(SysUserRoleEntity.class).eq(SysUserRoleEntity::getUserId, id));
    userAuthMapper.deleteById(id);
  }

  @Override
  public List<Long> getRoleIds(Long userId) {
    LambdaQueryWrapper<SysUserRoleEntity> qw = Wrappers.lambdaQuery();
    qw.eq(SysUserRoleEntity::getUserId, userId);
    return sysUserRoleMapper.selectList(qw).stream()
        .map(SysUserRoleEntity::getRoleId)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public void assignRoles(Long userId, List<Long> roleIds) {
    LambdaQueryWrapper<SysUserRoleEntity> qw = Wrappers.lambdaQuery();
    qw.eq(SysUserRoleEntity::getUserId, userId);
    sysUserRoleMapper.delete(qw);
    for (Long roleId : roleIds) {
      SysUserRoleEntity entity = new SysUserRoleEntity();
      entity.setUserId(userId);
      entity.setRoleId(roleId);
      sysUserRoleMapper.insert(entity);
    }
  }

  private AdminUserListVo toListVo(UserAuthEntity auth) {
    UserProfileEntity profile = userProfileMapper.selectById(auth.getId());
    AdminUserListVo vo = new AdminUserListVo();
    vo.setId(auth.getId());
    vo.setEmail(auth.getEmail());
    vo.setNickname(profile != null ? profile.getNickname() : null);
    vo.setAvatarUrl(profile != null ? profile.getAvatarUrl() : null);
    vo.setStatus(auth.getStatus() != null ? auth.getStatus().getCode() : null);
    vo.setCreateTime(auth.getCreateTime());
    return vo;
  }
}
